import assert from "assert";
import { Token, TokenKind, tokenize } from "./tokenizer";
export const parse = (text: string) => {
  const result: Token[] = [];
  const allTokens = tokenize(text);
  for (let i = 0; i < allTokens.length; i += 1) {
    const token = allTokens[i];
    const isLast = i === allTokens.length - 1;
    handle(result, token, isLast);
  }
  return compress(result);
}

const handle = (result: Token[], token: Token, isLast: boolean) => {
  if (token.kind === TokenKind.Lit) {
    result.push(token);
  } else if (token.kind === TokenKind.Start) {
    assert(result.length === 0, 'Should not have start token after other tokens');
    result.push(token);
  } else if (token.kind === TokenKind.End) {
    assert(isLast, `Should not have end token before other tokens`);
    result.push(token);
  } else if (token.kind === TokenKind.GroupStart) {
    result.push(token);
  } else if (token.kind === TokenKind.GroupEnd) {
    result.push(groupEnd(result, token));
  } else if (token.kind === TokenKind.Any) {
    assert(result.length > 0, `No Operand for '*' (location ${token.location})`);
    token.child = result.pop();
    result.push(token)
  } else if (token.kind === TokenKind.Alt) {
    assert(result.length > 0, `No Operand for '|' (location ${token.location})`);
    token.left = result.pop();
    token.right = null;
    result.push(token)
  } else {
    assert(false, `UNIMPLEMENTED`);
  }
}

const groupEnd = (result: Token[], token: Token): Token => {
  const group: Token = {
    kind: TokenKind.Group,
    location: null,
    end: token.location,
    children: []
  };

  while (true) {
    assert(result.length > 0, `Unmatched end parenthesis (location ${token.location})`);
    const child = result.pop();
    if (child.kind === TokenKind.GroupStart) {
      group.location = child.location;
      break;
    }
    group.children.unshift(child);
  }
  return group;
}

// go through the output list to fill in the right side of Alts:
const compress = (raw: Token[]) => {
  const cooked: Token[] = [];
  while (raw.length > 0) {
    const token = raw.pop();
    if (token.kind === TokenKind.Alt) {
      assert(cooked.length > 0, `No right operand for alt (location ${token.location})`);
      token.right = cooked.shift();
    }
    cooked.unshift(token);
  }
  return cooked;
}
