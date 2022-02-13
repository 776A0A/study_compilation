import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { argv, chalk, question } from 'zx'
import { ASTNode } from './interfaces/ASTNode'
import SimpleParser from './SimpleParser'
import { ASTNodeType } from './types/ASTNodeType'

const verbose = argv.verbose ?? argv.v

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

if (verbose) {
  console.log(chalk.bgBlue('\nverbose mode.'))
}

const parser = new SimpleParser()
const variables = new Map<string, unknown>()

read()

async function read(round = 1) {
  try {
    console.log(chalk.blue(`---------- Round: ${round}. ----------\n`))

    const script = (
      await question(chalk.blue('Please input some script:\n'))
    ).trim()

    if (script === 'exit();') return console.log(chalk.blue(`good bye!`))

    const tree = parser.parse(script)

    if (verbose) parser.dumpAST(tree, '')

    evaluate(tree, '')

    read(++round)
  } catch (error) {
    console.log(chalk.bgRed('Error: \n'))
    console.log(error)
    read(++round)
  }
}

function evaluate(node: ASTNode, indent: string) {
  if (verbose) {
    console.log(chalk.yellow(`${indent}Calculating: ${node.getType()}`))
  }

  let result = 0

  switch (node.getType()) {
    case ASTNodeType.Program:
      node.getChildren().forEach((child) => (result = evaluate(child, indent)))
      break

    case ASTNodeType.Additive:
      {
        const [child1, child2] = node.getChildren()
        const value1 = evaluate(child1, `${indent}\t`),
          value2 = evaluate(child2, `${indent}\t`)

        if (node.getText() === '+') result = value1 + value2
        else result = value1 - value2
      }

      break

    case ASTNodeType.Multiplicative:
      {
        const [child1, child2] = node.getChildren()
        const value1 = evaluate(child1, `${indent}\t`),
          value2 = evaluate(child2, `${indent}\t`)

        if (node.getText() === '*') result = value1 * value2
        else result = value1 / value2
      }

      break

    case ASTNodeType.IntLiteral:
      result = +node.getText()
      break

    case ASTNodeType.Identifier:
      {
        const varName = node.getText()
        if (variables.has(varName)) {
          const value = variables.get(varName)

          if (value !== undefined) result = Number(value)
          else throw Error(`variable ${varName} has not been set any value`)
        } else throw Error(`unknown variable: ${varName}`)
      }

      break

    case ASTNodeType.AssignmentStmt: {
      const varName = node.getText()
      if (!variables.has(varName)) throw Error(`unknown variable: ${varName}`)
    }

    case ASTNodeType.IntDeclaration:
      {
        const varName = node.getText()
        let value: unknown

        if (node.getChildren().length) {
          const child = node.getChildren()[0]
          result = evaluate(child, `${indent}\t`)
          value = +result
        }

        variables.set(varName, value)
      }

      break

    default:
      break
  }

  if (verbose) console.log(`${indent}Result: ${result}`)
  else if (indent === '') {
    if (
      node.getType() === ASTNodeType.IntDeclaration ||
      node.getType() === ASTNodeType.AssignmentStmt
    ) {
      console.log(`${node.getText()}: ${result}`)
    } else if (node.getType() !== ASTNodeType.Program) {
      console.log(result)
    }
  }

  return result
}
