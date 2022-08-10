export default class AstNode {
  type: symbol
  text: string
  parent: AstNode | null = null
  children: AstNode[] = []

  constructor(type: symbol, text: string) {
    this.type = type
    this.text = text
  }

  addChild(child: AstNode) {
    this.children.push(child)
    child.parent = this
  }
}
