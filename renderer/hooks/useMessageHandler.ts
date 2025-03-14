import { useCallback, useState } from "react";
import { MessageHandlerActions, MessageHandlerContext, SendMessageResult } from "../types/chat";
import { Message } from "../lib/types";
import { buildNewMessage, updateConversationMessages } from "../lib/conversation_tools";
import { sendConversation } from "../lib/bedrock";
import { marked } from "marked";

export const useMessageHandler = (
  context: MessageHandlerContext,
  actions: MessageHandlerActions
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const responseMessage: Message = {
    id: -1,
    role: "assistant", 
    content: "",
    timestamp: new Date(),
    modelId: context.currentModel.modelId,
    modelName: context.currentModel.name,
  };

  const sendMessage = useCallback(async (
    input: string, 
    processedInput: string,
    onSuccess?: () => void
  ): Promise<SendMessageResult> => {
    setIsGenerating(true);
    setErrorMessage(null);

    const { activeConversation, currentModel, systemPrompt, responseRef, scrollHandlers } = context;
    const { setActiveConversation, setActiveConversationMessages } = actions;
    
    const nextMessages: Message[] = [...activeConversation.messages];
    const userMessage: Message = buildNewMessage(nextMessages, 'user', processedInput, currentModel);
    const model = activeConversation.currentModel || currentModel;

    // Add user message immediately
    nextMessages[userMessage.id] = userMessage;
    setActiveConversationMessages([...nextMessages]);
    
    const nextConversationWithUser = updateConversationMessages(activeConversation, nextMessages);
    setActiveConversation(nextConversationWithUser);

    try {
      const aiMessage: Message = buildNewMessage(nextMessages, 'assistant', '', currentModel);
      
      for await (const message of sendConversation(model, systemPrompt, nextMessages, aiMessage)) {
        responseMessage.content = message.content;
        if (responseRef?.current) {
          const reasoningContent = message.reasoningContent || "";
          let parsedContent = await Promise.resolve(marked.parse(message.content));
          if (reasoningContent.length > 0) {
            parsedContent = `<div class="text-xs italic opacity-50">${reasoningContent}</div>${parsedContent}`;
          }
          responseRef.current.innerHTML = parsedContent;

          scrollHandlers.handleScroll(null);
          scrollHandlers.scrollToBottom();
        }
      }

      nextMessages[aiMessage.id] = aiMessage;
      setActiveConversationMessages(nextMessages);
      setActiveConversation(updateConversationMessages(activeConversation, nextMessages));
      
      if (onSuccess) onSuccess();
      return { error: false };
    } catch (error) {
      // Remove the user message and update state
      const messagesWithoutUser = nextMessages.slice(0, -1);
      setActiveConversationMessages(messagesWithoutUser);
      setActiveConversation(updateConversationMessages(activeConversation, messagesWithoutUser));
      
      setErrorMessage(`Error: ${error.message}`);
      return { error: true, originalInput: input };
    } finally {
      setIsGenerating(false);
    }
  }, [context, actions]);

  return {
    sendMessage,
    isGenerating,
    errorMessage,
    setErrorMessage,
    responseMessage
  };
};