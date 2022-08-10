import AstTree from './AstTree'

export default class StoneError extends Error {
  constructor(message?: string)
  constructor(message?: string, ast?: AstTree)
  constructor(message?: string, ast?: AstTree) {
    super(message)

    if (ast) super(`${message} ${ast.location()}`)
  }
}
