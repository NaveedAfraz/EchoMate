import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setChatList } from "@/store/chatlist";
function ChatList({ selectedChat, setSelectedChat }) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  console.log(userId, "userId");
  const { chatuserlist } = useSelector((state) => state.chatlist);
  console.log(chatuserlist, "chatuserlist");
  const dispatch = useDispatch();
  const {
    data: chatList,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["chats", search],
    queryFn: async () => {
      try {
        console.log(userId, "userId");
        const endpoint = search
          ? `http://localhost:3006/api/users/fetchUsers/${search}`
          : `http://localhost:3006/api/users/fetchRequestedUsers`;
        //  console.log(endpoint, "endpoint");
        console.log(chatList, "chatList");

        const response = await axios.get(endpoint, { withCredentials: true });
        console.log(response);
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
      console.log(response);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  console.log(chatList, "chatList");
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
      <button
        className="flex cursor-pointer my-2 font-bold p-2 rounded-xl mx-1"
        onClick={() => navigate("/notifications")}
      >
        <p className="pr-2">Nodifications</p>
        <Heart />
      </button>
      <Input
        placeholder="Search"
        onKeyDown={(e) => setSearch(e.target.value)}
      />
      <div className="flex my-2 items-center flex-col gap-2">
        {chatuserlist &&
          chatuserlist.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center bg-black text-white rounded-xl relative p-2 gap-4 w-full"
            >
              <div className="flex items-center gap-4  w-[65%] rounded-xl">
                <div className="w-10 h-10 rounded-full">
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
                    navigate(`chat/${chat.UserName}`);
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
          ))}
      </div>
      {isLoading && <div className="text-white">Loading...</div>}
    </div>
  );
}

export default ChatList;
