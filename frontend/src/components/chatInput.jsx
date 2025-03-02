import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PinIcon } from "lucide-react";
import { Send } from "lucide-react";
import ProfileUpload from "@/helper/ProfileImg";
import { IKImage } from "imagekitio-react";

function ChatInput({
  inputValue,
  setInputValue,
  handleSend,
  filePath,
  loading,
  fileInputRef,
  handleFileClick,
  handleUpload,
  conversationLoad,
}) {
  return (
    <div className="w-full p-4  rounded-lg backdrop-blur-sm">
      <div className="w-[100%] mx-auto  relative border-none">
        {/* You can display a preview image if needed */}
        {loading && (
          <div className="text-white  flex items-center m-3 ">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {filePath && (
          <>
            <IKImage
              urlEndpoint="https://ik.imagekit.io/hicgxab6ot"
              path={filePath}
              transformation={[{ height: 100, width: 100 }]}
              alt="Profile Preview"
            />
          </>
        )}
        <div className="relative rounded-lg flex items-center">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => {
              e.preventDefault();
              setInputValue(e.target.value);
            }}
            className="rounded-full h-12 pl-14 pr-14 bg-white/80 backdrop-blur-sm focus:ring-2  focus:ring-blue-500 border-none"
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => {
              e.preventDefault();
              if (e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
          <ProfileUpload ref={fileInputRef} />
          {/* Pin button that triggers file input */}
          <Button
            onClick={handleFileClick}
            className="absolute left-2 p-2 hover:bg-gray-100/80 transition-colors rounded-full"
            variant="ghost"
            size="icon"
            type="button"
          >
            <PinIcon className="h-5 w-5 text-gray-600" />
          </Button>

          <Button
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full "
            size="icon"
            onClick={handleSend}
            disabled={inputValue.trim() === "" || conversationLoad}
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
