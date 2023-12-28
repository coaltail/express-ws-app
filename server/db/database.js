import mongoose from 'mongoose'
import 'dotenv/config'
const uri = process.env.MONGODB_URI

export async function connect () {
  try {
    await mongoose.connect(uri)
    console.log('Database connected')
  } catch (error) {
    console.error(error)
  }
}

export async function close () {
  try {
    await mongoose.connection.close()
    console.log('Database connection closed')
  } catch (error) {
    console.error(error)
  }
}
