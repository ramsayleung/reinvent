import assert from "assert";
import Alt from './regex-alt';
import Any from './regex-any';
import End from './regex-end';
import Lit from './regex-lit';
import Start from './regex-start';
import Plus from './regex-plus';
import Opt from './regex-opt';
import Group from './regex-group';
import CharClass from './regex-charclass';

import { Token, TokenKind, tokenize } from "./tokenizer";
import { RegexBase } from "./regex-base";
export const parse = (text: string): Token[] => {
  const result: Token[] = [];
  const allTokens = tokenize(text);
  for (let i = 0; i < allTokens.length; i += 1) {
    const token = allTokens[i];
    const isLast = i === allTokens.length - 1;
    handle(result, token, isLast);
  }
  return compress(result);
}

export const compile = (text: string): RegexBase => {
  const tokens: Token[] = parse(text);
  return createObjectByAST(tokens);
}

// return instances of classes derived from RegexBase by abstract syntax tree
const createObjectByAST = (tokens: Token[]): RegexBase | null => {
  if (tokens.length === 0) {
    return null;
  }
  const token = tokens.shift();
  if (token.kind === TokenKind.Lit) {
    return Lit(token.value, createObjectByAST(tokens));
  } else if (token.kind === TokenKind.Start) {
    return Start(createObjectByAST(tokens));
  } else if (token.kind === TokenKind.End) {
    assert(tokens.length === 0, `Should not have end token before other tokens`)
    return End();
  } else if (token.kind === TokenKind.Alt) {
    return Alt(createObjectByAST([token.left]), createObjectByAST([token.right]), createObjectByAST(tokens));
  } else if (token.kind === TokenKind.Group) {
    return Group(token.children.map((childToken) => createObjectByAST([childToken])), createObjectByAST(tokens));
  } else if (token.kind === TokenKind.Any) {
    return Any(createObjectByAST([token.child]), createObjectByAST(tokens));
  } else if (token.kind === TokenKind.Opt) {
    return Opt(createObjectByAST([token.child]), createObjectByAST(tokens));
  } else if (token.kind === TokenKind.Plus) {
    return Plus(createObjectByAST([token.child]), createObjectByAST(tokens));
  } else if (token.kind === TokenKind.CharClass) {
    return CharClass(token.children.map((childToken) => createObjectByAST([childToken])), createObjectByAST(tokens));
  } else {
    assert(false, `UNKNOWN token type ${token.kind}`);
  }
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
  } else if (token.kind === TokenKind.CharClassStart) {
    result.push(token);
  } else if (token.kind === TokenKind.CharClassEnd) {
    result.push(charClassEnd(result, token));
  } else if (token.kind === TokenKind.Any) {
    assert(result.length > 0, `No Operand for '*' (location ${token.location})`);
    token.child = result.pop();
    result.push(token)
  } else if (token.kind === TokenKind.Plus) {
    assert(result.length > 0, `No Operand for '+' (location ${token.location})`);
    token.child = result.pop();
    result.push(token)
  } else if (token.kind === TokenKind.Opt) {
    assert(result.length > 0, `No Operand for '?' (location ${token.location})`);
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
  // Apply compress to handle Alt tokens within the group
  group.children = compress(group.children);

  return group;
}

const charClassEnd = (result: Token[], token: Token): Token => {
  const charClass: Token = {
    kind: TokenKind.CharClass,
    location: null,
    end: token.location,
    children: []
  }

  while (true) {
    assert(result.length > 0, `Unmatched end parenthesis (location ${token.location})`);
    const child = result.pop();
    if (child.kind === TokenKind.CharClassStart) {
      charClass.location = child.location;
      break;
    }
    charClass.children.unshift(child);
  }
  // Apply compress to handle Alt tokens within the charclass
  charClass.children = compress(charClass.children);
  return charClass;
}

// go through the output list to fill in the right side of Alts:
const compress = (raw: Token[]): Token[] => {
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
