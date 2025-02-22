import { Input } from "@/components/ui/input";
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/3px-tile.png";
function Chat() {
  const messages = [
    {
      id: 1,
      content: "Hello, how are you?",
      sender: "user",
    },
    {
      id: 2,
      content: "I'm fine, thank you!",
      sender: "assistant",
    },
    {
      id: 3,
      content:
        "What's your name? bedhnjf  hbnvmkdwcd ndc f dc udnjcjd sccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc szzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzfcxdcfgvhbnjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
      sender: "user",
    },
    {
      id: 4,
      content: "My name is EchoChat.",
      sender: "assistant",
    },
  ];
  return (
    <div className="flex flex-col  h-full">
      <div className="relative flex-1">
        <img
          src={logo}
          alt="logo"
          className="absolute inset-0 w-full h-full object-cover blur-sm"
        />
        <div className="flex-1 h-full overflow-y-auto p-4 ">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col mb-4 ">
              {message.sender == "user" ? (
                <p className="bg-amber-600 self-end rounded-2xl px-4 py-2 max-w-[80%] break-words z-10">
                  {message.content}
                </p>
              ) : (
                <p className="bg-blue-600 self-start rounded-2xl px-4 py-2 max-w-[80%] break-words z-10">
                  {message.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-[80%] mx-auto relative">
        <Input placeholder="Search" className="rounded-full mb-5 h-12" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-6 -translate-y-1/2"
        >
          <Search />
        </Button>
      </div>
    </div>
  );
}

export default Chat;
