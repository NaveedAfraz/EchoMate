import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatList,
  setConversationLoad,
  setConversationID,
  setgroup,
} from "@/store/chatlist";
import { Skeleton } from "@/components/ui/skeleton";
import socket from "../../helper/socket";
import AddGroup from "./AddGroup";
import { IKImage } from "imagekitio-react";
import { setMessage } from "@/store/messages";
import AddMembers from "./AddMembers";
function ChatList({ selectedChat, setSelectedChat }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  // console.log(userId, "userId");
  const { chatuserlist, conversationLoad, isGroup } = useSelector(
    (state) => state.chatlist
  );
  const [groups, setgroups] = useState([]);
  // console.log(chatuserlist, "chatuserlist");
  const { onlineUsers } = useSelector((state) => state.messages);
  const location = useLocation();
  const receiverID = location.pathname.split("/")[4];
  const dispatch = useDispatch();
  // console.log(receiverID, "receiverID");
  // console.log(userId, "userId");
  const {
    data: chatList,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["chats", search],
    queryFn: async ({ isGroup }) => {
      try {
        const endpoint = search
          ? `http://localhost:3006/api/users/fetchUsers/${search}`
          : `http://localhost:3006/api/users/fetchRequestedUsers`;

        const response = await axios.get(endpoint, { withCredentials: true });
        // console.log(response);
        // queryClient.invalidateQueries({ queryKey: ["chats"] });
        setgroups(response.data.group);
        //dispatch(setConversationID({ conversationID: response.data.group.id }));
        return response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    retry: false,
    staleTime: 10000,
  });

  // useEffect(() => {
  //   refetch();
  // }, [search]);

  const navigate = useNavigate();
  const handleSendRequest = async (reciverID) => {
    try {
      const response = await axios.post(
        `http://localhost:3006/api/users/sendRequest/${userId}`,
        {
          receiverID: reciverID,
        },
        {
          withCredentials: true,
        }
      );
      //console.log(response);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const {
    data: conversationID,
    isLoading: conversationLoading,
    isError: conversationError,
    refetch: refetchConversation,
  } = useQuery({
    queryKey: ["conversation", receiverID, isGroup],
    queryFn: async () => {
      try {
        console.log("Checking conversation for:", {
          receiverID,
          userId,
          isGroup,
        });

        // Clear previous conversation data
        dispatch(setConversationID({ conversationID: null }));
        dispatch(setMessage([]));

        const response = await axios.post(
          `http://localhost:3006/api/messages/check-conversation`,
          {
            senderId: userId,
            receiverId: receiverID,
            isGroup: isGroup,
          },
          {
            withCredentials: true,
          }
        );

        console.log("Conversation check response:", response.data);

        if (response.status === 401 || !response.data) {
          return null;
        }

        // Update Redux with the new conversation ID
        dispatch(
          setConversationID({
            conversationID: response.data,
            isGroup: isGroup,
          })
        );

        return response.data;
      } catch (error) {
        console.error("Conversation check error:", error);
        return null;
      }
    },
    enabled: Boolean(userId) && Boolean(receiverID),
    retry: 0,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });

  dispatch(setConversationLoad(conversationLoading));
  // console.log(conversationID);

  const handleCheckConversation = async ({ receiverID, isGroup }) => {
    console.log("=== CHAT BUTTON CLICKED ===");
    console.log("Params:", {
      receiverID,
      isGroup,
      currentConversationID: conversationID,
    });

    if (isGroup == true) {
      console.log("Joining group room:", receiverID);
      socket.emit("joinRoom", { conversationID: receiverID });
    }
    dispatch(setMessage([]));
    dispatch(setConversationID({ conversationID: null }));
    if (isGroup == false) {
      socket.emit("leaveRoom", { conversationID: conversationID });
    }

    if (isGroup) {
      console.log("Joining group room:", receiverID);
      socket.emit("joinRoom", { conversationID: receiverID });
    }

    // Invalidate all relevant queries
    console.log("Invalidating queries");
    queryClient.invalidateQueries({ queryKey: ["messages"] });
    queryClient.invalidateQueries({ queryKey: ["conversation"] });
    queryClient.invalidateQueries({ queryKey: ["sendMessageData"] });

    try {
      await refetchConversation();
    } catch (error) {
      console.error("Error refetching conversation:", error);
    }
  };

  useEffect(() => {
    if (chatList && chatList.data) {
      const filteredAndMapped = chatList.data
        .filter((chat) => chat.id !== userId && chat.requestStatus !== null)
        .map((chat) => ({
          id: chat.id,
          UserName: chat.UserName,
          image: chat.image,
          requestStatus: chat.requestStatus,
        }));
      dispatch(setChatList(filteredAndMapped));
    }
  }, [chatList, dispatch, userId]);
  return (
    <div className={`flex flex-col gap-2 p-5 `}>
      <div className="flex justify-between items-center">
        <button
          className="flex cursor-pointer my-2 font-bold p-2 rounded-xl mx-1"
          onClick={() => navigate("/notifications")}
        >
          <p className="pr-2">Nodifications</p>
          <Heart />
        </button>
        <AddGroup />
      </div>

      <Input
        placeholder="Search"
        onKeyDown={(e) => setSearch(e.target.value)}
      />
      <div className="flex my-2 items-center flex-col gap-2">
        {chatuserlist && chatuserlist.length > 0 ? (
          chatuserlist.map((chat) => (
            <>
              <div
                key={chat.id}
                className="flex items-center bg-black text-white rounded-xl relative p-2 gap-4 w-full"
              >
                <div className="flex items-center gap-4  w-[65%] rounded-xl">
                  <div className="w-10 h-10 relative rounded-full">
                    <ul>
                      {onlineUsers.map((user) => (
                        <>
                          {user === chat.id && (
                            <li key={user}>
                              <span className="absolute text-3xl right-[-3px] bottom-[-8px] text-green-500">
                                ●
                              </span>
                            </li>
                          )}
                        </>
                      ))}
                    </ul>
                    <img
                      src={chat.image}
                      alt="profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold">{chat.UserName}</p>
                  </div>
                </div>
                {chat.requestStatus == "pending" ||
                chat.requestStatus == undefined ? (
                  <Button
                    onClick={(e) => e.stopPropagation()}
                    className="text-white cursor-not-allowed"
                  >
                    Request Sent
                  </Button>
                ) : chat.requestStatus == "accept" ? (
                  <Button
                    onClick={(e) => {
                      setSelectedChat(chat.UserName);
                      handleCheckConversation({
                        receiverID: chat.id,
                        isGroup: false,
                      });
                      dispatch(setgroup(false));
                      navigate(`chat/${chat.UserName}/${chat.id}`);

                      e.stopPropagation();
                    }}
                    className="cursor-pointer"
                  >
                    Chat
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendRequest(chat.id);
                    }}
                    className={`text-white cursor-pointer`}
                  >
                    Send Request
                  </Button>
                )}
              </div>
            </>
          ))
        ) : (
          <div className="text-white">No chats found</div>
        )}
        <div className="w-full relative">
          {groups.map((group) => (
            <div
              key={group.id}
              className="p-1 bg-black text-white rounded-xl items-center w-[100%] gap-4 flex"
            >
              {group.groupImage && (
                <IKImage
                  urlEndpoint="https://ik.imagekit.io/hicgxab6ot"
                  path={group.groupImage}
                  transformation={[{ height: 50, width: 50 }]}
                  className="rounded-full"
                  alt="Profile Preview"
                />
              )}
              <h2 className="text-md font-bold">{group.title}</h2>
              <Button
                className={`text-white absolute right-9 cursor-pointer`}
                onClick={(e) => {
                  navigate(`chat/${group.title}/${group.id}`);
                  setSelectedChat(group.title);
                  dispatch(
                    setConversationID({
                      conversationID: group.id,
                      isGroup: true,
                    })
                  );
                  handleCheckConversation({
                    receiverID: group.id,
                    isGroup: true,
                  });
                  dispatch(setgroup(true));
                  e.stopPropagation();
                }}
              >
                Group
              </Button>
              <div className="absolute right-30">
                <AddMembers
                  open={open}
                  setOpen={setOpen}
                  users={chatuserlist}
                  groupId={group.id}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* console.log(isGroup, "isGroup...") */}
      {isLoading && (
        <div className="h-full flex flex-col gap-4 p-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px] bg-gray-200" />
                <Skeleton className="h-4 w-[200px] bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatList;
