import { Ws } from '@/utils/ws/ws';
import { NotifyMessage, WsMessage } from '@/utils/ws/entity/WsMessage';
import { NotifyPlugin } from 'tdesign-vue-next';
import { WsMessageConstVar } from '@/utils/ws/entity/WsMessageConstVar';
import { TOKEN_NAME } from '@/config/global';

const ws = new Ws('ws://localhost:5001/v1/user/ws/web/connect');

const HEARTBERT_INTERVAL = 1000 * 50;
let heartBertThread;
let retryThread = null;
const start = () => {
  if (ws.getSource() !== null && ws.getSource() !== undefined && ws.getSource().readyState === WebSocket.OPEN) {
    return;
  }
  if (heartBertThread != null) {
    clearInterval(heartBertThread);
  }
  ws.clearAllListener();
  ws.addMessageListener(onmsg);
  ws.addErrorListener(onerror);
  ws.addCloseListener(onclose);
  ws.start();
  heartBertThread = setInterval(() => {
    ws.heartBert();
  }, HEARTBERT_INTERVAL);
};

const close = () => {
  ws.shundown();
  if (heartBertThread != null) {
    clearInterval(heartBertThread);
  }
};
const onmsg = (msg: WsMessage) => {
  if (msg.code === WsMessageConstVar.MESSAGE_NOTIFY) {
    let notify: NotifyMessage = JSON.parse(msg.message);

    NotifyPlugin.info({ title: notify.title, content: notify.content, closeBtn: true });
  }
};
const onerror = (event: Event) => {
  clearInterval(HEARTBERT_INTERVAL);
};

const onclose = (event: CloseEvent) => {
  clearInterval(HEARTBERT_INTERVAL);
};

export { start as globleWebsocketStart, close as globleWebsocketClose };
