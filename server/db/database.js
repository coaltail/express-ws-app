import mongoose from 'mongoose'
import 'dotenv/config'
const uri = process.env.MONGODB_URI
console.log('URI IS:', uri)
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

async function connect () {
  try {
    await mongoose.connect(uri, options)
    console.log('Database connected')
  } catch (error) {
    console.error(error)
  }
}

export default connect
