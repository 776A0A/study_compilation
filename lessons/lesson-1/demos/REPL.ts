import { question, argv, chalk } from 'zx'
import AstNode from './AstNode'
import Parser from './Parser'
import { error, log } from './utils'
import { AstType } from './types'

const verbose = !!argv.verbose

export default class REPL {
  parser = new Parser()
  variables = new Map<string, number | null>()

  async read() {
    const ask = async () => {
      let codes = ''

      while (codes === '' || !codes.endsWith(';')) {
        const code = await question('Input some code:\n')
        codes += (code.endsWith(';') ? '' : ' ') + code
      }

      codes = codes.trim()

      return codes
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const codes = await ask()

        const ast = this.parser.parse(codes)

        ast.children.forEach((node) => {
          const result = this.evaluate(node)

          log(chalk.yellow(`The result of codes "${codes}" is ${result}`))
        })
      } catch (err) {
        error(err)
      }
    }
  }

  evaluate(node: AstNode, indent = ''): number | null {
    verbose && log(`${indent}Evaluating ${node.text}`)

    let result: number | null = null

    switch (node.type) {
      case AstType.Additive:
      case AstType.Multiplicative: {
        const calc = Function(
          'total',
          'item',
          'indent',
          `return this.evaluate(item, indent) ${node.text} total`,
        ).bind(this)

        result = node.children.reduceRight(
          (total, item) => calc(total, item, indent + '  '),
          node.type === AstType.Additive ? 0 : 1,
        )
        break
      }

      case AstType.IntLiteral: {
        result = Number(node.text)
        break
      }

      case AstType.Identifier: {
        if (!this.variables.has(node.text))
          throw Error(`Unknown variable ${node.text}.`)

        result = Number(this.variables.get(node.text))
        break
      }

      case AstType.AssignmentStmt: {
        if (!this.variables.has(node.text))
          throw Error(`Unknown variable ${node.text}.`)

        result = this.evaluate(node.children.at(0)!, indent + '  ')
        this.variables.set(node.text, result)
        break
      }

      case AstType.IntDeclaration: {
        const child = node.children.at(0)
        result = child ? this.evaluate(child, indent + '  ') : result
        this.variables.set(node.text, result)
        break
      }
    }

    return result
  }
}
