// @flow

const isNullOrUndefined = (value: any): boolean => value == null;
const first = (array: Array<any>): any => array[0];
const last = (array: Array<any>): any => array[array.length - 1];

export { isNullOrUndefined, first, last };
