import type { SymbolRow } from '../api/types';
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export const LiveTable = ({ rows }: { rows: SymbolRow[] }) => {
  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef[] = [
    { field: 'symbol', headerName: 'Symbol' },
    {
      field: 'price',
      headerName: 'Price',
      valueFormatter: (p) => p.value.toFixed(2)
    },
    {
      field: 'ts',
      headerName: 'Time',
      valueFormatter: (p) => new Date(p.value).toLocaleTimeString()
    }
  ];

  return (
    <div style={{ height: '80vh' }}>
      <AgGridReact rowData={rows} columnDefs={colDefs} domLayout='autoHeight' />
    </div>
  );
};
