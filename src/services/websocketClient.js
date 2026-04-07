import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

let stompClient = null;
let subscriptions = {};

/**
 * Creates and connects a STOMP client.
 * JWT token is passed as a query param as per the integration contract with Karthik.
 *
 * @param {string} token - JWT token from localStorage
 * @param {Function} onConnected - callback fired when connection succeeds
 * @param {Function} onError - callback fired on connection error
 */
export const connectWebSocket = (token, onConnected, onError) => {
  if (stompClient && stompClient.connected) {
    onConnected();
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${WS_URL}?token=${token}`),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('[WS] Connected');
      if (onConnected) onConnected();
    },
    onStompError: (frame) => {
      console.error('[WS] STOMP error:', frame);
      if (onError) onError(frame);
    },
    onDisconnect: () => {
      console.log('[WS] Disconnected');
    },
  });

  stompClient.activate();
};

/**
 * Disconnects the STOMP client and clears all subscriptions.
 */
export const disconnectWebSocket = () => {
  if (stompClient) {
    Object.values(subscriptions).forEach((sub) => sub.unsubscribe());
    subscriptions = {};
    stompClient.deactivate();
    stompClient = null;
    console.log('[WS] Disconnected and cleaned up');
  }
};

/**
 * Subscribe to a STOMP topic.
 *
 * @param {string} topic - e.g. '/topic/chat.5'
 * @param {Function} callback - called with parsed JSON payload on each message
 * @returns {string} subscriptionKey for later unsubscribe
 */
export const subscribeToTopic = (topic, callback) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('[WS] Cannot subscribe — client not connected');
    return null;
  }

  if (subscriptions[topic]) {
    subscriptions[topic].unsubscribe();
  }

  const sub = stompClient.subscribe(topic, (message) => {
    try {
      const parsed = JSON.parse(message.body);
      callback(parsed);
    } catch (e) {
      console.error('[WS] Failed to parse message:', e);
    }
  });

  subscriptions[topic] = sub;
  return topic;
};

/**
 * Unsubscribe from a STOMP topic.
 */
export const unsubscribeFromTopic = (topic) => {
  if (subscriptions[topic]) {
    subscriptions[topic].unsubscribe();
    delete subscriptions[topic];
  }
};

/**
 * Publish a message to a STOMP destination.
 *
 * @param {string} destination - e.g. '/app/chat.send'
 * @param {object} body - payload object (will be JSON stringified)
 */
export const publishMessage = (destination, body) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('[WS] Cannot publish — client not connected');
    return;
  }
  stompClient.publish({
    destination,
    body: JSON.stringify(body),
  });
};

export const isConnected = () => stompClient?.connected ?? false;
