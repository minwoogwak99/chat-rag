import { NextResponse } from "next/server";

export async function POST(request) {
  const api_url = "http://localhost:8080/ai";

  const { input, prevLog } = await request.json();

  console.log("input::::::", input);
  console.log(prevLog);

  let response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: input, prevLog }),
    cache: "no-store",
  });

  response = await response.json();
  return NextResponse.json(response);
}
