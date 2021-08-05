import { createRequest, createResponse } from '../src';

export function handler(reqBody: unknown) {
  const request = createRequest(reqBody);
  const response = createResponse(request);
  const reply = `Вы сказали: ${request.userMessage}`;
  response.addText(reply);
  response.addTts(reply);
  response.addButtons([ 'Кнопка' ]);
  return response.body;
}
