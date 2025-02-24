import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { Loader, Loader2, Pin, PinIcon, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/3px-tile.png";
import ProfileUpload from "@/helper/ProfileImg";
import { IKImage } from "imagekitio-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
function Chat() {
  const { userId } = useAuth();
  console.log(userId);
  const location = useLocation();
  const reciverID = location.pathname.split("/")[3];
  console.log(reciverID);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef(null);
  const [filePath, setFile] = useState(null);
  // const { toast } = useToast();
  const { chatuserlist } = useSelector((state) => state.chatlist);
  console.log(chatuserlist, "chatuserlist");

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
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
        // console.log("Normalized File Path:", normalizedPath);
      }
    } catch (error) {
      toast("Error uploading file");
      console.error("Error uploading file:", error);
    }
    setLoading(false);
  };
  // console.log(messages);

  const {} = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3006/api/chat", {
        withCredentials: true,
      });
      console.log(response);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const {} = useMutation({
    mutationFn: async () => {
      const response = await axios.post("http://localhost:3006/api/chat", {
        withCredentials: true,
      });
      console.log(response);
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSend = async () => {
    if (inputValue.trim() === "") return;
    if (chatuserlist[0].requestStatus == "pending") {
      //alert("pending");
      toast("Please wait for the user to accept your request");
      return;
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        content: inputValue,
        sender: "user",
        image: filePath,
      },
    ]);
    setInputValue("");
    setFile(null);
  };

  return (
    <div className="flex flex-col h-[100%] relative">
      <div className="absolute inset-0 ">
        <img
          src={logo}
          alt="logo"
          className="w-full h-full object-cover blur-sm"
        />
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 pb-6">
          {messages.length !== 0 ? (
            messages.map((message) => (
              <div key={message.id} className="flex flex-col mb-4">
                {message.image && (
                  <div className="flex justify-end p-2">
                    <div className="w-50 bg-amber-600 p-2 rounded-lg">
                      <IKImage
                        urlEndpoint="https://ik.imagekit.io/hicgxab6ot"
                        path={message.image}
                        transformation={[{ height: 200, width: 200 }]}
                        alt="IMage Preview"
                      />
                    </div>
                  </div>
                )}
                <p
                  className={`${
                    message.sender === "user"
                      ? "bg-blue-600 self-end text-white"
                      : " bg-amber-50 self-start"
                  } rounded-2xl px-4 py-2 max-w-[80%] break-words`}
                >
                  {message.content}
                </p>
              </div>
            ))
          ) : (
            <div className="flex  justify-center h-full">
              <p className="text-lg text-gray-600">
                Please send a message for conversation
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Input section */}
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
              {console.log(filePath)}
              <IKImage
                urlEndpoint="https://ik.imagekit.io/hicgxab6ot"
                path={filePath}
                transformation={[{ height: 100, width: 100 }]}
                alt="Profile Preview"
              />{" "}
            </>
          )}
          <div className="relative rounded-lg flex items-center">
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="rounded-full h-12 pl-14 pr-14 bg-white/80 backdrop-blur-sm focus:ring-2  focus:ring-blue-500 border-none"
            />

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => {
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
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full"
              size="icon"
              onClick={handleSend}
            >
              <Send className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}

export default Chat;
