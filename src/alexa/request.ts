/**
 * Alexa request.
 * See: https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html
 */
import { RequestEnvelope } from 'ask-sdk-model';
import { CommonRequest } from '../base/request';

// Use fake Omit to have 'AlexaReqBody' in ts messages.
type AlexaReqBody = Omit<RequestEnvelope, ''>;

export class AlexaRequest extends CommonRequest<AlexaReqBody> {
  static match(reqBody: unknown): reqBody is AlexaReqBody {
    return Boolean((reqBody as AlexaReqBody)?.context);
  }
  isAlexa(): this is AlexaRequest { return true; }
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
  get isAuthorized() { return Boolean(this.body.context.System.user.accessToken); }
  isCloseApp() { return this.body.request.type === 'SessionEndedRequest'; }

  /** own */

  get sessionState() { return this.body.session!.attributes; }
}
