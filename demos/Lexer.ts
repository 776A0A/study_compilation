import Token from './Token'
import { DfaStates, TokenType } from './types'
import { error, log } from './utils'

export default class Lexer {
  token: Token | null = null
  tokens: Token[] = []

  tokenize(codes: string) {
    this.token = new Token()
    this.tokens = []

    let state = DfaStates.Initial

    try {
      let ch: string,
        i = 0
      while ((ch = codes[i++])) {
        switch (state) {
          case DfaStates.Initial:
            state = this.initToken(ch)
            break
          case DfaStates.Id_int1:
            if (ch === 'n') {
              state = DfaStates.Id_int2
              this.token.text += ch
            } else if (isAlpha(ch) || isDigit(ch)) {
              state = DfaStates.Identifier
              this.token.text += ch
            } else {
              state = this.initToken(ch)
            }
            break
          case DfaStates.Id_int2:
            if (ch === 't') {
              state = DfaStates.Id_int3
              this.token.text += ch
            } else if (isAlpha(ch) || isDigit(ch)) {
              state = DfaStates.Identifier
              this.token.text += ch
            } else {
              state = this.initToken(ch)
            }
            break
          case DfaStates.Id_int3:
            if (isBlank(ch)) {
              this.token.type = TokenType.Int
              state = this.initToken(ch)
            } else if (isAlpha(ch) || isDigit(ch)) {
              state = DfaStates.Identifier
              this.token.text += ch
            } else {
              throw Error(`Keyword "int" should not be identifier.`)
            }
            break
          case DfaStates.Identifier:
            if (isAlpha(ch) || isDigit(ch)) {
              this.token.text += ch
            } else {
              state = this.initToken(ch)
            }
            break
          case DfaStates.IntLiteral:
            if (isDigit(ch)) {
              this.token.text += ch
            } else if (isAlpha(ch)) {
              throw Error(`Identifier should not start with digit.`)
            } else {
              state = this.initToken(ch)
            }
            break
          case DfaStates.Assignment:
          case DfaStates.SemiColon:
          case DfaStates.Plus:
          case DfaStates.Minus:
          case DfaStates.Star:
          case DfaStates.Slash:
          case DfaStates.LeftParen:
          case DfaStates.RightParen:
          default:
            state = this.initToken(ch)
        }
      }

      if (this.token.text.length) this.initToken(ch)
    } catch (err) {
      error(err)
    }

    return this.tokens
  }

  initToken(ch: string) {
    if (!this.token) return DfaStates.Initial

    if (this.token.text.length) {
      this.tokens.push(this.token)
      this.token = new Token()
    }

    const token = this.token

    let state = DfaStates.Initial

    if (ch === 'i') {
      state = DfaStates.Id_int1
      token.type = TokenType.Identifier
      token.text += ch
    } else if (isAlpha(ch)) {
      state = DfaStates.Identifier
      token.type = TokenType.Identifier
      token.text += ch
    } else if (isDigit(ch)) {
      state = DfaStates.IntLiteral
      token.type = TokenType.IntLiteral
      token.text += ch
    } else if (ch === '=') {
      state = DfaStates.Assignment
      token.type = TokenType.Assignment
      token.text += ch
    } else if (ch === ';') {
      state = DfaStates.SemiColon
      token.type = TokenType.SemiColon
      token.text += ch
    } else if (ch === '+') {
      state = DfaStates.Plus
      token.type = TokenType.Plus
      token.text += ch
    } else if (ch === '-') {
      state = DfaStates.Minus
      token.type = TokenType.Minus
      token.text += ch
    } else if (ch === '*') {
      state = DfaStates.Star
      token.type = TokenType.Star
      token.text += ch
    } else if (ch === '/') {
      state = DfaStates.Slash
      token.type = TokenType.Slash
      token.text += ch
    } else if (ch === '(') {
      state = DfaStates.LeftParen
      token.type = TokenType.LeftParen
      token.text += ch
    } else if (ch === ')') {
      state = DfaStates.RightParen
      token.type = TokenType.RightParen
      token.text += ch
    }

    return state
  }
}

function isAlpha(ch: any) {
  return /[a-zA-Z]/.test(ch)
}

function isDigit(ch: any) {
  return /\d/.test(ch)
}

function isBlank(ch: any) {
  return /\s+/.test(ch)
}
