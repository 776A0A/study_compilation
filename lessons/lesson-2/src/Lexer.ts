import IdToken from './IdToken'
import LineNumberReader from './LineNumberReader'
import NumToken from './NumToken'
import StrToken from './StrToken'
import Token from './Token'

const regexPat =
  /\s*((?<comment>\/\/.*)|(?<int>\d+)|(?<str>"(\\"|\\\\|\\n|[^"])*")|(?<identifier>[a-zA-Z_]\w*)|(?<operator>(==|<=|>=|&&|\\|\\))|(?<punct>[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]))?/g

export default class Lexer {
  queue: Token[] = []
  hasMore = true
  reader: LineNumberReader

  constructor(codes: string) {
    this.reader = new LineNumberReader(codes)
  }

  read() {
    if (this.fillQueue(0)) return this.queue.shift()
    else return Token.EOF
  }

  peek(i: number) {
    if (this.fillQueue(i)) return this.queue[i]
    else return Token.EOF
  }

  private fillQueue(pos: number) {
    while (pos >= this.queue.length) {
      if (this.hasMore) this.readLine()
      else return false
    }
    return true
  }

  readLine() {
    const line = this.reader.readLine()

    if (line === null) {
      this.hasMore = false
      return
    }

    const lineNo = this.reader.getLineNumber()
    const matched = line.matchAll(regexPat)

    for (const m of matched) {
      this.addToken(lineNo, m)
    }
  }

  addToken(lineNo: number, matched: RegExpMatchArray) {
    const pos = matched.index
    const text = matched[1]

    if (text === undefined) return

    const obj: Record<string, string> = {}

    for (const [k, v] of Object.entries(matched.groups ?? {})) {
      if (v !== undefined) obj[k] = v
    }

    let type = ''
    for (const key of Object.keys(obj)) type = key

    const raw = { index: pos, text, type }

    let token: Token | undefined

    switch (raw.type) {
      case 'int':
        token = new NumToken(lineNo, +raw.text)
        break
      case 'str':
        token = new StrToken(lineNo, raw.text.slice(1, -1))
        break
      case 'identifier':
        token = new IdToken(lineNo, raw.text)
        break
      default:
        break
    }

    if (token) this.queue.push(token)
  }
}
