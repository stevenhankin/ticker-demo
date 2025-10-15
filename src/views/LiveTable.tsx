import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GridReadyEvent,
  type RowClickedEvent
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import type { SymbolRow } from '../api/types';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

type Props = {
  rows: SymbolRow[];
  handleSelectedSymbol: (symbol: SymbolRow['symbol']) => void;
};

/**
 * AGGrid table for live symbol data
 *
 * See [AgGrid React](https://www.ag-grid.com/react-data-grid/getting-started/)
 */
export const LiveTable = ({ rows, handleSelectedSymbol }: Props) => {
  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef<SymbolRow>[] = [
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

  const handleGridReady = (params: GridReadyEvent<SymbolRow>) => {
    params.api.sizeColumnsToFit();
  };

  const handleClickedRow = (event: RowClickedEvent<SymbolRow>) => {
    handleSelectedSymbol(event.data!.symbol);
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
      />
    </div>
  );
};
