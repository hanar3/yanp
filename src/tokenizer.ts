type Token = {
    type: string;
    value: string;
}
/*
 * Tokenizer Spec
 * */
const Spec: [RegExp, string | null][] = [
    // Whitespaces

    [/^\s+/, null],
    // Numbers:
    [/^\d+/, 'NUMBER'],

    // Strings:
    [/^"[^"]*"/, 'STRING'],
    [/^'[^']*'/, 'STRING'],

    // Comments:
    [/^\/\/.*/, null], // Single line
    [/^\/\*[\s\S]*?\*\//, null], // Multi-line

    // Symbols, delimiters
    [/^;/, ';'],
    [/^\{/, '{'],
    [/^\}/, '}'],
];
/**
* Tokenizer
*
* Lazily pulls a token from a stream
*/
export class Tokenizer {
    _string: string = '';
    _cursor: number = 0;

    init(str: string) {
        this._string = str;
        this._cursor = 0;
    }

    /*
     * Whether the tokenizer reached EOF
     * */
    isEOF() {
        return this._cursor == this._string.length;
    }

    /*
     * Whether we still have more tokens
     * */
    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    // Obtain the next token
    getNextToken(): Token | null {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const [regex, type] of Spec) {
            let tokenValue = this.match(regex, string);
            if (tokenValue == null) {
                continue;
            }

            if (type == null) {
                return this.getNextToken();
            }

            return {
                type,
                value: tokenValue,
            }
        }

        throw new SyntaxError(`Unexpected token: "${string[0]}"`);

    }

    private match(regexp: RegExp, value: string) {
        const matched = regexp.exec(value);
        if (matched === null) {
            return null;
        }
        this._cursor += matched[0].length;
        return matched[0];

    }
}
