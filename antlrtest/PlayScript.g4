/*
 用Antlr的语法重新实现了02~05讲的语法规则。 Antlr可以支持左递归的语法规则，参见additiveExpression和multiplicativeExpression规则。
 */
grammar PlayScript;

import CommonLexer; //导入词法定义

@header {
package antlrtest;
}

literal:
	IntegerLiteral
	| FloatingPointLiteral
	| BooleanLiteral
	| CharacterLiteral
	| StringLiteral
	| NullLiteral;

primitiveType: 'Number' | 'String' | 'var';

statement: expressionStatement | compoundStatement;
//| selectionStatement | iterationStatement;
expressionStatement: expression? ';';

declaration:
	primitiveType Identifier
	| primitiveType Identifier initializer;

initializer: assignmentOperator assignmentExpression;
//| LeftBrace initializerList RightBrace | LeftBrace initializerList Comm RightBrace;
expression:
	assignmentExpression
	| expression ',' assignmentExpression;

assignmentExpression:
	additiveExpression
	| Identifier assignmentOperator additiveExpression;

assignmentOperator:
	'='
	| '*='
	| '/='
	| '%='
	| '+='
	| '-='
	| '<<='
	| '>>='
	| '>>>='
	| '&='
	| '^='
	| '|=';

//加法表达式，Antlr能够支持左递归
additiveExpression:
	multiplicativeExpression
	| additiveExpression '+' multiplicativeExpression
	| additiveExpression '-' multiplicativeExpression;

//乘法表达式，Antlr能够支持左递归
multiplicativeExpression:
	primaryExpression
	| multiplicativeExpression '*' primaryExpression
	| multiplicativeExpression '/' primaryExpression
	| multiplicativeExpression '%' primaryExpression;

primaryExpression:
	Identifier
	| literal
	| Identifier '(' argumentExpressionList? ')'
	| '(' expression ')';

argumentExpressionList:
	assignmentExpression
	| argumentExpressionList ',' assignmentExpression;

compoundStatement: '{' blockItemList? '}';

blockItemList: blockItem | blockItemList blockItem;

blockItem: statement | declaration;