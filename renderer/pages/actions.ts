'use server'
import { buildDefaultConversation } from "../lib/conversation_tools";

export async function newConversation() {
  const conversation = buildDefaultConversation();
  return conversation;
}