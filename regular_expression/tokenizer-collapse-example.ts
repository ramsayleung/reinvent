import { tokenize } from "./tokenizer-collapse";

const test = '^a^b*';
const result = tokenize(test);
console.log(JSON.stringify(result, null, 2));
