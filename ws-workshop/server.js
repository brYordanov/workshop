const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

let tasks = [];

function broadcast(data, excludeClient = null) {
  const message = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client !== excludeClient && client.readyState === 1) {
      client.send(message);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('Client connected. Total:', wss.clients.size);

  ws.send(JSON.stringify({ type: 'init', tasks }));
  broadcast({ type: 'presence', count: wss.clients.size });
  ws.send(JSON.stringify({ type: 'presence', count: wss.clients.size }));

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);

    if (msg.type === 'add_task') {
      const task = msg.task;
      tasks.push(task);
      broadcast({ type: 'task_added', task }, ws);
    }

    if (msg.type === 'toggle_task') {
      const task = tasks.find((t) => t.id === msg.id);
      if (task) {
        task.done = !task.done;
        broadcast({ type: 'task_toggled', id: task.id, done: task.done }, ws);
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected. Total:', wss.clients.size);
    broadcast({ type: 'presence', count: wss.clients.size });
  });
});

console.log('WebSocket server running on ws://localhost:8080');
