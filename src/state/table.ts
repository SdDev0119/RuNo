import { atomWithStore } from "jotai-zustand";
import { createStore } from "zustand/vanilla";
import { TABLE_SIZE } from "../components/utils/consts";

export type TableSize = typeof TABLE_SIZE[keyof typeof TABLE_SIZE];

interface TableData {
  id: string;
  name: string;
  sqlFormula?: string;
  tableSize?: TableSize;
}

interface SelectedTable {
  id: string;
  excelRef: string;
}

export const tableStore = createStore<TableData[]>(() => []);
export const selectedTableStore = createStore<SelectedTable>(() => ({
  id: "",
  excelRef: "",
}));

export const tableAtom = atomWithStore(tableStore);
export const selectedTableAtom = atomWithStore(selectedTableStore);