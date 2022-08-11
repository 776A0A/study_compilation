import Lexer from './src/Lexer'
import Token from './src/Token'

const codes = `
while i < 10 {
  sum = sum + i
  i=i+1
}
sum
`

class LexerRunner {
  lexer: Lexer

  constructor(codes: string) {
    this.lexer = new Lexer(codes)
  }

  run() {
    let token: Token | undefined
    while ((token = this.lexer.read()) !== Token.EOF) {
      console.log(`=> ${token?.getText()}`)
    }
  }
}

const runner = new LexerRunner(codes)

runner.run()
