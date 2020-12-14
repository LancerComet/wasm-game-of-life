/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Cell {
  Dead,
  Alive,
}
/**
*/
export class Universe {
  free(): void;
/**
* @returns {number}
*/
  width(): number;
/**
* @returns {number}
*/
  height(): number;
/**
* @returns {number}
*/
  get_cells_ptr(): number;
/**
*/
  tick(): void;
/**
* @returns {string}
*/
  render(): string;
/**
* @param {number} width
*/
  set_width(width: number): void;
/**
* @param {number} height
*/
  set_height(height: number): void;
/**
* @param {number} row
* @param {number} column
*/
  toggle_cell(row: number, column: number): void;
/**
* @param {number} width
* @param {number} height
* @returns {Universe}
*/
  static new(width: number, height: number): Universe;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_universe_free: (a: number) => void;
  readonly universe_width: (a: number) => number;
  readonly universe_height: (a: number) => number;
  readonly universe_get_cells_ptr: (a: number) => number;
  readonly universe_tick: (a: number) => void;
  readonly universe_render: (a: number, b: number) => void;
  readonly universe_set_width: (a: number, b: number) => void;
  readonly universe_set_height: (a: number, b: number) => void;
  readonly universe_toggle_cell: (a: number, b: number, c: number) => void;
  readonly universe_new: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
        