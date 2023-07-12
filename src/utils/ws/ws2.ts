import {WsMessage} from "@/utils/ws/entity/WsMessage";
import pako from 'pako';
import {TOKEN_NAME} from "@/config/global";
import {WsMessageConstVar} from "@/utils/ws/entity/WsMessageConstVar";
import {hasText} from "@/utils/StringUtils";

export const onMessageListener: Array<(event: WsMessage) => void> = [];

export class HeartbeatWebSocket {
  private websocket: WebSocket;
  private heartbeatInterval: number;
  private heartbeatTimer: NodeJS.Timeout;

  constructor(private url: string) {
    this.websocket = null;
    this.heartbeatInterval = 40000;
    this.heartbeatTimer = null;
  }

  start(): void {
    if (this.websocket !== null) {
      return;
    }
    let jwt = localStorage.getItem(TOKEN_NAME)
    if (jwt === null || jwt === undefined || jwt === '' || jwt === 'null'){
      return
    }


    this.websocket = new WebSocket(this.url);

    this.websocket.onopen = () => {
      this.startHeartbeat();
    };

    this.websocket.onmessage = (event) => {
      onMessageListener.forEach((listener)=>{
        this.decode(event.data,listener)
      })
    };

    this.websocket.onclose = () => {
      this.stopHeartbeat();
      this.websocket = null;
      this.reconnect();
    };
  }

  stop(): void {
    this.stopHeartbeat();
    try {
      this.websocket.close();
    }catch (e){}
    this.websocket = null;
  }

  public encode(data: WsMessage) : Uint8Array {
    return pako.gzip(JSON.stringify(data), { to: 'string' });
  }

  public decode(data: Blob,fun:Function) {
    let reader = new FileReader()
    reader.readAsArrayBuffer(data)
    reader.onload = function () {
      //@ts-ignore
      let res:ArrayBuffer = reader.result
      let js = JSON.parse(pako.ungzip(new Uint8Array(res), { to: 'string' }))
      fun(js)
    }
  }

  public send(obj: WsMessage) : boolean {
    if (obj === null || obj === undefined) {
      console.log('发送的数据不能为空');
    }
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(this.encode(obj));
      return true;
    }else {
      console.log('WebSocket连接未打开');
    }
  }

  public heartBert(){
    let jwt = localStorage.getItem(TOKEN_NAME)
    if (jwt === null || jwt === undefined || jwt === '' || jwt === 'null') {
      this.stop()
      return
    }
    let message = new WsMessage()
    message.code = WsMessageConstVar.HEART_BEAT_CODE
    message.jwt = jwt
    this.send(message)
  }

  private startHeartbeat(): void {
    this.heartBert();
    if (this.heartbeatTimer){
      clearInterval(this.heartbeatTimer);
    }
    this.heartbeatTimer = setInterval(() => {
      this.heartBert();
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    clearInterval(this.heartbeatTimer);
  }

  private reconnect(): void {
    setTimeout(() => {
      this.start();
    }, 1000);
  }
}


