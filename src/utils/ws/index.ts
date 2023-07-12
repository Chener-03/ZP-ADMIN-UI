
import {NotifyMessage, WsMessage} from "@/utils/ws/entity/WsMessage";
import {NotifyPlugin} from "tdesign-vue-next";
import {WsMessageConstVar} from "@/utils/ws/entity/WsMessageConstVar";
import proxy from "@/config/proxy";
import {HeartbeatWebSocket, onMessageListener} from "@/utils/ws/ws2";

const env = import.meta.env.MODE || 'development';
const wshost = env === 'mock' || !proxy.isRequestProxy ? '' : proxy[env].wshost;

const onmsg = (msg:WsMessage) => {
  if (msg.code === WsMessageConstVar.MESSAGE_NOTIFY) {
    let notify:NotifyMessage = JSON.parse(msg.message)
    NotifyPlugin.info({ title: notify.title,content:notify.content ,closeBtn: true  });
  }
}
onMessageListener.push(onmsg)
const ws = new HeartbeatWebSocket(wshost);
const start = () => {
  ws.start();
}
const close = () => {
  ws.stop();
}
export {start as globleWebsocketStart,close as globleWebsocketClose}














