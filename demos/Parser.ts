/* eslint-disable no-constant-condition */
import { argv, chalk } from 'zx'
import AstNode from './AstNode'
import Lexer from './Lexer'
import TokenReader from './TokenReader'
import { AstType, TokenType } from './types'
import { log } from './utils'

const logTokens = !!argv.tokens
const logAst = !!argv.ast

/**
 * program ::= (statement)+
 * statement ::= intDecStmt | expStmt | assignmentStmt
 * intDecStmt ::= 'int' Identifier ('=' additiveExp)? ';'
 * expStmt ::= additiveExp ';'
 * assignmentStmt ::= Identifier '=' additiveExp ';'
 * additiveExp ::= multiExp ('+' | '-' multiExp)*
 * multiExp ::= priExp ('*' | '/' priExp)*
 * priExp ::= Identifier | IntLiteral | '(' additiveExp ')'
 */

export default class Parser {
  parse(codes: string) {
    const lexer = new Lexer()
    const tokens = lexer.tokenize(codes)
    log(`Parsing codes: 
    ${codes}`)

    logTokens && log(chalk.blue(tokens))

    const reader = new TokenReader(tokens)
    return this.buildAst(reader)
  }

  buildAst(reader: TokenReader) {
    const root = new AstNode(AstType.Program, 'pwc')

    while (reader.peek() !== null) {
      let node = this.intDecStmt(reader)

      if (node === null) node = this.expStmt(reader)
      if (node === null) node = this.assignmentStmt(reader)

      if (node !== null) root.addChild(node)
      else throw Error('Unknown statement.')
    }

    logAst && this.dumpAst(root)

    return root
  }

  intDecStmt(reader: TokenReader) {
    let node: AstNode | null = null,
      token = reader.peek()

    if (token?.type === TokenType.Int) {
      token = reader.read()! // Int
      if (reader.peek()?.type === TokenType.Identifier) {
        token = reader.read()! // Id
        node = new AstNode(AstType.IntDeclaration, token.text)

        if (reader.peek()?.type === TokenType.Assignment) {
          reader.read() // =
          const child = this.additive(reader)
          if (child !== null) node.addChild(child)
          else throw Error('Should be expression after Assignment.')
        }

        if (reader.peek()?.type !== TokenType.SemiColon) {
          throw Error('Missing colon after int declaration.')
        } else reader.read()
      } else {
        throw Error('Should be Identifier after int keyword.')
      }
    }

    return node
  }

  expStmt(reader: TokenReader) {
    const pos = reader.pos
    let node = this.additive(reader)

    if (node !== null) {
      const token = reader.peek()
      if (token?.type !== TokenType.SemiColon) {
        node = null
        reader.setPos(pos)
      } else reader.read()
    }

    return node
  }

  assignmentStmt(reader: TokenReader) {
    let node: AstNode | null = null,
      token = reader.peek()

    if (token?.type === TokenType.Identifier) {
      token = reader.read()!
      if (reader.peek()?.type === TokenType.Assignment) {
        node = new AstNode(AstType.AssignmentStmt, token.text)
        reader.read() // =
        const child = this.additive(reader)
        if (child !== null) {
          node.addChild(child)

          if (reader.peek()?.type !== TokenType.SemiColon) {
            throw Error('Missing colon after assignment statement.')
          } else reader.read()
        } else {
          throw Error(`Expecting an expression after =.`)
        }
      } else {
        reader.unread()
      }
    }

    return node
  }

  additive(reader: TokenReader) {
    let node = this.multiplicative(reader),
      child1 = node

    if (node !== null) {
      while (true) {
        let token = reader.peek()
        if (token?.type === TokenType.Plus || token?.type === TokenType.Minus) {
          token = reader.read()! // + or -
          node = new AstNode(AstType.Additive, token.text)
          const child2 = this.multiplicative(reader)
          if (child2 === null) throw Error('Should not be null after +|- sign.')
          else {
            node.addChild(child1!)
            node.addChild(child2)
            child1 = node
          }
        } else break
      }
    }

    return node
  }

  multiplicative(reader: TokenReader) {
    let node = this.primary(reader),
      child1 = node

    if (node !== null) {
      while (true) {
        let token = reader.peek()
        if (token?.type === TokenType.Star || token?.type === TokenType.Slash) {
          token = reader.read()! // * or /
          node = new AstNode(AstType.Multiplicative, token.text)
          const child2 = this.primary(reader)
          if (child2 === null) throw Error('Should not be null after *|/ sign.')
          else {
            node.addChild(child1!)
            node.addChild(child2)
            child1 = node
          }
        } else break
      }
    }

    return node
  }

  primary(reader: TokenReader): AstNode | null {
    let node: AstNode | null = null,
      token = reader.peek()

    if (token) {
      if (token.type === TokenType.Identifier) {
        token = reader.read()!
        node = new AstNode(AstType.Identifier, token.text)
      } else if (token.type === TokenType.IntLiteral) {
        token = reader.read()!
        node = new AstNode(AstType.IntLiteral, token.text)
      } else if (token.type === TokenType.LeftParen) {
        reader.read() // (
        node = this.additive(reader)
        if (node === null) throw Error('Should not be null after (.')
        else {
          token = reader.peek()
          if (token?.type !== TokenType.RightParen) throw Error('Missing ).')
          else reader.read() // )
        }
      } else throw Error('Unknown terminator.')
    }

    return node
  }

  dumpAst(node: AstNode) {
    let tree = ``

    const buildTree = (node: AstNode, level = 0) => {
      tree += `${Array.from({ length: level }).reduce(
        (str) => str + '    ',
        '',
      )}${level ? '└' : ''}${Array.from({ length: level }).reduce(
        (str) => str + '──',
        '',
      )}  ${node.type.toString()}: ${node.text}\n\n`
      if (node.children.length) {
        node.children.forEach((child) => buildTree(child, level + 1))
      }
    }

    buildTree(node)

    log(chalk.green(`AST Tree: `))
    log(chalk.green(tree))
  }
}
