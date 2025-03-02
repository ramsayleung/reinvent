import { glob } from "glob";
import path from "path";

interface HashToPathMap {
  [hash: string]: string;
}

export const findNew = async (rootDir: string, pathHashPairs: string[][]): Promise<HashToPathMap> => {
  const hashToPath = pathHashPairs.reduce((obj, [path, hash]) => {
    obj[hash] = path;
    return obj
  }, {} as HashToPathMap);

  const pattern = `${rootDir}/*.bck`;
  const options = {};
  const existingFiles = await glob(pattern, options);
  console.log(`existingFiles: ${existingFiles}`);

  existingFiles.forEach(filename => {
    const stripped = path.basename(filename).replace(/\.bck$/, '');
    console.log(`stripped: ${stripped}`);
    delete hashToPath[stripped]
  });

  return hashToPath;
}

