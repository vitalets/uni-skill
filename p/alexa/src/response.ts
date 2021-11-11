/**
 * Alexa response.
 * See: https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html
 */
import { ResponseEnvelope, ui } from 'ask-sdk-model';
import {
  UniResponse,
  BaseResponse,
  Image,
  State,
  concatWithNewline,
  concatWithSpace,
  stripSpeakTag,
} from '@uni-skill/core';
import { AlexaRequest } from './request';

// Use fake Omit to have 'AlexaResBody' in ts messages.
type AlexaResBody = Omit<ResponseEnvelope, ''>;

export class AlexaResponse
extends BaseResponse<AlexaResBody, AlexaRequest>
implements UniResponse<AlexaResBody, AlexaRequest> {
  isAlexa(): this is AlexaResponse { return true; }
  assistantName = 'Alexa';

  addReprompt(ssml: string) {
    const reprompt: ui.Reprompt = this.body.response.reprompt || {
      outputSpeech: { type: 'SSML', ssml: '' },
    };
    this.concatSsml(reprompt.outputSpeech as ui.SsmlOutputSpeech, ssml);
    this.body.response.reprompt = reprompt;
  }

  protected platformAddText(text: string) {
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
  protected platformAddImage({ imageId, title, description }: Image) {
    const { card } = this.body.response;
    const existingText = card?.type === 'Simple' && card.content || '';
    const text = concatWithNewline(existingText, description);
    const [ smallImageUrl, largeImageUrl = smallImageUrl ] = imageId.split('|');
    const image = { smallImageUrl, largeImageUrl };
    this.body.response.card = { type: 'Standard', title, text, image };
  }

  protected platformAddVoice(ssml: string) {
    this.concatSsml(this.body.response.outputSpeech as ui.SsmlOutputSpeech, ssml);
  }

  protected platformAddSuggest() {
    // noop: Alexa does not support suggest
  }

  protected platformAddLinks() {
    // noop: Alexa does not support links
  }

  protected platformEndSession(value: boolean) {
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
        shouldEndSession: false
      },
      sessionAttributes: {},
      version: '1.0'
    };
  }

  private concatSsml(outputSpeech: ui.SsmlOutputSpeech, ssml: string) {
    ssml = concatWithSpace(stripSpeakTag(outputSpeech.ssml), stripSpeakTag(ssml));
    outputSpeech.ssml = `<speak>${ssml}</speak>`;
  }
}
