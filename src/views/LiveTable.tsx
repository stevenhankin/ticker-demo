import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GridOptions,
  type GridReadyEvent,
  type RowClickedEvent
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { SymbolRow } from '../api/types';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  rows: SymbolRow[];
  symbol: string;
  handleSelectedSymbol: (symbol: string) => void;
};

/**
 * AGGrid table for live symbol data
 *
 * See [AgGrid React](https://www.ag-grid.com/react-data-grid/getting-started/)
 */
export const LiveTable = ({ rows, symbol, handleSelectedSymbol }: Props) => {
  /**
   * Fit the grid columns to the available width
   */
  const handleGridReady = (params: GridReadyEvent<SymbolRow>) => {
    params.api.sizeColumnsToFit();
  };

  /**
   * When a row is clicked, notify parent of the selected symbol (i.e. lifting state up)
   */
  const handleClickedRow = (event: RowClickedEvent<SymbolRow>) => {
    handleSelectedSymbol(event.data!.symbol);
  };

  /**
   * Highlight the selected symbol's row
   */
  const handleGridRowStyle: GridOptions['getRowStyle'] = (params) => {
    if (params.data.symbol === symbol) {
      return { fontWeight: 'bold', backgroundColor: '#d1e7dd' };
    }
  };

  return (
    <div style={{ height: 'auto', width: '100%' }} className='ag-theme-alpine'>
      <AgGridReact<SymbolRow>
        getRowId={(data) => data.data.symbol}
        rowData={rows}
        columnDefs={colDefs}
        domLayout='autoHeight'
        theme={themeQuartz}
        onGridReady={handleGridReady}
        animateRows={true}
        onRowClicked={handleClickedRow}
        getRowStyle={handleGridRowStyle}
      />
    </div>
  );
};

/**
 * Define layout of table (column names and sequence) and number and date formatting
 */
const colDefs: ColDef<SymbolRow>[] = [
  { field: 'symbol', headerName: 'Symbol' },
  {
    field: 'price',
    headerName: 'Price',
    valueFormatter: (p) => p.value.toFixed(2),
    enableCellChangeFlash: true
  },
  {
    field: 'ts',
    headerName: 'Time',
    valueFormatter: (p) => new Date(p.value).toLocaleTimeString()
  }
];
