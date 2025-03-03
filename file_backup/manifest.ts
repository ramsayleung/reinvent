import { glob } from "glob";
import path from "path";
export enum ManifestFileFormat {
  CSV,
  JSON
}

export const getLatestManifestFileSequence = async (dst: string, format: ManifestFileFormat): Promise<number> => {
  const extension = format === ManifestFileFormat.JSON ? 'json' : 'csv';
  const existingManifest = await glob(`${dst}/*.${extension}`);
  if (existingManifest.length === 0) {
    return -1;
  }

  let latestFileName = existingManifest[0];
  for (const manifest of existingManifest) {
    if (latestFileName < manifest) {
      latestFileName = manifest
    }
  }
  return parseInt(path.basename(latestFileName).replace(`\\.${extension}`, ''));
}
