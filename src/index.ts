import './pre-patch'
import express from 'express'

const PORT = process.env.PORT || 48888
const app = express()

import copymanga from './modules/copymanga'
app.use('/api/copymanga', copymanga)

app.listen(PORT, () => {
  console.log(`listen in http://127.0.0.1:${PORT}`)
})
