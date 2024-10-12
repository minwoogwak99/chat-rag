import { Chat } from "./components/chat";
import { ChatView } from "./components/ChatView";

export const runtime = "edge";

export default function Page() {
  return <ChatView />;
}
