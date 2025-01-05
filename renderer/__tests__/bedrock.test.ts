import { mockClient } from "aws-sdk-client-mock";
import { BedrockMessage, conversationToMessages, generateTitle } from '../lib/bedrock'
import { Message } from '../lib/types'
import * as fixtures from './fixtures'
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

let windowSpy;
const bedrockMock = mockClient(BedrockRuntimeClient);

beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get");
  bedrockMock.reset();
});

afterEach(() => {
  windowSpy.mockRestore();
});

// it('should return https://example.com', () => {
//   windowSpy.mockImplementation(() => ({
//     location: {
//       origin: "https://example.com"
//     }
//   }));

//   expect(window.location.origin).toEqual("https://example.com");
// });

// it('should be undefined.', () => {
//   windowSpy.mockImplementation(() => undefined);

//   expect(window).toBeUndefined();
// });

describe('bedrock', () => {
  it('should work', () => {
    expect(true).toBe(true)
  })

  describe('conversationToMessages', () => {
    it('converts a message array to a BedrockMessage array', () => {

      expect(conversationToMessages(fixtures.messages)).toEqual(fixtures.bedrockMessages)
    })
  })

  describe('generateTitle', () => {
    it('generates a title by calling the bedrock APIs', () => {
      const getAwsCreds = jest.fn(() => {
        return {
          accessKeyId: 'accessKeyId',
          secretAccessKey: 'secretAccessKey',
          sessionToken: 'sessionToken'
        }
      });
      windowSpy.mockImplementation(() => ({
        awsCreds: {
          getAwsCreds
        }
      }));

      const promise = generateTitle(fixtures.conversation, fixtures.model)
      expect(promise).toBeInstanceOf(() => new Promise<string>(() => {}));
      expect(getAwsCreds).toHaveBeenCalled();
    })
  })
})