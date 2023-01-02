import { NextApiHandler } from 'next'
import axios from 'utils/axios'
import { load } from 'cheerio'
import { parseImageData } from 'utils/copymanga'

const handler: NextApiHandler = async (req, res) => {
  const { comicId, chapterId } = req.query as Record<string, string>

  const { data } = await axios.get(
    `https://www.copymanga.site/comic/${comicId}/chapter/${chapterId}`
  )

  const $ = load(data)
  const imageData = $('.imageData').attr('contentkey')!
  const jojo = data.match(/var jojo = '(.*?)'/)[1]
  const manga = parseImageData(imageData, jojo)
  res.json({ ok: true, manga })
}

export default handler
