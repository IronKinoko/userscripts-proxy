import { NextApiHandler } from 'next'
import axios from 'utils/axios'
import { load } from 'cheerio'
import { parseImageData } from 'utils/copymanga'
import https from 'https'

type Query = {
  comicId: string
  chapterId: string
}
type Data = {
  ok: boolean
  message?: string
  manga?: { url: string }[]
  next?: Query
}

// http://localhost:3000/api/copymanga/comic/nvshendeairelieerzhi/chapter/685ba4c6-ad1f-11e9-ab52-00163e0ca5bd
const handler: NextApiHandler<Data> = async (req, res) => {
  const { comicId, chapterId } = req.query as Query

  const { data } = await axios.get(
    `https://www.copymanga.tv/comic/${comicId}/chapter/${chapterId}`,
    { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
  )

  const $ = load(data)
  const imageData = $('.imageData').attr('contentkey')!
  const jojo = data.match(/var jojo = '(.*?)'/)[1]
  const manga = parseImageData(imageData, jojo)

  let next: Query | undefined
  const nextHref = $('.comicContent-next a').attr('href')
  if (nextHref) {
    const match = nextHref.match(/comic\/(?<comicId>.*?)\/chapter\/(?<chapterId>.*)/)
    if (match) {
      next = match.groups! as Query
    }
  }

  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.json({ ok: true, manga, next })
}

export default handler
