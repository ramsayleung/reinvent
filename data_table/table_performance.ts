import assert from "assert";
import { ColBasedTable, Row, RowBasedTable, buildCols, buildRows } from "./build";
import sizeof from "object-sizeof";

const rowFilter = (table: RowBasedTable, func: (row: Row) => boolean): RowBasedTable => {
  return table.filter(row => func(row));
}

const rowSelect = (table: RowBasedTable, toKeep: string[]) => {
  return table.map(row => {
    const newRow = {};
    toKeep.forEach(label => {
      newRow[label] = row[label]
    })
  })
}

const colFilter = (table: ColBasedTable, func: (table: ColBasedTable, index: number) => boolean): ColBasedTable => {
  const result: ColBasedTable = {};
  const labels = Object.keys(table);
  labels.forEach(label => {
    result[label] = [];
  });
  let rowLength = 0;
  const colNames = Object.keys(table);
  if (colNames.length > 0) {
    const firstKey = colNames[0];
    rowLength = firstKey.length;
  }

  for (let iR = 0; iR < rowLength; iR += 1) {
    if (func(table, iR)) {
      labels.forEach(label => {
        result[label].push(table[label][iR]);
      })
    }
  }
  return result;
}

const colSelect = (table: ColBasedTable, toKeep: string[]): ColBasedTable => {
  const result = {};
  toKeep.forEach(label => {
    result[label] = table[label];
  });
  return result;
}


const RANGE = 3;
const main = () => {
  const nRows = parseInt(process.argv[2]);
  const nCols = parseInt(process.argv[3]);
  const filterPerSelect = parseFloat(process.argv[4]);

  const labels = [...Array(nCols).keys()].map(i => `label_${i + 1}`);
  const someLabels = labels.slice(0, Math.floor(labels.length / 2));
  assert(someLabels.length > 0, 'Must have some labels for select (array too short)');

  const [rowTable, rowSize, rowHeap] = memory(buildRows, nRows, labels);
  const [colTable, colSize, colHeap] = memory(buildCols, nRows, labels);
  const rowFilterTime = time(rowFilter, rowTable, row => ((row.label_1 % RANGE) === 0));
  const rowSelectTime = time(rowSelect, rowTable, someLabels);
  const colFilterTime = time(colFilter, colTable, (table, iR) => ((table.label_1[iR] % RANGE) === 0));
  const colSelectTime = time(colSelect, colTable, someLabels);

  const ratio = calculateRatio(filterPerSelect, rowFilterTime, rowSelectTime, colFilterTime, colSelectTime);

  const result = {
    nRows,
    nCols,
    filterPerSelect,
    rowSize,
    rowHeap,
    colSize,
    colHeap,
    rowFilterTime,
    rowSelectTime,
    colFilterTime,
    colSelectTime,
    ratio
  };
  console.log(JSON.stringify(result));
}

type MemoryResult<T> = [T, number, number];
const memory = <T>(func: (...args: any[]) => T, ...params: any[]): MemoryResult<T> => {
  const before = process.memoryUsage();
  const result = func(...params)
  const after = process.memoryUsage();
  const heap = after.heapUsed - before.heapUsed;
  const size = sizeof(result);
  return [result, size, heap];
}

const time = <T>(func: (...args: any[]) => T, ...params: any[]): number => {
  const before = process.hrtime.bigint();
  func(...params);
  const after = process.hrtime.bigint();
  return Number((after - before) / BigInt(1000));
}

// Ratio is a performance comparison metric between row-based and
// column-based table operations.
// > 1: Row-based operations are slower than column-based
// = 1: Row and column-based operations are equally fast
// < 1: Row-based operations are faster than column-based
const calculateRatio = (f2S: number, rFilterT: number, rSelectT: number, cFilterT: number, cSelectT: number) => {
  return ((f2S * rFilterT) + rSelectT) / ((f2S * cFilterT) + cSelectT);
}

main()

/**
 This is just a simple benchmark between row-based table and col-based
 table to figure out what's the most efficient way to save a table.

 Example:
 npx tsx table_performance.ts 10000 30 10
 10000: the first parameter means the number rows we will test against
 the table
 30: table second parameter means the number of cols we will test 
 10: means `filterPerSelect` parameter represents the ratio of filtering operations to selecting operations in the workload being measured.  
 */
