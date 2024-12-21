import { onCleanup, createSignal } from "solid-js";
import SD from "~/SD";

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = createSignal(false);
  const [messages, setMessages] = createSignal<string[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  const [profileActive, setProfileActive] = createSignal<boolean>(false);
  const [isTargetWriting, setIsTargetWriting] = createSignal<boolean>(false);
  let socket: WebSocket | null = null;

  // Connect to the WebSocket
  const connect = () => {
    if (socket) {
      console.warn("WebSocket is already connected.");
      return;
    }

    // get jwt
    const jwt = window.localStorage.getItem(SD.localStorageKeys.jwt);
    socket = new WebSocket(url);

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
      socket?.send(JSON.stringify({ type: "auth", token: jwt }));
      console.log("WebSocket connected.");
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type == "isprofileactive") {
        setProfileActive(response.flag);
      }
      if (response.type == "targetdisconnected") {
        setProfileActive(false);
      }
      if (response.type == "targetconnected") {
        setProfileActive(true);
      }
      if (response.type == "newmessage") {
        setMessages((prev) => [response.message, ...prev]);
      }
      if (response.type == "iswriting") {
        console.log(response.flag);
        setIsTargetWriting(response.flag);
      }
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
    } else {
      console.error("Cannot send message: WebSocket is not connected.");
    }
  };

  // Cleanup on unmount
  onCleanup(() => {
    disconnect();
    setMessages([]);
  });

  return {
    isConnected,
    messages,
    error,
    connect,
    disconnect,
    sendMessage,
    profileActive,
    setMessages,
    isTargetWriting,
  };
}

export default useWebSocket;
