const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;
const clients = [];

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
wss.on('connection', (socket) => {
  //clients.push(socket);

  socket.on('message', (message) => {
    let msgObj = JSON.parse(message);
    msgObj["id"] = uuidv4();
    wss.clients.forEach((client) => {
      if (client.readyState === socket.OPEN) {
        client.send(JSON.stringify(msgObj));
      }
    });
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  socket.on('close', () => console.log('Client disconnected'));
});
