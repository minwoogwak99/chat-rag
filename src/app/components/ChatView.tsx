"use client";

import React, { useEffect, useState } from "react";
import { UploadPDFView } from "./UploadPDFView";

export const ChatView = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [histories, setHistories] = useState([]);

  const submitData = async () => {
    try {
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
      setInput("");
      setResponse(data.response);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="bg-red-300 flex justify-center items-center flex-col gap-10 p-10">
      <UploadPDFView />
      <div className="flex border items-center gap-4">
        <form
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
            call api
          </button>
        </form>
      </div>
      {response && <div>{response}</div>}
    </div>
  );
};
