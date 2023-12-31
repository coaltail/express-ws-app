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
    console.log(socket.handshake)
    if (!token) {
      return next(new Error('Authentication error'))
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'))
      }
      socket.decoded = decoded
      next()
    })
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.decoded)

    // Join a room
    socket.on('joinRoom', (room) => {
      socket.join(room)
      console.log(`${socket.decoded.userId} joined room: ${room}`)
    })

    // Handle chat messages within a room
    socket.on('chatMessage', ({ room, message }) => {
      io.to(room).emit('chatMessage', {
        username: socket.decoded.userId,
        message
      })
    })

    // Disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.decoded.userId)
    })
  })

  return io
}

export default socketSetup
