/**
 * Alexa request.
 * See: https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html
 */
import { IntentRequest, RequestEnvelope } from 'ask-sdk-model';
import { UniRequest, BaseRequest, Intent, Platform } from '@uni-skill/core';
import { AlexaResponse } from './response';

// Use fake Omit to have 'AlexaReqBody' in ts messages.
type AlexaReqBody = Omit<RequestEnvelope, ''>;

export class AlexaRequest
extends BaseRequest<AlexaReqBody, AlexaResponse>
implements UniRequest<AlexaReqBody, AlexaResponse> {
  static create(reqBody: unknown) {
    const body = reqBody as AlexaReqBody;
    if (body?.context) {
      return new AlexaRequest(body);
    }
  }
  createResponse() { return new AlexaResponse(this); }
  isAlexa(): this is AlexaRequest { return true; }
  platform: Platform = 'alexa';
  get userId() { return this.body.session!.user.userId; }
  get sessionId() { return this.body.session!.sessionId; }
  get messageId() { return 0; }
  /** Alexa does not provide user's phrase */
  get userMessage() { return ''; }
  get clientInfo() { return 'Alexa device'; }
  /** LaunchRequest? */
  get isNewSession() { return this.body.session!.new; }
  /** tbd */
  get hasScreen() {
    return true;
    // return Boolean(this.body.context?.System?.device?.supportedInterfaces?.['Alexa.Presentation.APL']);
  }
  get isAuthorized() {
    return Boolean(this.body.context.System.user.accessToken);
  }

  isEndSession() {
    return this.body.request.type === 'SessionEndedRequest';
  }

  getTimezone() {
    // see: https://developer.amazon.com/en-US/docs/alexa/smapi/alexa-settings-api-reference.html
    return '';
  }

  getIntent(name: string) {
    if (this.isIntentRequest() && this.body.request.intent.name === name) {
      const slots = this.body.request.intent.slots || {};
      const intent: Intent = { name, slots: {} };
      for (const slotName of Object.keys(slots || {})) {
        intent.slots[slotName] = slots[slotName].value;
      }
      return intent;
    }
  }

  /** own */

  isIntentRequest(): this is this & { body: { request: IntentRequest } } {
    return this.body.request.type === 'IntentRequest';
  }

  get sessionState() { return this.body.session!.attributes; }
}
