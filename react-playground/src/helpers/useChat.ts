import { useCallback, useEffect, useRef, useState } from 'react';

interface Message {
  id: number;
  username: string;
  text: string;
  timestamp: string;
  system?: boolean;
}

export function useChat({
  username,
  room,
  url = 'ws://localhost:3000/chat',
}: {
  username: string;
  room: string;
  url?: string;
}) {
  const ws = useRef<WebSocket | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Stable sender — never changes between renders
  const send = useCallback((event: string, data: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ event, data }));
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => {
      setConnected(true);
      send('join_room', { username, room });
    };

    socket.onclose = () => setConnected(false);

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'new_message') {
        setMessages((prev) => [...prev, msg.message]);
      }

      if (msg.type === 'system_message') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            username: 'system',
            text: msg.text,
            timestamp: new Date().toISOString(),
            system: true,
          },
        ]);
      }

      if (msg.type === 'presence') {
        setOnlineCount(msg.count);
      }

      if (msg.type === 'typing') {
        setTypingUsers((prev) => {
          if (msg.isTyping)
            return prev.includes(msg.username) ? prev : [...prev, msg.username];
          return prev.filter((u) => u !== msg.username);
        });
      }
    };

    return () => {
      socket.close();
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [url, username, room, send]);

  const stopTyping = useCallback(() => {
    send('typing', { isTyping: false });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  }, [send]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      send('send_message', { text });
      stopTyping();
    },
    [send, stopTyping]
  );

  const handleTyping = useCallback(() => {
    send('typing', { isTyping: true });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(stopTyping, 1500);
  }, [send, stopTyping]);

  return {
    connected,
    messages,
    onlineCount,
    typingUsers,
    sendMessage,
    handleTyping,
  };
}
