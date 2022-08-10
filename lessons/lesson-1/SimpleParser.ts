import { chalk } from 'zx'
import { ASTNode } from './interfaces/ASTNode'
import { TokenReader } from './interfaces/TokenReader'
import SimpleASTNode from './SimpleASTNode'
import SimpleLexer from './SimpleLexer'
import { ASTNodeType } from './types/ASTNodeType'
import { TokenType } from './types/TokenType'

export default class SimpleParser {
  constructor() {
    // let tree: ASTNode | null = null
    // tree = this.parse('int age = 45 + 2 ; age = 20 ; age + 10 * 2 ;')
    // this.dumpAST(tree, '')
  }

  parse(script: string) {
    const lexer = new SimpleLexer()
    const rootNode = this.prog(lexer.tokenize(script))
    return rootNode
  }

  prog(tokens: TokenReader) {
    const node = new SimpleASTNode(ASTNodeType.Program, 'pwc')

    while (tokens.peek() !== null) {
      // 按照语句的文法规则一个一个的匹配
      let child = this.intDeclare(tokens)
      if (child === null) child = this.expressionStatement(tokens)
      if (child === null) child = this.assignmentStatement(tokens)

      if (child !== null) node.addChild(child)
      else throw Error('unknown statement')
    }

    return node
  }

  intDeclare(tokens: TokenReader) {
    let node: SimpleASTNode | null = null
    let token = tokens.peek()

    if (token !== null && token.getType() === TokenType.Int) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      token = tokens.read()!
      if (tokens.peek()?.getType() === TokenType.Identifier) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token = tokens.read()!
        node = new SimpleASTNode(ASTNodeType.IntDeclaration, token.getText())
        token = tokens.peek()
        if (token !== null && token.getType() === TokenType.Assignment) {
          tokens.read()
          const child = this.additive(tokens)
          if (child !== null) {
            node.addChild(child)
          } else {
            throw Error(
              'invalid variable initialization, expecting an expression',
            )
          }
        }
      } else {
        throw Error('variable name expected')
      }

      if (node !== null) {
        token = tokens.peek()
        if (token !== null && token.getType() === TokenType.SemiColon) {
          tokens.read()
        } else {
          throw Error('invalid statement, expecting semicolon')
        }
      }
    }

    return node
  }

  expressionStatement(tokens: TokenReader) {
    const pos = tokens.getPosition()
    let node = this.additive(tokens)

    if (node !== null) {
      const token = tokens.peek()

      if (token !== null && token.getType() === TokenType.SemiColon) {
        tokens.read()
      } else {
        node = null
        tokens.setPosition(pos)
      }
    }

    return node
  }

  assignmentStatement(tokens: TokenReader) {
    let node: SimpleASTNode | null = null
    let token = tokens.peek()

    if (token !== null && token.getType() === TokenType.Identifier) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      token = tokens.read()!
      node = new SimpleASTNode(ASTNodeType.AssignmentStmt, token.getText())
      token = tokens.peek()
      if (token !== null && token.getType() === TokenType.Assignment) {
        tokens.read()
        const child = this.additive(tokens)
        if (child !== null) {
          node.addChild(child)
          token = tokens.peek()
          if (token !== null && token.getType() === TokenType.SemiColon) {
            tokens.read()
          } else {
            throw Error('invalid statement, expecting semicolon')
          }
        } else {
          throw Error('invalid assignment statement, expecting an expression')
        }
      } else {
        tokens.unread()
        node = null
      }
    }

    return node
  }

  additive(tokens: TokenReader) {
    let child1 = this.multiplicative(tokens)
    let node = child1

    if (child1 !== null) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        let token = tokens.peek()
        if (
          token !== null &&
          (token.getType() === TokenType.Plus ||
            token.getType() === TokenType.Minus)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          token = tokens.read()!
          const child2 = this.multiplicative(tokens)
          if (child2 !== null) {
            node = new SimpleASTNode(ASTNodeType.Additive, token.getText())
            node.addChild(child1)
            node.addChild(child2)
            child1 = node
          } else {
            throw Error(
              'invalid additive expression, expecting the right part.',
            )
          }
        } else break
      }
    }

    return node
  }

  multiplicative(tokens: TokenReader) {
    let child1 = this.primary(tokens)
    let node = child1

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let token = tokens.peek()
      if (
        token !== null &&
        (token.getType() === TokenType.Star ||
          token.getType() === TokenType.Slash)
      ) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token = tokens.read()!
        const child2 = this.primary(tokens)
        if (child2 !== null) {
          node = new SimpleASTNode(ASTNodeType.Multiplicative, token.getText())
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          node.addChild(child1!)
          node.addChild(child2)
          child1 = node
        } else {
          throw Error(
            'invalid multiplicative expression, expecting the right part.',
          )
        }
      } else break
    }

    return node
  }

  primary(tokens: TokenReader): SimpleASTNode | null {
    let node: SimpleASTNode | null = null
    let token = tokens.peek()

    if (token !== null) {
      if (token.getType() === TokenType.IntLiteral) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token = tokens.read()!
        node = new SimpleASTNode(ASTNodeType.IntLiteral, token.getText())
      } else if (token.getType() === TokenType.Identifier) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        token = tokens.read()!
        node = new SimpleASTNode(ASTNodeType.Identifier, token.getText())
      } else if (token.getType() === TokenType.LeftParen) {
        tokens.read()
        node = this.additive(tokens)
        if (node !== null) {
          token = tokens.peek()
          if (token !== null && token.getType() === TokenType.RightParen) {
            tokens.read()
          } else {
            throw Error('expecting right parenthesis')
          }
        } else {
          throw Error('expecting an additive expression inside parenthesis')
        }
      }
    }

    return node
  }

  dumpAST(node: ASTNode, indent: string) {
    console.log(chalk.cyan(`${indent}${node.getType()} ${node.getText()}`))

    for (const child of node.getChildren()) this.dumpAST(child, indent + '\t')
  }
}
