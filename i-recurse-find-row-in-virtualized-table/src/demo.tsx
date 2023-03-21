import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import data from './table.json'

export default function PageSizeCustomOptions() {
  const [pageSize, setPageSize] = React.useState<number>(100)

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        pagination
        {...data}
      />
    </div>
  )
}
