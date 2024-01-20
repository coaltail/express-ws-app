import express from 'express'
import { createServer } from 'node:http'
import socketSetup from './socket/index.js'
import userRoutes from './routes/user_routes.js'
import postRoutes from './routes/post_routes.js'
import chatRoutes from './routes/chat_routes.js'
import messageRoutes from './routes/message_routes.js'
import bodyParser from 'body-parser'
import { connect } from './db/database.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
const server = createServer(app)
const io = socketSetup(server)

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
connect().catch(error => console.error(error))

const apiRouter = express.Router()
app.use('/api', apiRouter)

apiRouter.use('/auth', userRoutes)
apiRouter.use('/posts', postRoutes)
apiRouter.use('/chat', chatRoutes)
apiRouter.use('/t', messageRoutes)

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
})
app.get('/healthcheck', (req, res) => { res.end('ok') })

server.listen(3000, () => {
  console.log('server running at http://localhost:3000')
})
