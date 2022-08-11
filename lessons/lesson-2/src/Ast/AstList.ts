import AstTree from './AstTree'

export default class AstList extends AstTree {
  constructor(children: AstTree[]) {
    super()
    this.children = children
  }

  numChildren(): number {
    return this.children.length
  }

  child(i: number): AstTree | null {
    return this.children[i] ?? null
  }

  override toString() {
    let str = ''

    for (const child of this.children) {
      str += child.toString()
    }

    return `(${str})`
  }

  location(): string | null {
    for (const child of this.children) {
      const s = child.location()
      if (s) return s
    }

    return null
  }
}
