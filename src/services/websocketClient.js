import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = 'http://localhost:8080/ws';

let stompClient = null;

export const connectWebSocket = (token, onConnected, onError) => {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${WS_URL}?token=${token}`),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('✅ WebSocket connected');
      if (onConnected) onConnected(stompClient);
    },
    onStompError: (frame) => {
      console.error('❌ STOMP error:', frame);
      if (onError) onError(frame);
    },
    onDisconnect: () => {
      console.log('🔌 WebSocket disconnected');
    },
  });

  stompClient.activate();
  return stompClient;
};

export const disconnectWebSocket = () => {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const subscribe = (destination, callback) => {
  if (stompClient && stompClient.connected) {
    return stompClient.subscribe(destination, (message) => {
      const body = JSON.parse(message.body);
      callback(body);
    });
  }
  console.warn('WebSocket not connected. Cannot subscribe to:', destination);
  return null;
};

export const sendMessage = (destination, body) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination,
      body: JSON.stringify(body),
    });
  } else {
    console.warn('WebSocket not connected. Cannot send to:', destination);
  }
};

export const getStompClient = () => stompClient;

export default {
  connectWebSocket,
  disconnectWebSocket,
  subscribe,
  sendMessage,
  getStompClient,
};
