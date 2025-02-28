import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ProfileUpload from "@/helper/ProfileImg";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { IKImage } from "imagekitio-react";
import { useAuth } from "@clerk/clerk-react";

function AddGroup() {
  const [groupTitle, setGroupTitle] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    console.log(location.pathname.split("/"));

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    fileInputRef.current.value = null;
    setFile(null);
    try {
      const response = await fetch("http://localhost:3006/api/imageUpload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      console.log(response);

      const data = await response.json();
      console.log(data);
      if (data.success) {
        console.log("Uploaded Image URL:", data.imageUrl);
        const baseUrl = "https://ik.imagekit.io/hicgxab6ot";
        const filePath = data.imageUrl.replace(baseUrl, "");
        const normalizedPath = filePath.startsWith("/")
          ? filePath
          : `/${filePath}`;
        setFile(normalizedPath);
        toast("Image uploaded successfully");
      }
    } catch (error) {
      toast("Error uploading file");
      console.error("Error uploading file:", error);
    }
    console.log(location.pathname.split("/"));
    setLoading(false);
  };
  const { userId } = useAuth();
  const {
    isLoading,
    isError,
    mutate: createGroup,
    data: groupData,
    error: groupError,
  } = useMutation({
    mutationFn: async () => {
      try {
        const response = await axios.post(
          "http://localhost:3006/api/users/newGroup",
          {
            groupName: groupTitle,
            userId,
            groupImage: file,
          },
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        if (response.data.success) {
          toast("Group created successfully");
        }
        return response.data;
      } catch (error) {
        toast("Error creating group");
        console.log(error);
      }
    },
  });
  const handleCreateGroup = () => {
    // Add your logic to create a group here.
    console.log("Group Title:", groupTitle);
    console.log("Group Image:", groupImage);

    createGroup();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Enter a group title and select an image to represent your group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            placeholder="Group Title"
            className="w-full"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Group Image
            </label>
            {loading ? (
              <Loader className="h-9 w-9 mt-4 animate-pulse" />
            ) : file ? (
              <IKImage
                urlEndpoint="https://ik.imagekit.io/hicgxab6ot"
                path={file}
                className="h-24 w-24 rounded-2xl  object-cover object-center mt-3"
                transformation={[{ height: 100, width: 100 }]}
                alt="grp image Preview"
              />
            ) : (
              <input
                type="file"
                ref={fileInputRef}
                className=""
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  e.preventDefault();
                  if (e.target.files[0]) {
                    handleUpload(e.target.files[0]);
                  }
                }}
              />
            )}
            <ProfileUpload ref={fileInputRef} />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreateGroup}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddGroup;
