import { themeQuartz, ModuleRegistry, ClientSideRowModelModule, RowAutoHeightModule, CellStyleModule } from 'ag-grid-community'

initAgGrid()
export function initAgGrid() {
  ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    RowAutoHeightModule,
    CellStyleModule,
  ])
}

const tableTheme = themeQuartz
  .withParams(
    {
      headerBackgroundColor: '#fff',
    },
    'light',
  )
  .withParams(
    {
      headerBackgroundColor: '#1b1c22',
      backgroundColor: '#1b1c22',
    },
    'dark',
  )

export default tableTheme
