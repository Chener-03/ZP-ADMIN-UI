import pako from 'pako';
import { WsMessage } from '@/utils/ws/entity/WsMessage';
import { TOKEN_NAME } from '@/config/global';
import { WsMessageConstVar } from '@/utils/ws/entity/WsMessageConstVar';
import { doc } from 'zrender/lib/vml/core';

let __this = null;

export class Ws {
  private ws: WebSocket;

  private url: string;

  public __this;

  private onMessageListener: Array<(event: WsMessage) => void> = [];

  private onErrorListener: Array<(event: Event) => void> = [];

  private onCloseListener: Array<(event: CloseEvent) => void> = [];

  constructor(url: string) {
    this.url = url;
    __this = this;
  }

  public start() {
    this.shundown();
    this.ws = new WebSocket(this.url);
    this.setCallBack();
  }

  public shundown() {
    if (this.ws !== null && this.ws !== undefined) {
      this.ws.close();
    }
  }

  private setCallBack() {
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
  }

  public getSource(): WebSocket {
    return this.ws;
  }

  private onMessage(event: MessageEvent) {
    __this.onMessageListener.forEach((listener) => {
      __this.decode(event.data, listener);
    });
  }

  private onOpen(event: Event) {
    __this.heartBert();
  }

  public heartBert() {
    let jwt = localStorage.getItem(TOKEN_NAME);
    if (jwt == null) {
      this.ws.close();
      return;
    }
    let message = new WsMessage();
    message.code = WsMessageConstVar.HEART_BEAT_CODE;
    message.jwt = jwt;
    this.send(message);
  }

  private onError(event: Event) {
    __this.onErrorListener.forEach((listener) => {
      listener(event);
    });
  }

  private onClose(event: CloseEvent) {
    __this.onCloseListener.forEach((listener) => {
      listener(event);
    });
  }

  public send(obj: WsMessage): boolean {
    if (obj === null || obj === undefined) {
      throw new Error('发送的数据不能为空');
    }
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(this.encode(obj));
      return true;
    } else {
      throw new Error('WebSocket连接未打开');
    }
  }

  public encode(data: WsMessage): Uint8Array {
    return pako.gzip(JSON.stringify(data), { to: 'string' });
  }

  public decode(data: Blob, fun: Function) {
    let reader = new FileReader();
    reader.readAsArrayBuffer(data);
    reader.onload = function () {
      //@ts-ignore
      let res: ArrayBuffer = reader.result;
      let js = JSON.parse(pako.ungzip(new Uint8Array(res), { to: 'string' }));
      fun(js);
    };
  }

  public addMessageListener(listener: (event: WsMessage) => void) {
    this.onMessageListener.push(listener);
  }

  public addErrorListener(listener: (event: Event) => void) {
    this.onErrorListener.push(listener);
  }

  public addCloseListener(listener: (event: CloseEvent) => void) {
    this.onCloseListener.push(listener);
  }

  public clearAllListener() {
    this.onMessageListener = [];
    this.onErrorListener = [];
    this.onCloseListener = [];
  }
}
