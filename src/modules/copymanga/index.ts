import express from 'express'
import axios from 'axios'
import { load } from 'cheerio'
import { parseImageData } from './utils'

const router = express.Router()

router.get('/comic/:comicId/chapter/:chapterId', async (req, res) => {
  const { comicId, chapterId } = req.params as Record<string, string>

  const { data } = await axios.get(
    `https://www.copymanga.site/comic/${comicId}/chapter/${chapterId}`
  )

  const $ = load(data)
  const imageData = $('.imageData').attr('contentkey')!
  const jojo = data.match(/var jojo = '(.*?)'/)[1]
  const manga = parseImageData(imageData, jojo)
  res.json({ ok: true, manga })
})

export default router
