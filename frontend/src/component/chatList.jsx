import React, { useState } from "react";

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
      name: "John Doe",
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
  ];

  return (
    <div>
      <div
        className={`flex flex-col gap-2 bg-amber-500 p-5`}
      >
        <div className="flex items-center flex-col gap-2">
          {chatList.map((chat) => (
            <div key={chat.id} className="flex items-center gap-4 w-full">
              <div className="w-10 h-10 bg-amber-600 rounded-full">
                <img src={chat?.image} alt="logo" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold">{chat.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatList;
