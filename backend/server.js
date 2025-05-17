const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

const users = new Map(); // socket.id -> username

io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado:', socket.id);

  // Guardar el nombre del usuario
  socket.on('register', (username) => {
    users.set(socket.id, username);
    console.log(`Usuario ${username} registrado como ${socket.id}`);
  });

  // Mensaje privado
  socket.on('private message', ({ to, message }) => {
    for (let [id, username] of users.entries()) {
      if (username === to) {
        io.to(id).emit('private message', {
          from: users.get(socket.id),
          message
        });
        break;
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`Usuario ${users.get(socket.id)} desconectado`);
    users.delete(socket.id);
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
