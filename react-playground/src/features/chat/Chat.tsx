import { useEffect, useRef, useState } from 'react';
import { useChat } from '../../helpers/useChat';

interface Props {
  username: string;
  room: string;
}

export function Chat({ username, room }: Props) {
  const {
    connected,
    messages,
    onlineCount,
    typingUsers,
    sendMessage,
    handleTyping,
  } = useChat({ username, room });
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    sendMessage(text);
    setText('');
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '20px auto',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 0',
          borderBottom: '1px solid #eee',
        }}
      >
        <strong>#{room}</strong>
        <span
          style={{ color: connected ? '#22c55e' : '#ef4444', fontSize: 13 }}
        >
          {connected ? `${onlineCount} online` : 'Disconnected'}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{ marginBottom: 12, color: m.system ? '#999' : 'inherit' }}
          >
            {!m.system && (
              <span style={{ fontWeight: 600, marginRight: 8 }}>
                {m.username}
              </span>
            )}
            <span style={{ fontSize: m.system ? 12 : 14 }}>{m.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ fontSize: 12, color: '#888', minHeight: 18 }}>
        {typingUsers.length > 0 &&
          `${typingUsers.join(', ')} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          paddingTop: 8,
          borderTop: '1px solid #eee',
        }}
      >
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Message..."
          style={{
            flex: 1,
            padding: 8,
            border: '1px solid #ccc',
            borderRadius: 4,
          }}
        />
        <button onClick={handleSend} style={{ padding: '8px 16px' }}>
          Send
        </button>
      </div>
    </div>
  );
}
