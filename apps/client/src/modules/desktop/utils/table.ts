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
      headerBackgroundColor: '#18181B',
      backgroundColor: '#18181B',
    },
    'dark',
  )

export default tableTheme
