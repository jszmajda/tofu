import { Conversation } from "./types";

export function downloadConversationAsJson(conversation: Conversation) {
  const jsonString = JSON.stringify(conversation, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const formattedDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${formattedDate} - ${conversation.title.replace(/[^a-z0-9]/gi, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadConversationAsMarkdown(conversation: Conversation, userName: string) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  let markdownContent = `# ${conversation.title}\n\n`;
  
  conversation.messages.forEach((message) => {
    const timestamp = formatDate(message.timestamp);
    let actorName = ""
    if(message.role === 'user') {
      if(userName) {
        actorName = userName;
      } else {
        actorName = 'User';
      }
    } else if (message.modelName) {
      actorName = message.modelName;
    } else {
      actorName = message.role.charAt(0).toUpperCase() + message.role.slice(1);
    }
    markdownContent += `## ${actorName} (${timestamp})\n\n${message.content}\n\n`;
    
    markdownContent += '---\n\n';
  });

  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const formattedDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${formattedDate} - ${conversation.title.replace(/[^a-z0-9]/gi, '_')}.md`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}