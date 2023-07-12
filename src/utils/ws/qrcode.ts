import proxy from "@/config/proxy";
import {WsMessage} from "@/utils/ws/entity/WsMessage";
import pako from 'pako';
import {WsMessageConstVar} from "@/utils/ws/entity/WsMessageConstVar";



const env = import.meta.env.MODE || 'development';
const wshost = env === 'mock' || !proxy.isRequestProxy ? '' : proxy[env].wshost;

export class QrCodeLogin {

  private ws : WebSocket = null;


  public readyCallBack:Function = null;

  public loginCallBack:Function = null;

  public errorCallBack:Function = null;

  public qrcodeCallBack:Function = null;

  public closeCallBack:Function = null;

  public start(){
    this.ws = new WebSocket(wshost);
    this.ws.onopen = ()=>{
      this.send({jwt: "", username: "", code:WsMessageConstVar.QRCODE_LOGIN_REQUEST,message:getSystemName()})
    }
    this.ws.onmessage = (event)=>{
      this.decode(event.data,this.onMessage,this);
    }

    this.ws.onclose = ()=>{
      this.closeCallBack()
      this.ws = null
    }
  }

  public stop(){
    this.ws.close()
  }

  public encode(data: WsMessage) : Uint8Array {
    return pako.gzip(JSON.stringify(data), { to: 'string' });
  }

  public decode(data: Blob,fun:Function,th) {
    let reader = new FileReader()
    reader.readAsArrayBuffer(data)
    reader.onload = function () {
      //@ts-ignore
      let res:ArrayBuffer = reader.result
      let js = JSON.parse(pako.ungzip(new Uint8Array(res), { to: 'string' }))
      fun(js,th)
    }
  }

  public send(obj: WsMessage) : boolean {
    if (obj === null || obj === undefined) {
      console.log('发送的数据不能为空');
    }
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(this.encode(obj));
      return true;
    }else {
      console.log('WebSocket连接未打开');
    }
  }

  private onMessage(message:WsMessage,th){

    switch (message.code) {
      case WsMessageConstVar.QRCODE_LOGIN_READY:
        th.readyCallBack(message)
        break;
      case WsMessageConstVar.QRCODE_LOGIN_DOLOGIN:
        th.loginCallBack(message)
        break;
      case WsMessageConstVar.QRCODE_LOGIN_FAIL:
        th.errorCallBack(message)
        break;
      case WsMessageConstVar.QRCODE_LOGIN_RESPONSE:
        th.qrcodeCallBack(message)
        break;
    }
  }

}


export const getSystemName = ()=>{
  var userAgent = navigator.userAgent;

// 操作系统信息
  var os;
  if (userAgent.indexOf("Win") !== -1) {
    os = "Windows";
  } else if (userAgent.indexOf("Mac") !== -1) {
    os = "Mac";
  } else if (userAgent.indexOf("Linux") !== -1) {
    os = "Linux";
  } else if (userAgent.indexOf("Android") !== -1) {
    os = "Android";
  } else if (userAgent.indexOf("iOS") !== -1) {
    os = "iOS";
  } else {
    os = "Unknown";
  }

// 浏览器信息
  var browser;
  if (userAgent.indexOf("Chrome") !== -1) {
    browser = "Chrome";
  } else if (userAgent.indexOf("Edge") !== -1) {
    browser = "Edge";
  } else if (userAgent.indexOf("Firefox") !== -1) {
    browser = "Firefox";
  } else if (userAgent.indexOf("Safari") !== -1) {
    browser = "Safari";
  } else if (userAgent.indexOf("Opera") !== -1 || userAgent.indexOf("OPR") !== -1) {
    browser = "Opera";
  } else if (userAgent.indexOf("IE") !== -1 || userAgent.indexOf("Trident/") !== -1) {
    browser = "Internet Explorer";
  } else {
    browser = "Unknown";
  }
  return os + " " + browser;
}
