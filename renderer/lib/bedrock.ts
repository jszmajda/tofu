import { BedrockRuntimeClient, ConverseStreamCommand, ConverseStreamCommandInput } from "@aws-sdk/client-bedrock-runtime";
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
            region: 'us-west-2',
            maxContextTokens: 200000
        },
        {
            name: "Claude 3.5 Sonnet v1",
            modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
            costPerInputTokenK: 0.003,
            costPerOutputTokenK: 0.015,
            region: 'us-east-1',
            maxContextTokens: 200000
        },
        {
            name: "Claude 3.5 Sonnet v2",
            modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
            costPerInputTokenK: 0.003,
            costPerOutputTokenK: 0.015,
            region: 'us-west-2',
            maxContextTokens: 200000
        },
        {
            name: "Claude 3.7 Sonnet",
            modelId: "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
            costPerInputTokenK: 0.003,
            costPerOutputTokenK: 0.015,
            region: 'us-east-1',
            maxContextTokens: 200000
        },
        {
            name: "Nova Pro",
            modelId: "arn:aws:bedrock:us-east-1:676372518487:inference-profile/us.amazon.nova-pro-v1:0",
            costPerInputTokenK: 0.0008,
            costPerOutputTokenK: 0.0032,
            region: 'us-east-1',
            maxContextTokens: 200000
        },
        {
            name: "DeepSeek R1",
            modelId: "arn:aws:bedrock:us-east-1:676372518487:inference-profile/us.deepseek.r1-v1:0",
            costPerInputTokenK: 0.00135,
            costPerOutputTokenK: 0.0054,
            region: 'us-east-1',
            maxContextTokens: 200000
        },

    ];
};

export const conversationToMessages = (messages: Message[]): BedrockMessage[] => {
    return messages.map((message) => ({
        role: message.role,
        content: [{ text: message.content }]
    })).filter((message) => {
      //reject messages where content is less than 1 character
      return message.content[0].text.length > 0
    });
};

export const generateTitle = async (conversation: Conversation, model: Model): Promise<string> => {
    const creds: AWSCreds = await window.awsCreds.getAwsCreds()

    const client = new BedrockRuntimeClient({
        region: model.region,
        credentials: {
            accessKeyId: creds.AccessKeyId,
            secretAccessKey: creds.SecretAccessKey,
            sessionToken: creds.SessionToken,
        }
    });

    //convert conversation messages into one string that shows the AI what's in the conversation, using only first 4 messages
    const conversationString = conversation.messages.slice(0,4).map((message) => {
        return `${message.role}: ${message.content}`;
    }).join("\n");

    const command = new ConverseStreamCommand({
        modelId: model.modelId,
        messages: [
            {
                role: "user",
                content: [
                    {
                        text: `The conversation so far has been this:\n\n${conversationString}\n\nRespond ONLY with the title.`
                    }
                ]
            }
        ],
        system: [
            {
                text: "You are a helpful assistant that generates a short title for a conversation. The title should be no more than 5 words. The title should be a single sentence. "
            },
        ],
        inferenceConfig: { maxTokens: 1024, temperature: 0.1, topP: 0.9 }
    });

    try {
        const response = await client.send(command);
        let title = "";
        for await (const item of response.stream) {
            if (item.contentBlockDelta) {
                const chunk: string = item.contentBlockDelta.delta?.text;
                console.log(`chunk: ${chunk}`);
                title += chunk;
            } else if (item.metadata){
                // TODO: store this somewhere, record it somewhere..
                // responseMessage.inputTokens = item.metadata.usage.inputTokens;
                // responseMessage.outputTokens = item.metadata.usage.outputTokens;
            }

        }
        return title;
    } catch (err) {
        console.log(`error, can't invoke ${conversation.currentModel.name}, reason: ${err}`);
        throw err;
    }
};

export const sendConversation = async function * (
    model: Model,
    systemPrompt: string,
    messages: Message[],
    responseMessage: Message
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

    let commandOptions: ConverseStreamCommandInput = {
        modelId: model.modelId,
        // eslint-disable-next-line
        // @ts-ignore
        messages: conversationToMessages(messages), //eslint-disable-line
        inferenceConfig
    }
    if(systemPrompt !== null && systemPrompt.length > 0){
      commandOptions['system'] = [{text: systemPrompt}];
    }
    const command = new ConverseStreamCommand(commandOptions);

    try {
        const response = await client.send(command);
        for await (const item of response.stream) {
            if (item.contentBlockDelta) {
                // Handle reasoning content
                if (item.contentBlockDelta.delta?.reasoningContent) {
                    const chunk: string = item.contentBlockDelta.delta.reasoningContent.text || "";
                    responseMessage.reasoningContent = (responseMessage.reasoningContent || "") + chunk;
                }
                // Handle regular text content
                else if (item.contentBlockDelta.delta?.text) {
                    const chunk: string = item.contentBlockDelta.delta.text;
                    responseMessage.content += chunk;
                }
                yield responseMessage;

            } else if (item.metadata){
                responseMessage.inputTokens = item.metadata.usage.inputTokens;
                responseMessage.outputTokens = item.metadata.usage.outputTokens;
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
    reasoningContext?: {
        text: string;
    }
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

export type BedrockMessage = {
    role: "user" | "assistant";
    content: ContentBlock[];
};