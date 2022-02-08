import { ASTNodeType } from './ASTNodeType'

export interface ASTNode {
  getParent(): ASTNode | null

  getChildren(): ASTNode[]

  getType(): ASTNodeType | null

  getText(): string
}
