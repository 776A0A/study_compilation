import Token from './Token'

export default class ParseError extends Error {
  constructor(token: Token, message?: string) {
    super(
      `syntax error around ${location(token)}.${
        typeof message === 'string' ? ` ${message}` : ''
      }`,
    )

    function location(token: Token) {
      if (token === Token.EOF) return 'the last line'
      return `"${token.getText()}" at line ${token.getLineNumber()}`
    }
  }
}
