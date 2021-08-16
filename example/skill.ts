import { createRequest, createResponse } from '../src';

export function handler(reqBody: unknown) {
  const request = createRequest(reqBody);
  const response = createResponse(request);
  response.addVoiceBubble(`Вы сказали: ${request.userMessage}`);
  response.addSuggest([ 'Кнопка' ]);
  if (response.isSber()) {
    response.body.payload.emotion = { emotionId: 'oups' };
  }
  return response.body;
}
