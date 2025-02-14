import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.log('Cant verify token')
        return next(new Error('Authentication error'))
      }
      socket.decoded = decoded
      next()
    })
  })

  io.on('connection', (socket) => {
    // Join a room
    socket.on('joinRoom', (room) => {
      socket.join(room)
    })
    // Handle chat messages within a room
    socket.on('chatMessage', ({ room, message }) => {
      io.to(room).emit('chatMessage', {
        username: socket.decoded.payload.username,
        message
      })
    })

    // Disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.decoded.payload.username)
      io.emit('userDisconnected', socket.decoded.payload.username)
    })
  })

  return io
}

export default socketSetup
