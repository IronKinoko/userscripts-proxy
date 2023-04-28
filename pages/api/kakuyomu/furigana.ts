import Kuroshiro from 'kuroshiro'
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import { NextApiHandler } from 'next'
import axios from 'utils/axios'
import { JSDOM } from 'jsdom'
import path from 'path'

async function autoFurigana(html: string) {
  const window = new JSDOM(html).window
  const document = window.document

  const articleEl = document.body.querySelector('#contentMain-inner')!

  const kuroshiro = new Kuroshiro()
  await kuroshiro.init(
    new KuromojiAnalyzer({ dictPath: path.resolve(process.cwd(), 'public/kakuyomu/dict/') })
  )
  await (async function traverse(node: ChildNode) {
    if (node.nodeType === document.TEXT_NODE) {
      const result: string = await kuroshiro.convert(node.textContent, {
        mode: 'furigana',
        to: 'hiragana',
      })
      const dom = document.createElement('div')
      dom.innerHTML = result
      node.replaceWith(...dom.childNodes)
    } else if (node.childNodes.length) {
      await Promise.all(Array.from(node.childNodes).map(traverse))
    }
  })(articleEl)

  return articleEl.outerHTML
}

// http://localhost:3000/api/kakuyomu/furigana?workId=16817139555217983105&episodeId=16817139558201180147
const handler: NextApiHandler = async (req, res) => {
  const { workId, episodeId } = req.query as Record<string, string>

  try {
    const { data } = await axios.get(`https://kakuyomu.jp/works/${workId}/episodes/${episodeId}`)
    const result = await autoFurigana(data)
    res.json({ ok: true, html: result })
  } catch (error) {
    console.error(error)
    res.json({ ok: false, message: error.message })
  }
}

export default handler
