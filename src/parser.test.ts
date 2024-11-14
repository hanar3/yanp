import { test, expect } from 'bun:test';
import { Parser } from './Parser';

test("parses a NumericLiteral", () => {
    const program = '42;';
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                type: "ExpressionStatement",
                expression: {
                    type: "NumericLiteral",
                    value: 42,
                },
            }
        ]
    });
})

test("parses a StringLiteral inside double quotes", () => {
    const program = '"hello";';
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                type: "ExpressionStatement",
                expression: {
                    type: "StringLiteral",
                    value: "hello",
                },
            }
        ]

    });
})

test("parses a StringLiteral inside single quotes", () => {
    const program = "'hello world';";
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                expression: {
                    type: "StringLiteral",
                    value: "hello world",
                },
                type: "ExpressionStatement",
            }
        ]
    });
})

test("ignores whitespaces", () => {
    const program = "   'hello world';   ";
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                expression: {
                    type: "StringLiteral",
                    value: "hello world",
                },
                type: "ExpressionStatement",
            }
        ]

    });
})

test("ignores single-line comments", () => {
    const program = `
        // Number:
        42;
    `;
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                expression: {
                    type: "NumericLiteral",
                    value: 42,
                },
                type: "ExpressionStatement",
            }
        ]
    });
})

test("ignores multi-line comments", () => {
    const program = `
        /** 
         * Documentation comment 
        */
        42;
    `;
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                expression: {
                    type: "NumericLiteral",
                    value: 42,
                },
                type: "ExpressionStatement",
            }
        ]
    });
})


test("parses multiple expressions", () => {
    const program = `
        "hello";
        42;
    `;
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                expression: {
                    type: "StringLiteral",
                    value: "hello",
                },
                type: "ExpressionStatement",
            },
            {
                expression: {
                    type: "NumericLiteral",
                    value: 42,
                },
                type: "ExpressionStatement",
            },

        ]
    });
})


test("parses a block expression", () => {
    const program = `
        {
            42;
            "hello";
        }
    `;
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: [
                    {
                        expression: {
                            type: "NumericLiteral",
                            value: 42,
                        },
                        type: "ExpressionStatement",
                    },
                    {
                        expression: {
                            type: "StringLiteral",
                            value: "hello",
                        },
                        type: "ExpressionStatement",
                    },
                ]
            }

        ]
    });
})

test("parses an empty block", () => {
    const program = `
        {}
    `;
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: []
            }

        ]
    });
})


test("parses a nested block expression", () => {
    const program = `
        {
            42;
            {
                "hello";
            }
        }
    `;
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                type: 'BlockStatement',
                body: [
                    {
                        expression: {
                            type: "NumericLiteral",
                            value: 42,
                        },
                        type: "ExpressionStatement",
                    },
                    {
                        type: "BlockStatement",
                        body: [
                            {
                                type: "ExpressionStatement",
                                expression: {
                                    type: "StringLiteral",
                                    value: "hello",
                                },
                            }
                        ]
                    },
                ]
            }

        ]
    });
})


test("parses an empty statement", () => {
    const program = `;`;
    const parser = new Parser();
    const ast = parser.parse(program);
    expect(ast).toEqual({
        type: 'Program',
        body: [
            {
                type: 'EmptyStatement',
            }

        ]
    });
})
