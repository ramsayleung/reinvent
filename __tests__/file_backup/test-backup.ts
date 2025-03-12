import crypto from 'crypto'
import fs from 'fs-extra-promise';
import { HashToPathMap } from '../../file_backup/check-existing-files';
import mock from 'mock-fs';
import { backup } from '../../file_backup/backup';
import assert from 'assert';
import { glob } from 'glob';

const hashString = (data: string) => {
  const hasher = crypto.createHash('sha1').setEncoding('hex');
  hasher.write(data);
  hasher.end()
  return hasher.read()
}

const Contents: Record<string, string> = {
  aaa: 'AAA',
  bbb: 'BBB',
  ccc: 'CCC'
}

const Hashes = Object.keys(Contents).reduce((obj: HashToPathMap, key: string) => {
  obj[key] = hashString(Contents[key])
  return obj
}, {} as HashToPathMap)

const Fixture = {
  source: {
    'alpha.txt': Contents.aaa,
    'beta.txt': Contents.bbb,
    gamma: {
      'delta.txt': Contents.ccc
    }
  },
  backup: {}
}

const InitialBackups = Object.keys(Hashes).reduce((set: Set<string>, filename: string) => {
  set.add(`backup/${Hashes[filename]}.bck`)
  return set
}, new Set<string>())

describe('check entire backup process', () => {
  beforeEach(() => {
    mock(Fixture)
  })

  afterEach(() => {
    mock.restore()
  })

  it('creates an initial CSV manifest', async () => {
    await backup('source', 'backup', 0);

    // 3 backup files + 1 manfiest file
    assert.strictEqual((await glob('backup/*')).length, 4, 'Expected 4 files');

    const actualBackups = new Set(await glob('backup/*.bck'));
    assert.deepStrictEqual(actualBackups, InitialBackups, 'Expected 3 backup files');

    const actualManifest = await glob('backup/*.csv');
    assert.deepStrictEqual(actualManifest, ['backup/0000000000.csv'], 'Expected one manifest');
  })

  it('does not duplicate files unnecessarily', async () => {
    await backup('source', 'backup', 0);
    assert.strictEqual((await glob('backup/*')).length, 4, 'Expected 4 files after first backup');

    // generate one more manifest file without duplicating backup file
    await backup('source', 'backup', 1);
    assert.strictEqual((await glob('backup/*')).length, 5, 'Expected 5 files after second backup');
    const actualBackups = new Set(await glob('backup/*.bck'))
    assert.deepStrictEqual(actualBackups, InitialBackups, 'Expected 3 backup files after second backup');

    const actualManifests = (await glob('backup/*.csv')).sort();
    assert.deepStrictEqual(actualManifests, ['backup/0000000000.csv', 'backup/0000000001.csv'], 'Expected two manifests')
  })

  it('add a files as needed', async () => {
    await backup('source', 'backup', 0);
    assert.strictEqual((await glob('backup/*')).length, 4, 'Expected 4 files after first backup');

    await fs.writeFileAsync('source/newFile.txt', 'NNN');
    const hashOfNewFile = hashString('NNN');

    await backup('source', 'backup', 1);
    assert.strictEqual((await glob('backup/*')).length, 6, 'Expected 6 files after second backup');

    const expected = new Set(InitialBackups).add(`backup/${hashOfNewFile}.bck`);
    const actualBackup = new Set(await glob('backup/*.bck'))
    assert.deepStrictEqual(actualBackup, expected, 'Expected 4 backup files after second backup');

    const actualManifests = (await glob('backup/*.csv')).sort()
    assert.deepStrictEqual(actualManifests, ['backup/0000000000.csv', 'backup/0000000001.csv'], 'Expected two manifests');
  })
})
