import ChatList from "@/component/chatList";
import Chat from "@/component/chat";
import React, { useState } from "react";
import NavBar from "@/component/navbar";
function DashBoard() {
  const [selectedChat, setSelectedChat] = useState(3);
  return (
    <div>
      <NavBar />
      <div className={`grid grid-cols-12 bg-gray-600 h-screen`}>
        <div
          className={`col-span-3 bg-amber-600 ${
            selectedChat ? "hidden sm:block" : "block "
          }`}
        >
          <ChatList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>
        <div className={`${selectedChat ? "col-span-12" : "hidden"}`}>
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
