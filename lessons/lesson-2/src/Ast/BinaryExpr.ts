import AstLeaf from './AstLeaf'
import AstList from './AstList'

export default class BinaryExpr extends AstList {
  get left() {
    return this.child(0)
  }

  get operator() {
    return (this.child(1) as AstLeaf | null)?.token.getText()
  }

  get right() {
    return this.child(2)
  }
}
