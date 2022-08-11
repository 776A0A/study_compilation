export default abstract class AstTree {
  children: AstTree[] = []

  abstract child(i: number): AstTree | null
  abstract numChildren(): number
  abstract location(): string | null

  [Symbol.iterator]() {
    return this.children
  }
}
