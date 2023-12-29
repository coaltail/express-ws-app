import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import userRoutes from './routes/user_routes.js'
import postRoutes from './routes/post_routes.js'
import bodyParser from 'body-parser'
import { connect } from './db/database.js'
const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
connect().catch(error => console.error(error))

app.use('/auth', userRoutes)
app.use('/posts', postRoutes)
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
