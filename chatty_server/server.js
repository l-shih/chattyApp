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

// function broadcast(data) {
//   wss.clients.forEach((client) => {
//     if (client.readyState == SocketServer.OPEN) {
//       client.send(JSON.stringify(data));
//     }
//   });
// };

wss.on('connection', (socket) => {
  clients.push(socket);
  const randomNum = Math.floor(Math.random() * 4) + 1;

  if (randomNum === 1) {
    color = 'red';
  } else if (randomNum === 2) {
    color = 'green';
  } else if (randomNum === 3) {
    color = 'yellow';
  } else if (randomNum === 4) {
    color = 'blue';
  }
  
  //console.log(randomNum);

  const userCount = {
    type: 'userCount',
    content: wss.clients.size
  };

  clients.forEach((client) => {
    if (client.readyState == socket.OPEN) {
      client.send(JSON.stringify(userCount));
    }
  })

  // Receives message object as a string, which needs to be changed to object
  socket.on('message', (message) => {
    let msgObj = JSON.parse(message);
    if  (msgObj.type == 'postNotification') {
      msgObj["type"] = 'incomingNotification'
      msgObj["clientColor"] = color;
    } else {
      msgObj["type"] = 'incomingMessage'
      msgObj["id"] = uuidv4();
    }
    console.log(msgObj);
    // Will show new message to all open clients
    clients.forEach((client) => {
      if (client.readyState === socket.OPEN) {
        client.send(JSON.stringify(msgObj));
      }
    });
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  socket.on('close', () => {
    console.log('Client disconnected')
    const userCount = {
      type: 'userCount',
      content: wss.clients.size
    };
    clients.forEach((client) => {
      if (client.readyState == socket.OPEN) {
        client.send(JSON.stringify(userCount));
      }
    })

  });

});
