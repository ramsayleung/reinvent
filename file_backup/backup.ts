import { HashToPathMap, findNew } from "./check-existing-files";
import { hashExisting } from "./hash-existing-promise";
import fs from 'fs-extra-promise';

export const backup = async (src: string, dst: string, timestamp: number | null = null) => {
  if (timestamp === null) {
    timestamp = Math.round((new Date()).getTime() / 1000);
  }
  const timestampStr = String(timestamp).padStart(10, '0');
  const existing = await hashExisting(src);
  const needToCopy = await findNew(dst, existing);
  await copyFiles(dst, needToCopy);
  await saveManifest(dst, timestampStr, existing);
}

const copyFiles = async (dst: string, needToCopy: HashToPathMap): Promise<void[]> => {
  const promises = Object.keys(needToCopy).map(hash => {
    const srcPath = needToCopy[hash];
    const dstPath = `${dst}/${hash}.bck`;
    return fs.copyAsync(srcPath, dstPath);
  });
  return Promise.all(promises);
}

const saveManifest = async (dst: string, timestamp: string, pathHash: string[][]) => {
  pathHash = pathHash.sort()
  const content = pathHash.map(
    ([path, hash]) => `${path},${hash}`
  ).join('\n');
  const manifest = `${dst}/${timestamp}.csv`
  fs.writeFileAsync(manifest, content, 'utf-8')
}
