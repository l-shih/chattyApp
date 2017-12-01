const { OPEN, Server } = require('ws');
const express = require('express');
const uuidv4 = require('uuid/v4');

const PORT = 3001;

const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new Server({ server });

function getRandomColor() {
  const colors = ['red','green','blue','purple'];
  const randomNum = Math.floor(Math.random() * colors.length) + 1;
  return colors[randomNum];
}

function broadcast(data) {
  const payload = JSON.stringify(data);

  wss.clients.forEach((client) => {
    if (client.readyState === OPEN) {
      client.send(payload);
    }
  });
};

function updateOnlineCount() {
  broadcast({
    type: 'userCount',
    content: wss.clients.size
  });
}

wss.on('connection', (socket) => {
  console.log('Client connected');

  const color = getRandomColor();
  
  updateOnlineCount();

  socket.on('message', (data) => {
    let message = JSON.parse(data);
    
    switch(message.type) {
      case 'postNotification':
        message.type = 'incomingNotification'
        break;
      case 'postTextMessage':
        message.type = 'incomingTextMessage';
        break;
      default:
        message.type = 'incomingImageMessage';
    }

    message.color = color;
    message.id = uuidv4();

    broadcast(message);
  });

  socket.on('close', () => {
    console.log('Client disconnected')
    updateOnlineCount();
  });

});
