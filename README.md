
# <img src="renderer/public/images/tofu-small.png" alt="Tofu Logo" height="30" /> Tofu: An Electron-based AI Chat Application

<img src="resources/Screenshot 2024-12-31 at 4.54.59 PM.png" alt="Tofu screenshot"/>

Tofu is a desktop application built with Electron that provides an interface for interacting with AI models through Amazon Bedrock. It offers a user-friendly chat experience with support for multiple AI models.

## Project Description

Tofu is designed to facilitate conversations with AI models using Amazon's Bedrock service. The application allows users to select from different AI models, including various versions of Claude, and engage in chat-like interactions. 

Key features of Tofu include:
- Integration with Amazon Bedrock for AI model access
- Support for multiple AI models, including Claude 3.5 Haiku and Claude 3.5 Sonnet versions
- Real-time streaming of AI responses
- Conversation management and history
- Cross-platform compatibility (Windows, macOS, Linux)

The application is built using Electron, React, and TypeScript, providing a robust and maintainable codebase. It leverages Electron Forge for building and packaging, ensuring a streamlined development and distribution process.

## Usage Instructions

### Installation

Prerequisites:
- Node.js (v14 or later)
- npm (v6 or later)
- AWS account with Bedrock access

Steps:
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.aws/credentials` file in your home directory with your AWS credentials:
   ```
   aws_access_key_id=YOUR_ACCESS_KEY
   aws_secret_access_key=YOUR_SECRET_KEY
   ```

### Getting Started

To start the application in development mode:

```bash
npm run dev
```

To build the application for production:

```bash
npm run build
```

### Configuration

The application reads AWS credentials from the `.aws/credentials` file in your home directory. Ensure this file is properly configured with your AWS access key and secret key.

### Common Use Cases

1. Starting a new conversation:
   - Launch the application
   - Select an AI model from the dropdown
   - Type your message in the chat input and press Enter

2. Continuing a previous conversation:
   - Select a conversation from the conversation list on the left
   - The chat history will load, and you can continue the conversation

Note: The application uses a secure preload script to expose AWS credentials to the renderer process