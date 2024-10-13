import { ChatHistoryType } from "@/type/type";
import { atom } from "jotai";

export const currentChatLogsAtom = atom<ChatHistoryType[] | undefined>(
  undefined
);
