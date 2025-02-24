import ChatList from "@/components/chatList";
import Chat from "@/components/chat";
import React, { useState } from "react";
import { Outlet, useParams } from "react-router";
function DashBoard() {
  const [selectedChat, setSelectedChat] = useState(null);
  const params = useParams();
  console.log("runninggggggggggggg");
  
  return (
    <div className="flex flex-col `">
      <div className="flex h-[92.55vh] ">
        <div
          className={`col-span-4 w-xl h-0 md:block ${
            params.id !== null ? "hidden" : ""
          } `}
        >
          <ChatList
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        </div>
        <div
          className={`overflow-x-hidden ${
            params.id !== null ? "w-full" : "hidden"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
