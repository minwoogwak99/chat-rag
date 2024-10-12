// POST request function that gets pdf file and sends it to the server endpoint: http://localhost:8080/pdf

import { NextResponse } from "next/server";

export async function POST(request) {
  const api_url = "http://localhost:8080/pdf";

  const formData = new FormData();
  formData.append("file", request.file);

  let response = await fetch(api_url, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  response = await response.json();
  return NextResponse.json(response);
}
