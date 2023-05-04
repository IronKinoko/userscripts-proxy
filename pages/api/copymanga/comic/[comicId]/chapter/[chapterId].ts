import { NextApiHandler } from 'next'
import axios from 'utils/axios'
import { load } from 'cheerio'
import { parseImageData } from 'utils/copymanga'

type Query = {
  comicId: string
  chapterId: string
}
type Data = {
  ok: boolean
  message?: string
  manga?: { url: string }[]
}

// http://localhost:3000/api/copymanga/comic/nvshendeairelieerzhi/chapter/685ba4c6-ad1f-11e9-ab52-00163e0ca5bd
const handler: NextApiHandler<Data> = async (req, res) => {
  const { comicId, chapterId } = req.query as Query

  const { data } = await axios.get(
    `https://www.copymanga.site/comic/${comicId}/chapter/${chapterId}`,
    { headers: { cookie: 'webp=1' } }
  )

  const $ = load(data)
  const imageData = $('.imageData').attr('contentkey')!
  const jojo = data.match(/var jojo = '(.*?)'/)[1]
  const manga = parseImageData(imageData, jojo)
  res.json({ ok: true, manga })
}

export default handler
