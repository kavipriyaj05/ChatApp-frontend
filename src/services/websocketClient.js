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

// Track active subscriptions for unsubscribe support
const subscriptions = {};

export const subscribe = (destination, callback) => {
  if (stompClient && stompClient.connected) {
    const sub = stompClient.subscribe(destination, (message) => {
      const body = JSON.parse(message.body);
      callback(body);
    });
    subscriptions[destination] = sub;
    return sub;
  }
  console.warn('WebSocket not connected. Cannot subscribe to:', destination);
  return null;
};

// Alias used by Maha's useWebSocket hook
export const subscribeToTopic = subscribe;

export const unsubscribeFromTopic = (destination) => {
  const sub = subscriptions[destination];
  if (sub) {
    sub.unsubscribe();
    delete subscriptions[destination];
  }
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

// Alias used by Maha's useWebSocket hook
export const publishMessage = sendMessage;

export const isConnected = () => !!(stompClient && stompClient.connected);

export const getStompClient = () => stompClient;

export default {
  connectWebSocket,
  disconnectWebSocket,
  subscribe,
  subscribeToTopic,
  unsubscribeFromTopic,
  sendMessage,
  publishMessage,
  isConnected,
  getStompClient,
};
