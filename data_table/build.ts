export interface Row {
  [labe: string]: number
}
export type RowBasedTable = Row[];
export const buildRows = (nRows: number, labels: string[]): RowBasedTable => {
  const result: RowBasedTable = [];
  for (let iR = 0; iR < nRows; iR += 1) {
    const row = {};
    labels.forEach(label => {
      row[label] = iR;
    });
    result.push(row);
  }
  return result;
}

export interface ColBasedTable {
  [label: string]: number[]
}

export const buildCols = (nRows: number, labels: string[]): ColBasedTable => {
  const result: ColBasedTable = {};
  labels.forEach(label => {
    result[label] = [];
    for (let iR = 0; iR < nRows; iR += 1) {
      result[label].push(iR);
    }
  });
  return result;
}
