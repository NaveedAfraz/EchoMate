import ChatList from "@/component/chatList";
import Chat from "@/component/chat";
import React, { useState } from "react";

function DashBoard() {
  const [selectedChat, setSelectedChat] = useState(7);

  return (
    <div className="flex flex-col">
      <div className="flex h-[92.55vh]">
        <div
          className={`col-span-4 w-xl h-0 md:block ${
            selectedChat ? "hidden" : ""
          }`}
        >
          <ChatList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>
        <div
          className={`overflow-x-hidden ${
            selectedChat !== null ? "col-span-12" : "hidden"
          }`}
        >
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
