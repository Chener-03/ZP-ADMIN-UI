export class WsMessage {
  public code: number;

  public jwt: string;

  public username: string;

  public message: string;
}

export class NotifyMessage {
  public type: string;
  public user: string;
  public title: string;
  public content: string;
}
