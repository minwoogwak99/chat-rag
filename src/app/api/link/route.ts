import { NextResponse } from "next/server";

export async function POST(request) {
  const api_url = "http://localhost:8080/fromlink";
  const { query } = await request.json();

  const response = await fetch(api_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      query: query,
    }),
  });

  if (!response.body) {
    return NextResponse.json(
      { error: "No response body received" },
      { status: 500 }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const json = JSON.parse(chunk);
          const chunk2 = Object.values(json)[0];
          controller.enqueue(new TextEncoder().encode(chunk2));
        }
      } catch (error) {
        console.error("Streaming error:", error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
}
