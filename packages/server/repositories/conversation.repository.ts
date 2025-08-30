// Implementation detail
const conversations = new Map<string, string>();

function getLastResponseId(conversationId: string) {
  return conversations.get(conversationId);
}

function setLastResponseId(conversationId: string, responseId: string) {
  conversations.set(conversationId, responseId);
}

export const conversationRepository = {
  getLastResponseId,
  setLastResponseId,
};
