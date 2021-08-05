/**
 * Alice response.
 */
import { ResBody } from 'alice-types';
import { BaseResponse, IResponse, ResponseImage } from '../base/response';

// Use fake Omit to have 'AliceResBody' in ts messages.
type AliceResBody = Omit<ResBody, ''>;

export class AliceResponse extends BaseResponse implements IResponse<AliceResBody> {
  body: AliceResBody;
  isAlice(): this is AliceResponse { return true; }

  constructor() {
    super();
    this.body = this.initBody();
  }

  get endSession() { return this.body.response.end_session; }
  set endSession(value: boolean) { this.body.response.end_session = value; }

  get userState() { return this.body.user_state_update; }
  set userState(value: AliceResBody['user_state_update']) { this.body.user_state_update = value; }

  get applicationState() { return this.body.application_state; }
  set applicationState(value: AliceResBody['application_state']) { this.body.application_state = value; }

  get sessionState() { return this.body.session_state; }
  set sessionState(value: AliceResBody['session_state']) { this.body.session_state = value; }

  addText(value: string) {
    const { text } = this.body.response;
    this.body.response.text = text ? `${text}\n${value}` : value;
  }

  addTts(value: string) {
    const { tts } = this.body.response;
    this.body.response.tts = tts ? `${tts} ${value}` : value;
  }

  addButtons(titles: string[]) {
    for (const title of titles) {
      this.body.response.buttons!.push({ title, hide: true });
    }
  }

  addImage({ id, title = '', description = '' }: ResponseImage) {
    this.body.response.card = {
      type: 'BigImage',
      image_id: id,
      title,
      description,
    };
    // дописываем все в text, т.к. он не может быть пустым
    title && this.addText(title);
    description && this.addText(description);
  }

  private initBody(): AliceResBody {
    return {
      response: {
        text: '',
        buttons: [],
        end_session: false
      },
      version: '1.0'
    };
  }
}
