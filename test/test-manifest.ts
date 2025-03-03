import assert from 'assert';
import { it, afterEach, beforeEach, describe } from 'node:test';
import mock from 'mock-fs';
import { ManifestFileFormat, getLatestManifestFileSequence } from '../file_backup/manifest';

const Fixture = {
  backup: {
    '1740961867.csv': 'test content',
    '1740961890.csv': 'Apple content'
  }
}

describe('check entire backup process', () => {
  beforeEach(() => {
    mock(Fixture)
  })

  afterEach(() => {
    mock.restore()
  })

  it('Get latest sequence', async () => {
    const latestManifestFileSequence = await getLatestManifestFileSequence('backup', ManifestFileFormat.CSV);
    const expected = 1740961890;
    assert.strictEqual(latestManifestFileSequence, expected);
  })

  it('Empty destination file without manifest file', async () => {
    const latestManifestFileSequence = await getLatestManifestFileSequence('unknown_path', ManifestFileFormat.CSV);
    const expected = -1;
    assert.strictEqual(latestManifestFileSequence, expected);
  })
})
