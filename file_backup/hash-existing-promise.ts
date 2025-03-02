import fs from 'fs-extra-promise'
import { glob } from 'glob'
import crypto from 'crypto'

type PathStatPair = [string, fs.Stats]
type PathContentPair = [string, string]
type PathHashPair = [string, string]

const statPath = (path: string): Promise<PathStatPair> => {
  return new Promise((resolve, reject) => {
    fs.statAsync(path)
      .then((stat: fs.Stats) => resolve([path, stat]))
      .catch((err: Error) => reject(err))
  })
}

const readPath = (path: string): Promise<PathContentPair> => {
  return new Promise((resolve, reject) => {
    fs.readFileAsync(path, 'utf-8')
      .then((content: string) => resolve([path, content]))
      .catch((error: Error) => reject(error))
  })
}

const hashPath = (path: string, content: string): PathHashPair => {
  const hasher = crypto.createHash('sha1').setEncoding('hex');
  hasher.write(content);
  hasher.end()
  return [path, hasher.read()]
}

export const hashExisting = (rootDir: string): Promise<PathHashPair[]> => {
  const pattern = `${rootDir}/**/*`;
  return new Promise((resolve, reject) => {
    glob(pattern)
      .then(matches => Promise.all(
        matches.map(path => statPath(path))
      ))
      .then((pairs: PathStatPair[]) => pairs.filter(
        ([path, stat]) => stat.isFile()))
      .then((pairs: PathStatPair[]) => Promise.all(
        pairs.map(([path, stat]) => readPath(path))))
      .then((pairs: PathContentPair[]) => Promise.all(
        pairs.map(([path, content]) => hashPath(path, content))
      ))
      .then((pairs: PathHashPair[]) => resolve(pairs))
      .catch(err => reject(err))
  })
}
