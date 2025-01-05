
// build a mock for BedrockRuntimeClient and ConverseStreamCommand
import { BedrockRuntimeClient, ConverseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
jest.mock("@aws-sdk/client-bedrock-runtime");
// jest.mock("@aws-sdk/client-bedrock-runtime", () => {
//     const ConverseStreamCommandMock = jest.fn();
//     const BedrockRuntimeClientMock = jest.fn(() => ({
//         send: jest.fn().mockImplementation((command) => {
//             if (command instanceof ConverseStreamCommandMock) {
//                 return {
//                     stream: (async function* () {
//                         yield {
//                             contentBlockDelta: {
//                                 delta: {
//                                     text: "Hello, World!"
//                                 }
//                             }
//                         };
//                     })()
//                 };
//             }
//         })
//     }));

//     return {
//         ConverseStreamCommand: ConverseStreamCommandMock,
//         BedrockRuntimeClient: BedrockRuntimeClientMock
//     };
// });
