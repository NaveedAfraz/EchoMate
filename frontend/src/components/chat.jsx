import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { Loader, Loader2, Pin, PinIcon, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/3px-tile.png";
import ProfileUpload from "@/helper/ProfileImg";
import { IKImage } from "imagekitio-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
function Chat() {
  const { userId } = useAuth();
  console.log(userId);
  const location = useLocation();
  const reciverID = location.pathname.split("/")[4];
  console.log(reciverID);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef(null);
  const [filePath, setFile] = useState(null);
  // const { toast } = useToast();
  const { chatuserlist, conversationLoad, conversationID } = useSelector(
    (state) => state.chatlist
  );
  //console.log(chatuserlist, "chatuserlist");
  console.log(inputValue, "inputValue");

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (file) => {
    console.log(location.pathname.split("/"));

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
      }
    } catch (error) {
      toast("Error uploading file");
      console.error("Error uploading file:", error);
    }
    console.log(location.pathname.split("/"));
    setLoading(false);
  };
  console.log(userId, reciverID, "userId, reciverID");
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async () => {
      console.log(inputValue, "inputValue");
      if (inputValue.trim() === "") return;
      if (chatuserlist[0].requestStatus == "pending") {
        toast("Please wait for the user to accept your request");
        return;
      }
      console.log(conversationID, "conversationID");

      try {
        const response = await axios.post(
          `http://localhost:3006/api/messages/start-new-conversation`,
          {
            message: inputValue,
            senderId: userId,
            receiverId: reciverID,
            conversationID: conversationID,
          },
          {
            withCredentials: true,
          }
        );
        console.log(response);
        toast.success(response.data.message);
        setInputValue("");
        setFile(null);
        return response.data;
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    },
  });

  const {
    data: Messages,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["sendMessageData"],
    queryFn: async () => {
      try {
        const reponse = await axios.get(
          `http://localhost:3006/api/messages/get-messages/${conversationID}`,
          {
            withCredentials: true,
          }
        );
        console.log(reponse.data[0].messages, "dataaaaaa");

        return reponse.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!conversationID,
  });
  console.log(Messages, "Messages");

  const handleSend = async () => {
    if (inputValue.trim() === "") return;
    if (chatuserlist[0].requestStatus == "pending") {
      toast("Please wait for the user to accept your request");
      return;
    }
    sendMessage();
    // setMessages((prevMessages) => [
    //   ...prevMessages,
    //   {
    //     id: prevMessages.length + 1,
    //     content: inputValue,
    //     sender: "user",
    //     image: filePath,
    //   },
    // ]);
    // setInputValue("");
    setFile(null);
  };
  console.log("Chat mounted");
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
          {conversationLoad || isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : Messages && Messages.length !== 0 ? (
            Messages?.map(
              (message) => (
                console.log(message, "dataaaaaa"),
                (
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
                        <p>{message}</p>
                      </div>
                    )}
                    <p
                      className={`${
                        message.senderId === userId
                          ? "bg-blue-600 self-end text-white"
                          : " bg-amber-50 self-start"
                      } rounded-2xl px-4 py-2 max-w-[80%] break-words`}
                    >
                      {message.messages}
                    </p>
                  </div>
                )
              )
            )
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
      </div>{" "}
    </div>
  );
}

export default Chat;
