import { createRequest, createResponse } from '../src';

export function handler(reqBody: unknown) {
  const request = createRequest(reqBody);
  const response = createResponse(request);
  const reply = `Вы сказали: ${request.userMessage}`;
  response.bubbles.push(reply);
  response.tts = reply;
  response.suggest = [ 'Кнопка' ];
  if (response.isSber()) {
    response.body.payload.emotion = { emotionId: 'oups' };
  }
  return response.body;
}
