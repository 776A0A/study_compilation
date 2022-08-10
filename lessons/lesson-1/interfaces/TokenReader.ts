import Token from '../Token'

export interface TokenReader {
  read(): Token | null

  peek(): Token | null

  unread(): void

  getPosition(): number

  setPosition(pos: number): void
}
