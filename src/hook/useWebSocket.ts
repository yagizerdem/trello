import { onCleanup, createSignal } from "solid-js";

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = createSignal(false);
  const [messages, setMessages] = createSignal<string[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  let socket: WebSocket | null = null;

  // Connect to the WebSocket
  const connect = () => {
    if (socket) {
      console.warn("WebSocket is already connected.");
      return;
    }

    socket = new WebSocket(url);

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
      console.log("WebSocket connected.");
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
      console.log("Message received:", event.data);
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket closed.");
    };

    socket.onerror = (e) => {
      setError("WebSocket error occurred.");
      console.error("WebSocket error:", e);
    };
  };

  // Disconnect from the WebSocket
  const disconnect = () => {
    if (socket) {
      socket.close();
      socket = null;
    }
  };

  // Send a message through the WebSocket
  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      console.log("Message sent:", message);
    } else {
      console.error("Cannot send message: WebSocket is not connected.");
    }
  };

  // Cleanup on unmount
  onCleanup(() => {
    disconnect();
  });

  return {
    isConnected,
    messages,
    error,
    connect,
    disconnect,
    sendMessage,
  };
}

export default useWebSocket;
