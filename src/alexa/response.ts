/**
 * Alexa response.
 * See: https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html
 */
import { ResponseEnvelope, ui } from 'ask-sdk-model';
import { BaseResponse } from '../base/response';
import { ImageBubble, IResponse, State } from '../types/response';
import { concatWithSeparator } from '../utils';
import { AlexaRequest } from './request';

// Use fake Omit to have 'AlexaResBody' in ts messages.
type AlexaResBody = Omit<ResponseEnvelope, ''>;

export class AlexaResponse extends BaseResponse<AlexaResBody, AlexaRequest> implements IResponse<AlexaResBody> {
  isAlexa(): this is AlexaResponse { return true; }

  protected addTextInternal(text: string) {
    // todo: if there is existing image card, use it!
    const { card } = this.body.response;
    const existingContent = card?.type === 'Simple' && card.content || '';
    this.body.response.card = {
      type: 'Simple',
      title: '',
      content: concatWithSeparator(existingContent, text, '\n')
    };
  }

  protected addImageInternal({ imageId, title, description }: ImageBubble) {
    // todo: copy text from existing Simple/Standart card?
    // see: https://developer.amazon.com/en-US/docs/alexa/custom-skills/best-practices-for-skill-card-design.html
    const [ smallImageUrl, largeImageUrl = smallImageUrl ] = imageId.split('|');
    this.body.response.card = {
      type: 'Standard',
      title,
      text: description,
      image: { smallImageUrl, largeImageUrl },
    };
  }

  protected setVoiceInternal(text: string) {
    (this.body.response.outputSpeech as ui.SsmlOutputSpeech).ssml = `<speak>${text}</speak>`;
  }

  protected addSuggestInternal() {
    // Alexa does not have suggest
  }

  protected endSessionInternal(value: boolean) {
    this.body.response.shouldEndSession = value;
  }

  get sessionState() { return this.body.sessionAttributes; }
  set sessionState(value: State) { this.body.sessionAttributes = value; }

  protected init(): AlexaResBody {
    return {
      response: {
        outputSpeech: {
          type: 'SSML',
          ssml: ''
        },
        // reprompt: {
        //   outputSpeech: {
        //     type: 'SSML',
        //     ssml: ''
        //   }
        // },
        shouldEndSession: false
      },
      sessionAttributes: {},
      version: '1.0'
    };
  }
}
