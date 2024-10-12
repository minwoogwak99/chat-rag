"use client";

import React, { useState } from "react";

export const UploadPDFView = () => {
  const [file, setFile] = useState(null);

  const submitData = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      let response = await fetch("api/upload/pdf", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });

      response = await response.json();
      console.log(response);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="bg-red-300 flex justify-center items-center flex-col gap-10 p-10">
      <div className="flex border items-center gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            className="border h-full border-gray-300 rounded-md"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={() => submitData()}
            className="border-3 border-black border rounded-lg p-3 bg-white hover:bg-gray-300 duration-300"
          >
            Upload PDF
          </button>
        </form>
      </div>
    </div>
  );
};
