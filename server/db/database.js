import mongoose from 'mongoose'
import 'dotenv/config'
const uri = process.env.MONGODB_URI

async function connect () {
  try {
    await mongoose.connect(uri)
    console.log('Database connected')
  } catch (error) {
    console.error(error)
  }
}

export default connect
