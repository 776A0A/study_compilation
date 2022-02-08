/**
 * initToken 完成一个 token 分析并初始化状态
 * tokenize 循环遍历输入的 token 字符，处理可能的 token
 * Token 简单的封装 token
 * DfaState 状态机枚举
 * TokenReader 负责读取所有的 token
 */

import SimpleTokenReader from './SimpleTokenReader'
import Token from './Token'
import { TokenType } from './types/TokenType'

enum DfaState {
  Initial,

  If,
  Id_if1,
  Id_if2,
  Else,
  Id_else1,
  Id_else2,
  Id_else3,
  Id_else4,
  Int,
  Id_int1,
  Id_int2,
  Id_int3,
  Id,
  GT,
  GE,

  Assignment,

  Plus,
  Minus,
  Star,
  Slash,

  SemiColon,
  LeftParen,
  RightParen,

  IntLiteral,
}

export default class SimpleLexer {
  token = new Token()
  tokens = new Set<Token>()

  constructor() {
    SimpleLexer.dump(this.tokenize('int age = 45;'))
    SimpleLexer.dump(this.tokenize('inta age = 45'))
    SimpleLexer.dump(this.tokenize('in age = 45;'))
    SimpleLexer.dump(this.tokenize('age >= 45;'))
    SimpleLexer.dump(this.tokenize('age > 45;'))
  }

  initToken(ch: string) {
    const token = this.token
    const tokens = this.tokens

    if (token.text.length) {
      tokens.add(token)

      this.token = new Token()
    }

    let newState = DfaState.Initial

    if (isAlpha(ch)) {
      if (ch === 'i') newState = DfaState.Id_int1
      // 更高的优先级
      else newState = DfaState.Id

      token.type = TokenType.Identifier // 同时类型都为 Identifier
      token.text += ch
    } else if (isDigit(ch)) {
      newState = DfaState.IntLiteral
      token.type = TokenType.IntLiteral
      token.text += ch
    } else if (ch === '>') {
      newState = DfaState.GT
      token.type = TokenType.GT
      token.text += ch
    } else if (ch === '+') {
      newState = DfaState.Plus
      token.type = TokenType.Plus
      token.text += ch
    } else if (ch === '-') {
      newState = DfaState.Minus
      token.type = TokenType.Minus
      token.text += ch
    } else if (ch === '*') {
      newState = DfaState.Star
      token.type = TokenType.Star
      token.text += ch
    } else if (ch === '/') {
      newState = DfaState.Slash
      token.type = TokenType.Slash
      token.text += ch
    } else if (ch === ';') {
      newState = DfaState.SemiColon
      token.type = TokenType.SemiColon
      token.text += ch
    } else if (ch === '(') {
      newState = DfaState.LeftParen
      token.type = TokenType.LeftParen
      token.text += ch
    } else if (ch === ')') {
      newState = DfaState.RightParen
      token.type = TokenType.RightParen
      token.text += ch
    } else if (ch === '=') {
      newState = DfaState.Assignment
      token.type = TokenType.Assignment
      token.text += ch
    }

    return newState
  }

  tokenize(code: string) {
    this.tokens = new Set<Token>()
    this.token = new Token()

    let state = DfaState.Initial

    try {
      let ch: string | undefined,
        i = 0
      while ((ch = code[i++])) {
        switch (state) {
          case DfaState.Initial:
            state = this.initToken(ch)
            break
          case DfaState.Id:
            if (isAlpha(ch) || isDigit(ch)) this.token.text += ch
            else state = this.initToken(ch)
            break
          case DfaState.GT:
            if (ch === '=') {
              this.token.type = TokenType.GE
              state = DfaState.GE
              this.token.text += ch
            } else state = this.initToken(ch)
            break
          case DfaState.GE:
          case DfaState.Assignment:
          case DfaState.Plus:
          case DfaState.Minus:
          case DfaState.Star:
          case DfaState.Slash:
          case DfaState.SemiColon:
          case DfaState.LeftParen:
          case DfaState.RightParen:
            state = this.initToken(ch)
            break
          case DfaState.IntLiteral:
            if (isDigit(ch)) this.token.text += ch
            else state = this.initToken(ch)
            break
          case DfaState.Id_int1:
            if (ch === 'n') {
              state = DfaState.Id_int2
              this.token.text += ch
            } else if (isAlpha(ch) || isDigit(ch)) {
              state = DfaState.Id
              this.token.text += ch
            } else state = this.initToken(ch)
            break
          case DfaState.Id_int2:
            if (ch === 't') {
              state = DfaState.Id_int3
              this.token.text += ch
            } else if (isAlpha(ch) || isDigit(ch)) {
              state = DfaState.Id
              this.token.text += ch
            } else state = this.initToken(ch)
            break
          case DfaState.Id_int3:
            if (isBlank(ch)) {
              this.token.type = TokenType.Int
              state = this.initToken(ch)
            } else {
              state = DfaState.Id
              this.token.text += ch
            }
            break
          default:
            break
        }
      }

      if (this.token.text.length) this.initToken(ch)
    } catch (error) {
      console.log(error)
    }

    return new SimpleTokenReader([...this.tokens])
  }

  static dump(reader: SimpleTokenReader) {
    let token: Token | null = null
    while ((token = reader.read())) {
      console.log(`${token.type}: ${token.text}`)
    }
  }
}

function isAlpha(ch: string) {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')
}

function isDigit(ch: string) {
  return ch >= '0' && ch <= '9'
}

function isBlank(ch: string) {
  return ch === ' ' || ch === '\t' || ch === '\n'
}
