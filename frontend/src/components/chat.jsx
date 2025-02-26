import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  Loader,
  Loader2,
  Pin,
  PinIcon,
  Search,
  Send,
} from "lucide-react";
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
import socket from "../../helper/socket";
import { setMessage } from "@/store/messages";
import { useDispatch } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";

function formatLastSeen(dateString) {
  if (!dateString) return "";

  const givenDate = new Date(dateString);
  const currentDate = new Date();
  const diffInMs = currentDate - givenDate;

  // Convert to different time units
  const minutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Show appropriate time format
  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else {
    // For older dates, show the full date and time
    return givenDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

function Chat({}) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const { userId } = useAuth();
  //console.log(userId);
  const location = useLocation();
  const reciverID = location.pathname.split("/")[4];
  // console.log(reciverID);

  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef(null);
  const [filePath, setFile] = useState(null);
  const { chatuserlist, conversationLoad, conversationID } = useSelector(
    (state) => state.chatlist
  );
  const { onlineUsers } = useSelector((state) => state.messages);
  console.log(onlineUsers, "onlineUsers");
  const [loading, setLoading] = useState(false);
  const { messages } = useSelector((state) => state.messages);
  //console.log(chatuserlist, "chatuserlist");
  // console.log(inputValue, "inputValue");
  // console.log(messages, "messages");

  const getUsername = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3006/api/users/getUser/${reciverID}`,
        {
          withCredentials: true,
        }
      );
      // console.log(response.data, "response.data");
      setUsername(response.data.username);
    } catch (error) {
      console.log(error);
    }
  };

  const { data: lastSeen } = useQuery({
    queryKey: ["lastSeen", reciverID],
    queryFn: async () => {
      try {
        // console.log(userId, "userId");
        console.log(reciverID, "reciverID");

        const response = await axios.get(
          `http://localhost:3006/api/users/last-seen/${reciverID}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data, "response.data");
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!userId,
  });
  console.log(lastSeen, "lastSeen");

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

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
  console.log(conversationID, "conversationID");
  // console.log(userId, reciverID, "userId, reciverID");
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
            image: filePath,
          },
          {
            withCredentials: true,
          }
        );
        console.log(response);

        socket.emit("sendMessage", {
          messages: inputValue,
          senderId: userId,
          receiverId: reciverID,
          ReadReceipts: "sent",
          messageImage: filePath,
          conversationID: conversationID,
        });

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

  // useEffect(() => {
  //   socket.emit("readMessage", {
  //     messageData: {
  //       userId: userId,
  //     },
  //   });

  // }, [messages]);
  const {
    data: Messages,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["sendMessageData", reciverID, conversationID],
    queryFn: async () => {
      console.log(conversationID, "conversationID");
      getUsername();
      try {
        const reponse = await axios.get(
          `http://localhost:3006/api/messages/get-messages/${conversationID}`,
          {
            withCredentials: true,
          }
        );
        console.log(reponse.data, "dataaaaaa");
        dispatch(setMessage(reponse.data));
        return reponse.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!conversationID,
  });

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    if (chatuserlist[0].requestStatus == "pending") {
      toast("Please wait for the user to accept your request");
      return;
    }
    socket.emit("readMessage", {
      messageData: {
        userId: userId,
      },
    });
    sendMessage();
  };

  socket.on("message-read", (data) => {
    console.log("Received read update:", data);

    dispatch(
      setMessage(
        messages.map((msg) =>
          msg.conversationID === data.conversationId
            ? { ...msg, ReadReceipts: "read" }
            : msg
        )
      )
    );
  });

  useEffect(() => {
    socket.on("message", (message) => {
      console.log(message.senderId, "message sender");
      console.log(message.receiverId, "message receiver");
      console.log(reciverID, "current chat partner id");
      console.log(userId, "current user id");
      console.log(message, "message");

      // Add the latest message first
      dispatch(setMessage([...messages, message]));

      // Only mark as "read" if the receiver is the current user AND they are viewing the chat
      if (message.receiverId === userId && reciverID === message.senderId) {
        console.log("Marking message as read...");

        // Emit socket event to update DB
        socket.emit("readMessage", {
          messageData: {
            userId: userId,
            conversationId: message.conversationID,
          },
        });

        // Update Redux state for read receipt
        dispatch(
          setMessage([
            ...messages.map((msg) =>
              msg.conversationID === message.conversationID
                ? { ...msg, ReadReceipts: "read" }
                : msg
            ),
            message, // Ensure the latest message is still added
          ])
        );
      }
    });

    return () => {
      socket.off("message");
    };
  }, [userId, reciverID, dispatch, messages]);

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
        <div className="flex justify-between  backdrop-blur-sm items-center p-4">
          <h1 className="text-2xl font-bold">Chat</h1>
          <h1 className="text-2xl font-bold">
            {username.userName ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-gray-600">{username.userName}</span>
                <span className="text-gray-400 text-sm">
                  {lastSeen?.lastSeen && !onlineUsers.includes(reciverID)
                    ? `Last Seen : ${formatLastSeen(lastSeen.lastSeen)}`
                    : "Online"}
                </span>
              </div>
            ) : (
              <Skeleton className="w-24 h-4" />
            )}
          </h1>
        </div>
        <div className="h-full overflow-y-auto p-4 pb-30">
          <>
            {conversationLoad || isLoading ? (
              <div className="flex flex-col gap-4 p-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className={`flex flex-col gap-2 max-w-[60%]`}>
                      <Skeleton
                        className={`h-10 w-40 rounded-2xl ${
                          index % 2 === 0 ? "bg-amber-50/50" : "bg-blue-600/50"
                        }`}
                      />
                      <Skeleton
                        className={`h-4 w-20 ${
                          index % 2 === 0 ? "ml-2" : "ml-auto mr-2"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              messages.length !== 0 &&
              messages?.map((message) => (
                // console.log(message, "dataaaaaa"),
                <div key={message.id} className=" relative flex flex-col mb-4">
                  {/* {console.log(message.messageImage)} */}
                  {message.messageImage && (
                    <div
                      className={`flex ${
                        message.senderId === userId
                          ? "justify-end"
                          : "justify-start"
                      } p-2`}
                    >
                      <div
                        className={`w-50 p-2 rounded-lg ${
                          message.senderId === userId
                            ? "bg-blue-600"
                            : "bg-amber-50"
                        }`}
                      >
                        <IKImage
                          urlEndpoint="https://ik.imagekit.io/hicgxab6ot"
                          path={message.messageImage}
                          transformation={[
                            {
                              height: 200,
                              width: 200,
                            },
                          ]}
                          loading="lazy"
                          onError={(err) => {
                            console.error("Image load error:", err);
                            // Optionally show a fallback image
                          }}
                          onLoad={() => {
                            console.log(
                              "Image loaded successfully:",
                              message.messageImage
                            );
                          }}
                          alt="Message Image"
                          className="max-w-full h-auto rounded"
                          // Add error fallback
                          errorComponent={
                            <div className="bg-gray-200 p-4 rounded">
                              Failed to load image
                            </div>
                          }
                        />
                      </div>
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

                    {message.senderId === userId && (
                      <CheckCheck
                        className={`${
                          message.ReadReceipts === "read"
                            ? "text-green-500"
                            : "text-gray-500"
                        } text-[14px] w-4 h-10 absolute bottom-[-12px] right-1.5`}
                      />
                    )}
                  </p>
                </div>
              ))
            )}
            {isLoading && messages.length === 0 && (
              <div className="flex  justify-center h-full">
                <p className="text-lg text-gray-600">
                  Please send a message to have a conversation
                </p>
              </div>
            )}
          </>
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
