import React from "react";
import { useSelector } from "react-redux";
import FormatLastSeen from "./dateFormater";
import { Skeleton } from "./ui/skeleton";

function ChatHeader({ lastSeen, username, reciverID }) {
  const { isGroup } = useSelector((state) => state.chatlist);
  const { onlineUsers } = useSelector((state) => state.messages);
  console.log(lastSeen, "lastSeen");
  console.log(username, "username");
  console.log(reciverID, "reciverID");
  return (
    <div className="flex justify-between backdrop-blur-sm items-center p-4">
      <h1 className="text-2xl font-bold">Chat</h1>
      <h1 className="text-2xl font-bold">
        {username?.userName ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-600">
              {username?.userName == "undefined " ? (
                <p className="text-blue-600">Group</p>
              ) : (
                <p className="text-gray-600">{username?.userName}</p>
              )}
            </span>

            <span className="text-gray-400 text-sm">
              {lastSeen?.lastSeen && !onlineUsers.includes(reciverID)
                ? `Last Seen : ${FormatLastSeen({
                    dateString: lastSeen?.lastSeen,
                  })}`
                : lastSeen?.lastSeen &&
                  onlineUsers.includes(reciverID) &&
                  !isGroup && (
                    <p className="text-green-600 text-lg font-bold">online</p>
                  )}
            </span>
          </div>
        ) : (
          <Skeleton className="w-24 h-4" />
        )}
      </h1>
    </div>
  );
}

export default ChatHeader;
