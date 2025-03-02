import { afterEach, beforeEach, describe } from "node:test";
import mock from 'mock-fs';

describe('checks for pre-existing hashes using mock filesystem', () => {
  beforeEach(() => {
    mock({
      'bck-0-csv-0': {},
      'bck-1-csv-1': {
        '0001.csv': 'alpha.js,abcd1234',
        'abcd1234.bck': 'alpha.js content'
      },
      'bck-4-csv-2': {
        '0001.csv': ['alpha.js,abcd1234', 'beta.txt,bcde2345'].join('\n'),
        '3024.csv': ['alpha.js,abcd1234', 'gamma.png,3456cdef', 'subdir/renamed.txt,bcde2345'].join('\n'),
        '3456cdef.bck': 'gamma.png content',
        'abcd1234.bck': 'alpha content',
        'bcde2345.bck': 'beta.txt became subdir/renamed.txt'
      }
    })
  })

  afterEach(() => {
    mock.restore()
  })
})
