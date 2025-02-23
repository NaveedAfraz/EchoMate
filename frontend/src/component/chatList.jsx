import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
function ChatList({ selectedChat, setSelectedChat }) {
  const chatList = [
    {
      id: 1,
      name: "John Doe",
      image: "logo",
      lastMessage: "Hello, how are you?",
    },
    {
      id: 2,
      name: "John  Doe",
      image: "logo",
      lastMessage: "Hello, how are you?",
    },
    {
      id: 3,
      name: "John Doe",
      image: "logo",
      lastMessage: "Hello, how are you?",
    },
    {
      id: 4,
      name: "John Doe",
      image: "logo",
      lastMessage: "Hello, how are you?",
    },
    {
      id: 5,
      name: "John Doe",
      image: "logo",
      lastMessage: "Hello, how are you?",
    },
    {
      id: 6,
      name: "John Doe",
      image: "logo",
      lastMessage: "Hello, how are you?",
    },
    {
      id: 7,
      name: "John Doe",
      image: "logo",
      lastMessage: "Hello, how are you?",
    },
    {
      id: 8,
      name: "John Doe",
      image: "logo",
      lastMessage: "Hello, how are you?",
    },
  ];

  // console.log(selectedChat);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const {
    data: chatList1,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["chats", search],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/fetchUsersList/${search}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    enabled: !!search,
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
  return (
    <div className={`flex flex-col gap-2 p-5 `}>
      <Input
        placeholder="Search"
        onKeyDown={(e) => setSearch(e.target.value)}
      />
      <div className="flex my-2 items-center flex-col gap-2">
        {chatList.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center cursor-pointer bg-rose-800 text-white rounded-xl  p-2 gap-4 w-full"
            onClick={() => {
              setSelectedChat(chat?.id);
              console.log("HELO");
              navigate(`chat/${chat?.id}`);
            }}
          >
            <div className="w-10 h-10 rounded-full">
              <img src={chat?.image} alt="logo" />
            </div>
            <div className="flex flex-col">
              <p className=" font-bold ">{chat.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatList;
