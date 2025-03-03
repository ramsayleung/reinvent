import { HashToPathMap, findNew } from "./check-existing-files";
import { hashExisting } from "./hash-existing-promise";
import fs from 'fs-extra-promise';
import os from 'os';
import { ManifestFileFormat, getLatestManifestFileSequence } from "./manifest";

// Define the command-line interface
export interface BackupCliOptions {
  src: string;
  dst: string;
  timestamp?: number;
  format?: ManifestFileFormat;
  verbose?: boolean;
  help?: boolean;
  version?: boolean;
}

export interface BackupOptions {
  format?: ManifestFileFormat;
  verbose?: boolean;
}


const defaultOptions: BackupOptions = {
  format: ManifestFileFormat.CSV,
  verbose: false
};

export const backup = async (src: string, dst: string, sequence: number | null = null, options: BackupOptions = defaultOptions) => {
  if (sequence === null) {
    sequence = await getLatestManifestFileSequence(dst, options.format ?? ManifestFileFormat.CSV)
    sequence += 1;
  }
  const manifestFilename = String(sequence).padStart(10, '0');
  const existing = await hashExisting(src);
  const needToCopy = await findNew(dst, existing);
  await copyFiles(dst, needToCopy);
  if (options.verbose) {
    console.log(`[INFO] Copied ${Object.keys(needToCopy).length} files from ${src} to ${dst}`);
  }
  if (options.format === ManifestFileFormat.CSV) {
    await saveManifest(dst, manifestFilename, existing);
  } else if (options.format === ManifestFileFormat.JSON) {
    await saveManifestAsJSON(dst, manifestFilename, existing);
  }
}

const copyFiles = async (dst: string, needToCopy: HashToPathMap): Promise<void[]> => {
  const promises = Object.keys(needToCopy).map(hash => {
    const srcPath = needToCopy[hash];
    const dstPath = `${dst}/${hash}.bck`;
    return fs.copyAsync(srcPath, dstPath);
  });
  return Promise.all(promises);
}

const saveManifest = async (dst: string, manifestFilename: string, pathHash: string[][]) => {
  pathHash = pathHash.sort()
  const content = pathHash.map(
    ([path, hash]) => `${path},${hash}`
  ).join('\n');
  const manifest = `${dst}/${manifestFilename}.csv`
  fs.writeFileAsync(manifest, content, 'utf-8');
}

const saveManifestAsJSON = async (dst: string, manifestFilename: string, pathHash: string[][]) => {
  const username = getUsername();
  pathHash = pathHash.sort();
  const content = {
    username: username,
    ...pathHash
  }
  const manifest = `${dst}/${manifestFilename}.json`;
  fs.writeFileAsync(manifest, JSON.stringify(content), 'utf-8');
}

const getUsername = () => {
  return os.userInfo().username
}
