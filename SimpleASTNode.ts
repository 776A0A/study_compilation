import { ASTNode } from './interfaces/ASTNode'
import { ASTNodeType } from './types/ASTNodeType'

export default class SimpleASTNode implements ASTNode {
  parent: SimpleASTNode | null = null
  children: SimpleASTNode[] = []
  nodeType: ASTNodeType | null = null
  text = ''

  constructor(nodeType: ASTNodeType, text: string) {
    this.nodeType = nodeType
    this.text = text
  }

  getParent() {
    return this.parent
  }

  getChildren() {
    return this.children
  }

  getType() {
    return this.nodeType
  }

  getText() {
    return this.text
  }

  addChild(child: SimpleASTNode) {
    this.children.push(child)
    child.parent = this
  }
}
