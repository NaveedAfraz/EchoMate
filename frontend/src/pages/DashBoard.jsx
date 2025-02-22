import ChatList from "@/component/chatList";
import Chat from "@/component/chat";
import React, { useState } from "react";
import NavBar from "@/component/navbar";
function DashBoard() {
  const [selectedChat, setSelectedChat] = useState(3);
  return (
      <div className="flex flex-col">
      <NavBar />
        <div className={`flex `}>
        <div
            className={`col-span-4 w-xl ${
            selectedChat ? "hidden md:block" : ""
          }`}
        >
          <ChatList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>
        <div className={`overflow-x-hidden h-[90%] ${selectedChat ? "col-span-12" : "hidden"}`}>
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
