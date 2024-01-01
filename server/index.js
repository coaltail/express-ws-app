import express from 'express'
import { createServer } from 'node:http'
import socketSetup from './socket/index.js'
import userRoutes from './routes/user_routes.js'
import postRoutes from './routes/post_routes.js'
import chatRoutes from './routes/chat_routes.js'
import messageRoutes from './routes/message_routes.js'
import bodyParser from 'body-parser'
import { connect } from './db/database.js'
const app = express()
const server = createServer(app)
const io = socketSetup(server)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
connect().catch(error => console.error(error))

app.use('/auth', userRoutes)
app.use('/posts', postRoutes)
app.use('/chat', chatRoutes)
app.use('/chats/:chatId/messages', messageRoutes)
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(3000, () => {
  console.log('server running at http://localhost:3000')
})
