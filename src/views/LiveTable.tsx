import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { SymbolRow } from '../api/types';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * AGGrid table for live symbol data
 *
 * See [AgGrid React](https://www.ag-grid.com/react-data-grid/getting-started/)
 */
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
    <div style={{ height: 'auto' }}>
      <AgGridReact
        rowData={rows}
        columnDefs={colDefs}
        domLayout='autoHeight'
        theme={themeQuartz}
      />
    </div>
  );
};
