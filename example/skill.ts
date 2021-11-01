import { AliceRequest } from '@uni-skill/alice';
import { SberRequest } from '@uni-skill/sber';
import { MarusyaRequest } from '@uni-skill/marusya';

export function handler(reqBody: unknown) {
  const request = createRequest(reqBody);
  const response = request.createResponse();
  response.addVoiceText(`Вы сказали: ${request.userMessage}`);
  response.addSuggest([ 'Кнопка' ]);
  if (response.isSber()) {
    response.body.payload.emotion = { emotionId: 'oups' };
  }
  return response.body;
}

function createRequest(reqBody: unknown) {
  const request = [
    AliceRequest.create(reqBody),
    SberRequest.create(reqBody),
    MarusyaRequest.create(reqBody),
  ].find(Boolean);
  if (!request) throw new Error(`Unknown platform: ${JSON.stringify(reqBody)}`);
  return request;
}
