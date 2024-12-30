import { BedrockRuntimeClient, ConverseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { AWSCreds, Conversation, Message, Model } from "./types";

declare global {
    interface Window {
        awsCreds?: any
    }
}

export const getAvailableModels = async (): Promise<Model[]> => {
    return [
        {
            name: "Claude 3.5 Haiku",
            modelId: "anthropic.claude-3-5-haiku-20241022-v1:0",
            costPerInputTokenK: 0.0008,
            costPerOutputTokenK: 0.004,
            region: 'us-west-2'
        },
        {
            name: "Claude 3.5 Sonnet v1",
            modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
            costPerInputTokenK: 0.003,
            costPerOutputTokenK: 0.015,
            region: 'us-east-1'
        },
        {
            name: "Claude 3.5 Sonnet v2",
            modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
            costPerInputTokenK: 0.003,
            costPerOutputTokenK: 0.015,
            region: 'us-west-2'
        }
    ];
};

const conversationToMessages = (conversation: Conversation): BedrockMessage[] => {
    return conversation.messages.map((message: Message) => ({
        role: message.role,
        content: [{ text: message.content }]
    }));
};

export const sendConversation = async function * (
    model: Model,
    conversation: Conversation
): AsyncGenerator<Message, Message, undefined> {

    const creds: AWSCreds = await window.awsCreds.getAwsCreds()

    const client = new BedrockRuntimeClient({ 
        region: model.region,
        credentials: {
            accessKeyId: creds.AccessKeyId,
            secretAccessKey: creds.SecretAccessKey,
            sessionToken: creds.SessionToken,
        }
    });
    const inferenceConfig = { maxTokens: 4096, temperature: 0.1, topP: 0.9 };

    const command = new ConverseStreamCommand({
        modelId: model.modelId,
        // eslint-disable-next-line
        // @ts-ignore
        messages: conversationToMessages(conversation), //eslint-disable-line
        inferenceConfig
    })

    const responseMessage: Message = { role: "assistant", content: "" }

    try {
        const response = await client.send(command);
        for await (const item of response.stream) {
            if (item.contentBlockDelta) {
                const chunk: string = item.contentBlockDelta.delta?.text;
                responseMessage.content += chunk;
                yield responseMessage;
            }
        }
    } catch (err) {
        console.log(`error, can't invoke ${model.name}, reason: ${err}`);
        throw err;
    }
    return responseMessage;
}


// Types for Bedrock ContentBlocks
type ContentBlock = {
    text?: string;
    image?: ImageBlock;
    document?: DocumentBlock;
    video?: VideoBlock;
    toolUse?: ToolUseBlock;
    toolResult?: ToolResultBlock;
    guardContent?: GuardrailConverseContentBlock;
};

type ImageBlock = {
    // Add image block properties if needed
};

type DocumentBlock = {
    // Add document block properties if needed
};

type VideoBlock = {
    // Add video block properties if needed
};

type ToolUseBlock = {
    // Add tool use block properties if needed
};

type ToolResultBlock = {
    // Add tool result block properties if needed
};

type GuardrailConverseContentBlock = {
    // Add guardrail content block properties if needed
};

type BedrockMessage = {
    role: "user" | "assistant";
    content: ContentBlock[];
};