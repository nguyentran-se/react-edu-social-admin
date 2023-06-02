import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import GroupAddOutlined from '@mui/icons-material/GroupAddOutlined';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Box, IconButton } from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';
import MaterialReactTable, { MRT_Row, MaterialReactTableProps } from 'material-react-table';
interface TableProps {
  columns: MRT_ColumnDef<any>[];
  onEditEntity?: (row: MRT_Row<any>) => void;
  onDeleteEntity?: (row: MRT_Row<any>) => void;
  onAddUserToEntity?: (row: MRT_Row<any>) => void;
  onSetAdmin?: (row: MRT_Row<any>) => void;
  data: any[];
  state: MaterialReactTableProps['state'];
  getRowId: MaterialReactTableProps['getRowId'];
  initialState?: MaterialReactTableProps['initialState'];
}
function Table({
  columns,
  onEditEntity,
  onDeleteEntity,
  onAddUserToEntity,
  onSetAdmin,
  data,
  state,
  getRowId,
  initialState = {},
}: TableProps) {
  const tableProps: Partial<MaterialReactTableProps> = {};
  const applyRowActions = Boolean(onEditEntity) || Boolean(onDeleteEntity);
  if (applyRowActions)
    tableProps.renderRowActions = ({ row }) => (
      <Box>
        {Boolean(onAddUserToEntity) && (
          <IconButton color="info" size="small" onClick={() => onAddUserToEntity(row)}>
            <GroupAddOutlined />
          </IconButton>
        )}
        {Boolean(onEditEntity) && (
          <IconButton size="small" onClick={() => onEditEntity(row)}>
            <EditOutlined color="warning" />
          </IconButton>
        )}
        {Boolean(onSetAdmin) && (
          <IconButton color="success" size="small" onClick={() => onSetAdmin(row)}>
            <AdminPanelSettingsIcon />
          </IconButton>
        )}
        {Boolean(onDeleteEntity) && (
          <IconButton color="error" size="small" onClick={() => onDeleteEntity(row)}>
            <DeleteOutlined />
          </IconButton>
        )}
      </Box>
    );
  return (
    <MaterialReactTable
      getRowId={getRowId}
      columns={columns}
      data={data ?? []}
      state={state}
      muiTablePaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '10px',
          padding: 2,
          '& .MuiTableRow-root': {
            backgroundColor: '#fff',
          },
          '& .MuiToolbar-root': {
            backgroundColor: '#fff',
          },
          '& .MuiTableCell-root:last-child > .MuiBox-root': {
            display: 'flex',
            alignItems: 'center',
          },
        },
      }}
      muiTopToolbarProps={{
        sx: {
          '& .MuiCollapse-root .MuiFormControl-root': {
            minHeight: '30px',
          },
        },
      }}
      {...tableProps}
      displayColumnDefOptions={{
        'mrt-row-actions': {
          size: 40,
        },
      }}
      positionActionsColumn="last"
      enableRowActions={applyRowActions}
      enableFullScreenToggle={false}
    />
  );
}

export default Table;
