import IdToken from './IdToken'
import LineNumberReader from './LineNumberReader'
import NumToken from './NumToken'
import StrToken from './StrToken'
import Token from './Token'

const space = '\\s*'
const comment = '?<comment>\\/\\/.*'
const int = '?<int>\\d+'
const str = '?<str>"(\\\\"|\\\\\\\\|\\\\n|[^"])*"'
const id = '?<id>[a-zA-Z_]\\w*'
const operator = '?<operator>==|>=|<=|&&|\\|\\|'
const punct = `?<punct>[!"#$%&'()*+,-./:;<=>?@\\[\\]^_\`{|}~]`

const regexStr = `${space}((${comment})|(${int})|(${str})|(${id})|(${operator})|(${punct}))?`

/**
 * expression: term { ("+" | "-") term }
 * term: factor { ("*" | "/") factor }
 * factor: NUMBER | "(" expression ")"
 */

export default class Lexer {
  queue: Token[] = []
  hasMore = true
  reader: LineNumberReader
  regexPat = new RegExp(regexStr, 'g')

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
    const matched = line.matchAll(this.regexPat)

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
      case 'id':
        token = new IdToken(lineNo, raw.text)
        break
      default:
        break
    }

    if (token) this.queue.push(token)
  }
}
