import { createRequest, createResponse } from '../src';

export function handler(reqBody: unknown) {
  const request = createRequest(reqBody);
  const response = createResponse(request);
  response.text = `Вы сказали: ${request.userMessage}`;
  response.tts = response.text;
  response.addButtons([ 'Кнопка' ]);
  return response.body;
}
