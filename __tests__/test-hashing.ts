import assert from 'assert';
import mock from 'mock-fs';
import { hashExisting } from '../file_backup/hash-existing-promise';

const Fixture = {
  backup: {
    '1740961867.csv': '',
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

  it('hashExisting ignore empty file', async () => {
    const pathHashPairs = await hashExisting('backup');
    assert.equal(pathHashPairs.length, 1);
  })
})
