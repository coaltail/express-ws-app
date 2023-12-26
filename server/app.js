import connect from './db/database'

connect().catch(error => console.error(error))
