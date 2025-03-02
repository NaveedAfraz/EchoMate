import React from "react";
import { Skeleton } from "./ui/skeleton";

function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`flex ${
            index % 2 === 0 ? "justify-start" : "justify-end"
          }`}
        >
          <div className={`flex flex-col gap-2 max-w-[60%]`}>
            <Skeleton
              className={`h-10 w-40 rounded-2xl ${
                index % 2 === 0 ? "bg-amber-50/50" : "bg-blue-600/50"
              }`}
            />
            <Skeleton
              className={`h-4 w-20 ${
                index % 2 === 0 ? "ml-2" : "ml-auto mr-2"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatSkeleton;
