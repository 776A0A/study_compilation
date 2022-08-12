/**
 * program: [ statement ] (";" | EOL)
 * statement: "if" expr block [ "else" block ]
 *          | "white" expr block
 *          | simple
 * simple: expr
 * block: "{" [ statement ] { (";" | EOL) [ statement ] } "}"
 * expr: factor { OP factor }
 * factor: "-" primary | primary
 * primary: "(" expr ")" | NUMBER | IDENTIFIER | STRING
 */
