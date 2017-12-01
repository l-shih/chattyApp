const express = require('express');
const { OPEN, Server } = require('ws');
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new Server({ server });

function getRandomColor() {
  const colors = ['red','green','yellow','blue','purple','cyan'];
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

  // Receives message object as a string, which needs to be changed to object
  socket.on('message', (data) => {
    let message = JSON.parse(data);
    
    switch(message.type) {
      case 'postNotification':
        message.type = 'incomingNotification'
        break;
      default:
        message.type = 'incomingMessage';
    }

    message.color = color;
    message.id = uuidv4();
    // console.dir(message, { colors: true });
    // Will show new message to all open clients
    broadcast(message);
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  socket.on('close', () => {
    console.log('Client disconnected')
    updateOnlineCount();
  });

});
