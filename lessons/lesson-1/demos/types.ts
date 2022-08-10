import { symbolify } from './utils'

export const DfaStates = symbolify(
  'Initial',
  'Id_int1',
  'Id_int2',
  'Id_int3',
  'IntLiteral',
  'Identifier',
  'Assignment',
  'SemiColon',
  'Plus',
  'Minus',
  'Star',
  'Slash',
  'LeftParen',
  'RightParen',
)

export const TokenType = symbolify(
  'Int',
  'Identifier',
  'Assignment',
  'IntLiteral',
  'SemiColon',
  'Plus',
  'Minus',
  'Star',
  'Slash',
  'LeftParen',
  'RightParen',
)

export const AstType = symbolify(
  'Program',
  'IntDeclaration',
  'ExpStmt',
  'AssignmentStmt',
  'Identifier',
  'IntLiteral',
  'Additive',
  'Multiplicative',
)
