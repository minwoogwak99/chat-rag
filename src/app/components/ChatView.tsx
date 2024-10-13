"use client";

import React, { useEffect, useState } from "react";
import { UploadPDFView } from "./UploadPDFView";
import { ChatHistoryType } from "@/type/type";
import { v4 as uuidv4 } from "uuid";
import CurrentChatView from "./CurrentChatView";
import { useAtom } from "jotai";
import { currentChatLogsAtom } from "@/atoms/atoms";

export const ChatView = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [histories, setHistories] = useAtom(currentChatLogsAtom);

  const [streamingResponse, setStreamingResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitData = async () => {
    setInput("");
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
          prevLog: histories.length > 0 ? histories : [],
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

      setResponse(data.response);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAnswerFromLink = async () => {
    setIsStreaming(true);
    setIsLoading(true);
    setInput("");
    setHistories((prev) => {
      if (!histories)
        return [
          {
            id: uuidv4(),
            source: "user",
            message: input,
            createdAT: new Date(),
          },
        ];
      return [
        ...prev,
        { id: uuidv4(), source: "user", message: input, createdAt: new Date() },
      ];
    });

    const response = await fetch("api/link", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      cache: "no-store",
      body: JSON.stringify({
        query: input,
      }),
    });

    setIsLoading(false);
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log("Received chunk:", chunk);
        result += chunk;
        setStreamingResponse((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Streaming error:", error);
    }
    setHistories((prev) => [
      ...prev,
      {
        id: uuidv4(),
        source: "bot",
        message: result,
        createdAt: new Date(),
      },
    ]);
    setIsStreaming(false);
    setStreamingResponse("");
  };

  return (
    <div className="bg-red-300 flex justify-end items-center flex-col p-10 h-dvh">
      {histories && <CurrentChatView chats={histories} />}
      {isStreaming && (
        <div className="w-1/2 flex flex-col mt-3">
          <div
            className={"flex gap-2 bg-blue-300 p-2 rounded-2xl items-center"}
          >
            <div className="bg-green-300 rounded-full p-3">bot</div>
            {isLoading && <div>Loading...</div>}
            <div>{streamingResponse}</div>
          </div>
        </div>
      )}
      <div className="flex border items-center gap-4 mt-5">
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
            onClick={() => handleAnswerFromLink()}
            className="border-3 border-black border rounded-lg p-3 bg-white hover:bg-gray-300 duration-300"
          >
            send
          </button>
        </form>
      </div>
    </div>
  );
};
