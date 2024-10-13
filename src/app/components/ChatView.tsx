"use client";

import React, { useEffect, useState } from "react";
import { UploadPDFView } from "./UploadPDFView";
import { ChatHistoryType } from "@/type/type";
import { v4 as uuidv4 } from "uuid";
import CurrentChatView from "./CurrentChatView";

export const ChatView = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [histories, setHistories] = useState<ChatHistoryType[]>([]);

  const submitData = async () => {
    try {
      setHistories((prev) => [
        ...prev,
        { id: uuidv4(), source: "user", message: input, createdAt: new Date() },
      ]);
      const response = await fetch("api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
        }),
      });

      const data = await response.json();
      setHistories((prev) => [
        ...prev,
        {
          id: uuidv4(),
          source: "bot",
          message: data.response,
          createdAt: new Date(),
        },
      ]);

      setInput("");
      setResponse(data.response);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="bg-red-300 flex justify-end items-center flex-col gap-10 p-10 h-dvh">
      {/* <UploadPDFView /> */}

      <CurrentChatView chats={histories} />
      <div className="flex border items-center gap-4">
        <form
          className="w-1/2 flex gap-4 items-center"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className="border h-full border-gray-300 rounded-md"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => submitData()}
            className="border-3 border-black border rounded-lg p-3 bg-white hover:bg-gray-300 duration-300"
          >
            send
          </button>
        </form>
      </div>
    </div>
  );
};
