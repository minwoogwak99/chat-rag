export type ChatSourceType = "user" | "bot";

export interface ChatHistoryType {
  id: string;
  source: ChatSourceType;
  message: string;
  createdAT: Date;
}
