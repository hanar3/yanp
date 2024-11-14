import { Tokenizer } from './tokenizer';

type NumericLiteral = {
    type: string;
    value: Number;
};

type StringLiteral = {
    type: string;
    value: string;
};


type Literal = StringLiteral | NumericLiteral;

type BlockStatement = {
    type: string;
    body: StatementList
};

type EmptyStatement = {
    type: string;
};

type StatementList = (BlockStatement | ExpressionStatement | EmptyStatement)[];

type ExpressionStatement = {
    type: string,
    expression: Literal,
};


export class Parser {

    private string;
    private tokenizer: Tokenizer;
    private lookahead: any;

    constructor() {
        this.string = '';
        this.tokenizer = new Tokenizer();
    }
    /*
     * Parses a string into an AST
     * */
    parse(str: string) {
        this.string = str;
        this.tokenizer.init(str);

        // Prime the tokenizer by obtaining the first token
        // which is our lookahead. The lookahead is used for predictive parsing
        this.lookahead = this.tokenizer.getNextToken();

        return {
            type: 'Program',
            body: this.StatementList()
        } as const;
    }


    private eat(tokenType: string) {
        const token = this.lookahead;
        if (!token) {
            throw new SyntaxError(`Unexpected end of input, expected: "${tokenType}"`)
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.type}", expected: "${tokenType}"`)
        }

        // Advance to the next token
        this.lookahead = this.tokenizer.getNextToken();
        return token;
    }
    /*
     * Main entry point
     * Program
     *  : StatementList
     *  ;
     * */
    Program() {
        return this.StatementList();
    }


    /*
     * StatementList
     *  : Statement
     *  | StatementList Statement
     * */

    StatementList(stopLookahead: string | null = null): StatementList {
        const statementList = [this.Statement()];

        while (this.lookahead != null && this.lookahead.type !== stopLookahead) {
            statementList.push(this.Statement());
        }
        return statementList;
    }


    /*
     * Statement
     *  : ExpressionStatement
     *  | BlockStatement
     *  | EmptyState
     *  ;
     * */
    Statement(): BlockStatement | ExpressionStatement | EmptyStatement {
        switch (this.lookahead.type) {
            case ';':
                return this.EmptyStatement();
            case '{':
                return this.BlockStatement();
            default:
                return this.ExpressionStatement();
        }
    }

    /*
     * BlockStatement
     *  : ';'
     *  ;
     * */
    EmptyStatement(): EmptyStatement {
        this.eat(";");
        return {
            type: 'EmptyStatement'
        }
    }

    /*
     * BlockStatement
     *  : '{' OptStatementList '}'
     *  ;
     * */
    BlockStatement(): BlockStatement {
        this.eat("{");
        const body = this.lookahead.type !== '}' ? this.StatementList('}') : [];
        this.eat("}");

        return {
            type: 'BlockStatement',
            body,
        };
    }



    /*
     * Statement
     *  : Expression ';'
     *  ;
     * */
    ExpressionStatement() {
        const expression = this.Expression();
        this.eat(";");
        return {
            type: 'ExpressionStatement',
            expression,
        }
    }

    /*
     * Statement
     *  : Literal
     *  ;
     * */
    Expression() {
        return this.Literal();
    }

    /*
     * Literal
     *  : NumericLiteral
     *  | StringLiteral
     * */

    Literal() {
        switch (this.lookahead.type) {
            case 'NUMBER':
                return this.NumericLiteral();
            case 'STRING':
                return this.StringLiteral();
            default: throw new SyntaxError(`Literal: unexpected literal production`);
        }
    }



    /*
     * StringLiteral
     *  : STRING
     *  ;
     * */

    StringLiteral(): StringLiteral {
        const token = this.eat('STRING');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1)
        }
    }
    /*
     * NumericLiteral
     *  :NUMBER
     *  ;
     * */

    NumericLiteral(): NumericLiteral {
        const token = this.eat('NUMBER');
        return {
            type: 'NumericLiteral',
            value: Number(token.value)
        }
    }
}
