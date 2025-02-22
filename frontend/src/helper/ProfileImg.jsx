// components/ProfileUpload.jsx
import { IKContext, IKUpload } from "imagekitio-react";
import { useUser } from "@clerk/clerk-react";

export default function ProfileUpload() {
  const { user } = useUser();
  console.log(user);
  
  return (
    <IKContext
      publicKey={import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_URL_ENDPOINT}
      authenticationEndpoint={import.meta.env.VITE_IMAGE_KIT_AUTH_ENDPOINT}
    >
      <IKUpload
        fileName={`user-avatar.png`} 
        folder="/user-uploads" 
        useUniqueFileName={false}
        onSuccess={(res) => {
          // Update Clerk user metadata with ImageKit URL
          user.update({
            publicMetadata: {
              profileImage: res.url
            }
          });
        }}
        onError={(err) => console.error("Upload failed:", err)}
        className="hidden" // Hide default UI
      />
    </IKContext>
  );
}