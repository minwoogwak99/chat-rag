import { cn } from "@/lib/utils";
import { ChatHistoryType } from "@/type/type";
import React from "react";

interface CurrentChatViewProps {
  chats: ChatHistoryType[];
}
const CurrentChatView = ({ chats }: CurrentChatViewProps) => {
  return (
    <div className="w-1/2 flex flex-col gap-3">
      {chats.map((chat) => {
        return (
          <div
            key={chat.id}
            className={cn(
              "flex gap-2 bg-blue-300 p-2 rounded-2xl items-center",
              chat.source === "user" && "justify-end"
            )}
          >
            {chat.source === "bot" && (
              <div className="bg-green-300 rounded-full p-3">{chat.source}</div>
            )}
            <div>{chat.message}</div>
            {chat.source === "user" && (
              <div className="bg-green-300 rounded-full p-3">{chat.source}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CurrentChatView;
