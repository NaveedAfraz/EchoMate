import React, { useEffect, useRef, useState } from "react";
import { Check, CheckCheck } from "lucide-react";
import logo from "@/assets/3px-tile.png";
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
import ChatHeader from "@/components/chatHeader";
import ChatInput from "@/components/chatInput";
import ChatSkeleton from "@/components/ChatSkeleton";
function Chat() {
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
  const { chatuserlist, conversationLoad, conversationID, isGroup } =
    useSelector((state) => state.chatlist);
  const { onlineUsers } = useSelector((state) => state.messages);
  // console.log(onlineUsers, "onlineUsers....");
  const [loading, setLoading] = useState(false);
  const { messages } = useSelector((state) => state.messages);
  //console.log(chatuserlist, "chatuserlist");
  // console.log(inputValue, "inputValue");
  // console.log(messages, "messages");
  // console.log(isGroup, "isGroup...");
  const getUsername = async () => {
    try {
      // console.log(reciverID, "reciverID");
      const response = await axios.get(
        `http://localhost:3006/api/users/getUser/${reciverID}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data, "response.data");
      setUsername(response.data.username);
    } catch (error) {
      // console.log(error);
    }
  };
  // console.log(reciverID, "reciverID....");

  const { data: lastSeen } = useQuery({
    queryKey: ["lastSeen", reciverID],
    queryFn: async () => {
      try {
        // console.log(userId, "userId");
        // console.log(reciverID, "reciverID");

        const response = await axios.get(
          `http://localhost:3006/api/users/last-seen/${reciverID}`,
          {
            withCredentials: true,
          }
        );
        // console.log(response.data, "response.data");
        return response.data;
      } catch (error) {
        // console.log(error);
      }
    },
    enabled: !!userId,
  });
  // console.log(lastSeen, "lastSeen....");

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (file) => {
    // console.log(location.pathname.split("/"));

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
      // console.log(response);

      const data = await response.json();
      // console.log(data);
      if (data.success) {
        // console.log("Uploaded Image URL:", data.imageUrl);
        const baseUrl = "https://ik.imagekit.io/hicgxab6ot";
        const filePath = data.imageUrl.replace(baseUrl, "");
        const normalizedPath = filePath.startsWith("/")
          ? filePath
          : `/${filePath}`;
        setFile(normalizedPath);
        toast("Image uploaded successfully");
      }
    } catch (error) {
      console.log(error); // Keep error log
      toast("Error uploading file");
      console.error("Error uploading file:", error); // Keep error log
    }
    // console.log(location.pathname.split("/"));
    setLoading(false);
  };
  // console.log(conversationID, "conversationID");
  // console.log(userId, reciverID, "userId, reciverID");
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async () => {
      // console.log(inputValue, "inputValue");
      if (inputValue.trim() === "") return;
      if (chatuserlist[0].requestStatus == "pending") {
        toast("Please wait for the user to accept your request");
        return;
      }
      // console.log(conversationID, "conversationID");
      // console.log(isGroup, "isGroup");
      let endpoint;
      if (conversationID && !isGroup) {
        endpoint = `http://localhost:3006/api/messages/start-new-conversation`;
      } else {
        // console.log("group conversation");
        endpoint = `http://localhost:3006/api/messages/start-group-conversation`;
      }
      // console.log(endpoint, "endpoint");
      try {
        const response = await axios.post(
          endpoint,
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
        // console.log(response);
        let readReceipt;
        let reciver;

        if (isGroup) {
          // console.log("group conversation");
          readReceipt = "delivered";
          reciver = "group";
        }

        socket.emit("sendMessage", {
          messages: inputValue,
          senderId: userId,
          receiverId: reciver || reciverID,
          ReadReceipts: readReceipt,
          messageImage: filePath,
          conversationId: conversationID,
        });

        // toast.success(response.data.message);
        setInputValue("");
        setFile(null);
        return response.data;
      } catch (error) {
        console.log(error); // Keep error log
        toast.error(error.response.data.message);
      }
    },
  });
  // console.log(conversationID, "conversationID");
  const {
    data: Messages,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["sendMessageData", reciverID, conversationID, isGroup],
    queryFn: async () => {
      console.log("=== FETCHING MESSAGES ===");
      console.log("Params:", { reciverID, conversationID, isGroup });

      getUsername();
      try {
        if (!conversationID) {
          console.log("No conversationID, returning empty array");
          dispatch(setMessage([]));
          return [];
        }

        console.log("Clearing previous messages");
        dispatch(setMessage([]));

        console.log("Fetching messages for conversationID:", conversationID);
        const response = await axios.get(
          `http://localhost:3006/api/messages/get-messages/${conversationID}`,
          {
            withCredentials: true,
          }
        );

        console.log("Messages received:", {
          count: response.data.length,
          firstMessage: response.data[0],
          lastMessage: response.data[response.data.length - 1],
          conversationID,
        });

        dispatch(setMessage(response.data));
        return response.data;
      } catch (error) {
        console.error("Error fetching messages:", error);
        dispatch(setMessage([]));
        return [];
      }
    },
    enabled: !!conversationID && !!reciverID,
    // IMPORTANT: Don't cache results between conversations
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const handleSend = async () => {
    if (inputValue.trim() === "") return;
    // console.log(chatuserlist, "chatuserlist");
    if (chatuserlist[0].requestStatus == "pending") {
      toast("Please wait for the user to accept your request");
      return;
    }
    sendMessage();
  };

  socket.on("message-read", (data) => {
    dispatch(
      setMessage(
        messages.map((msg) =>
          msg.conversationID === data.conversationId
            ? { ...msg, ReadReceipts: data.newStatus }
            : msg
        )
      )
    );
  });

  useEffect(() => {
    const handleMessage = (message) => {
      console.log("=== SOCKET MESSAGE RECEIVED ===");
      console.log("Message:", message);
      console.log("Current state:", {
        reciverID,
        userId,
        messageConversationId: message.conversationId,
        currentConversationID: conversationID,
      });

      // IMPORTANT: Only process messages for the current conversation
      if (message.conversationId !== conversationID) {
        console.log("Message is for a different conversation, ignoring");
        return;
      }

      if (
        (message.senderId === reciverID && message.receiverId === userId) ||
        (message.senderId === userId && message.receiverId === reciverID)
      ) {
        const currentMessages = [...messages];
        // console.log(message, "message...");
        if (message.senderId === reciverID && message.receiverId === userId) {
          // Incoming message - mark as read
          // console.log(message, "message...");

          const updatedMessage = { ...message, ReadReceipts: "read" };

          // Tell server message has been read
          socket.emit("readMessage", {
            messageData: {
              userId: userId,
              conversationId: message.conversationID,
            },
          });

          // Add to messages (no functional update)
          dispatch(setMessage([...currentMessages, updatedMessage]));
        } else {
          // Outgoing message - add to messages (no functional update)
          // console.log(message, "message...");
          dispatch(setMessage([...currentMessages, message]));
        }
      }
      if (message.receiverId == "group") {
        // console.log("group message");
        // console.log(message, "message");

        const currentMessages = [...messages]; // Clone
        dispatch(setMessage([...currentMessages, message]));
      }
    };

    socket.on("message", handleMessage);
    return () => {
      console.log("Removing message handler");
      socket.off("message", handleMessage);
    };
  }, [userId, reciverID, conversationID, messages, dispatch]);

  useEffect(() => {
    console.log("=== MESSAGES UPDATED ===");
    console.log("Current messages:", {
      count: messages.length,
      conversationID,
      isGroup,
    });
  }, [messages, conversationID, isGroup]);

  useEffect(() => {
    dispatch(setMessage([]));
  }, []);

  useEffect(() => {
    dispatch(setMessage([]));
  }, [conversationID]);

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
        <ChatHeader lastSeen={lastSeen} username={username} reciverID={reciverID}/>
        <div className="h-[90%] overflow-y-auto p-4">
          <>
            {conversationLoad || isLoading ? (
              <ChatSkeleton />
            ) : (
              messages.length !== 0 &&
              messages?.map((message) => (
                <div key={message.id} className="relative flex flex-col mb-4">
                  {/* {console.log(message, "message")} */}
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
                            // console.log(
                            //   "Image loaded successfully:",
                            //   message.messageImage
                            // );
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
                    {message.senderId === userId &&
                      (message.ReadReceipts === "delivered" ||
                      message.ReadReceipts === "read" ? (
                        <CheckCheck
                          className={`${
                            message.ReadReceipts === "read"
                              ? "text-green-500"
                              : "text-gray-500"
                          } text-[14px] w-4 h-10 absolute bottom-[-12px] right-1.5`}
                        />
                      ) : (
                        <Check />
                      ))}
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
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        filePath={filePath}
        loading={loading}
        fileInputRef={fileInputRef}
        handleFileClick={handleFileClick}
        handleUpload={handleUpload}
        conversationLoad={conversationLoad}
      />
    </div>
  );
}

export default Chat;
