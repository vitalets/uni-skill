/**
 * Alexa response.
 * See: https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html
 */
import { ResponseEnvelope, ui } from 'ask-sdk-model';
import { CommonResponse } from '../common/response';
import { Image, State } from '../common/types';
import { concatWithNewline } from '../utils';
import { AlexaRequest } from './request';

// Use fake Omit to have 'AlexaResBody' in ts messages.
type AlexaResBody = Omit<ResponseEnvelope, ''>;

export class AlexaResponse extends CommonResponse<AlexaResBody, AlexaRequest> {
  isAlexa(): this is AlexaResponse { return true; }

  protected addTextInternal(text: string) {
    const { card } = this.body.response;
    if (card?.type === 'Simple') {
      card.content = concatWithNewline(card.content, text);
    } else if (card?.type === 'Standard') {
      card.text = concatWithNewline(card.text, text);
    } else {
      this.body.response.card = {
        type: 'Simple',
        title: '',
        content: text,
      };
    }
  }

  /**
   * see: https://developer.amazon.com/en-US/docs/alexa/custom-skills/best-practices-for-skill-card-design.html
   */
  protected addImageInternal({ imageId, title, description }: Image) {
    const { card } = this.body.response;
    const existingText = card?.type === 'Simple' && card.content || '';
    const text = concatWithNewline(existingText, description);
    const [ smallImageUrl, largeImageUrl = smallImageUrl ] = imageId.split('|');
    const image = { smallImageUrl, largeImageUrl };
    this.body.response.card = { type: 'Standard', title, text, image };
  }

  protected addVoiceInternal(_: string) {
    (this.body.response.outputSpeech as ui.SsmlOutputSpeech).ssml =
      `<speak>${this.uniBody.ssml}</speak>`;
  }

  protected addSuggestInternal() {
    // noop: Alexa does not support suggest
  }

  protected addLinkInternal() {
    // noop: Alexa does not support links
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
