import { useState } from 'react';
import { Chat } from './Chat';

export function BeginChat() {
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  if (joined) {
    return <Chat username={username} room={room} />;
  }

  return (
    <div
      style={{ maxWidth: 400, margin: '100px auto', fontFamily: 'sans-serif' }}
    >
      <h2>Join a room</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: 'block', marginBottom: 8, padding: 8, width: '100%' }}
      />
      <input
        placeholder="Room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        style={{ display: 'block', marginBottom: 8, padding: 8, width: '100%' }}
      />
      <button
        onClick={() => {
          if (username && room) setJoined(true);
        }}
        style={{ padding: '8px 16px' }}
      >
        Join
      </button>
    </div>
  );
}
