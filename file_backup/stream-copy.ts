/*
Streaming I/O

Write a small program using fs.createReadStream and
fs.createWriteStream that copies a file piece-by-piece
instead of reading it into memory and then writing it out again.
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const streamCopyFile = (source: string, destination: string) => {
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(destination);

  readStream.on('error', (err) => {
    console.error(`Error reading file: ${err.message}`);
  });

  writeStream.on('error', (err) => {
    console.error(`Error writing file: ${err.message}`);
  });

  writeStream.on('finish', () => {
    console.log(`File copied from ${source} to ${destination}`);
  });

  readStream.pipe(writeStream);
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const source = path.join(__dirname, 'stream-copy.ts');
const destination = path.join(__dirname, 'test', 'stream-copy.ts.bck');
streamCopyFile(source, destination);
