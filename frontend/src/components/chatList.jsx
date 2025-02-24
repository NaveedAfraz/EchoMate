import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
function ChatList({ selectedChat, setSelectedChat }) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  console.log(userId, "userId");
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
        console.log(endpoint, "endpoint");

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
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
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
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  console.log(chatList, "chatList");
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
        {chatList &&
          chatList.data
            .filter(
              (chat) => chat.id != userId || chat.requestStatus == "accept"
            )
            .map(
              (chat) => (
                console.log(chat, "chat"),
                (
                  <div
                    key={chat.id}
                    className="flex items-center bg-black text-white rounded-xl relative p-2 gap-4 w-full"
                  >
                    <div
                      className="flex items-center gap-4 cursor-pointer w-[65%]  rounded-xl"
                      onClick={() => {
                        setSelectedChat(chat?.UserName);
                        navigate(`chat/${chat?.UserName}`);
                      }}
                    >
                      <div className="w-10 h-10 rounded-full">
                        <img
                          src={chat?.image}
                          alt="logo"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="flex flex-col ">
                        <p className=" font-bold ">{chat.UserName}</p>
                      </div>
                    </div>
                    {chat.requested != true ? (
                      <Button
                        onClick={() =>
                          handleSendRequest(chat.id || chat.receiverID)
                        }
                        className="text-white cursor-pointer"
                      >
                        Send Request
                      </Button>
                    ) : (
                      <Button onClick={(e) => e.stopPropagation()}>
                        Request Sent
                      </Button>
                    )}
                  </div>
                )
              )
            )}
      </div>
      {isLoading && <div className="text-white">Loading...</div>}
    </div>
  );
}

export default ChatList;
