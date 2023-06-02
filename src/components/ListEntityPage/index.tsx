import { zodResolver } from '@hookform/resolvers/zod';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { TextFieldProps } from '@mui/material/TextField';
import type { MRT_ColumnDef } from 'material-react-table';
import MaterialReactTable, { MRT_Row } from 'material-react-table';
import { useContext, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Group, SelectProps } from 'src/@types';
import { groupData } from 'src/__mock__';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import Select from '../Select';
interface EntityOption {
  value: string;
  label: string;
}
export interface ListEntityFormConfig<TEntity> {
  name: Extract<keyof TEntity, string>;
  type: 'text' | 'select' | 'checkbox' | 'date';
  required: boolean;
  options?: EntityOption[];
  defaultValue?: string | Date | boolean | number;
}
type Entity = 'group' | 'user';
interface ListEntityPageProps {
  columns: MRT_ColumnDef<any>[];
  data: any[];
  schema: any;
  formConfig: ListEntityFormConfig<any>[];
  entity: Entity;
}
function ListEntityPage({ columns, data, schema, formConfig, entity }: ListEntityPageProps) {
  const { dispatch } = useContext(ModalContext);
  function onCreateEntity() {
    dispatch({
      type: 'open',
      payload: {
        title: `Create ${entity}`,
        content: () => <EntityForm schema={schema} formConfig={formConfig} />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onEditEntity(row: MRT_Row<any>) {
    dispatch({
      type: 'open',
      payload: {
        title: `Edit ${entity}`,
        content: () => <EntityForm schema={schema} formConfig={formConfig} />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onDeleteEntity(row: MRT_Row<any>) {
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {},
      payload: {
        // title: 'Delete this item',
        content: () => (
          <Typography variant="body1">Are you sure you want to deactivate this item?</Typography>
        ),
      },
    });
  }
  return (
    <Box>
      <ListPageHeader entity={entity} onCreateEntity={onCreateEntity} />
      <MaterialReactTable
        columns={columns}
        data={data}
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
          },
        }}
        renderRowActions={({ row }) => (
          <Box>
            <IconButton size="small" onClick={() => onEditEntity(row)}>
              <EditOutlined color="warning" />
            </IconButton>
            <IconButton color="error" size="small" onClick={() => onDeleteEntity(row)}>
              <DeleteOutlined />
            </IconButton>
          </Box>
        )}
        displayColumnDefOptions={{
          'mrt-row-actions': {
            size: 40,
          },
        }}
        positionActionsColumn="last"
        enableRowActions
        enableFullScreenToggle={false}
      />
    </Box>
  );
}

export default ListEntityPage;
interface EntityFormProps {
  schema: any;
  formConfig: ListEntityFormConfig<any>[];
}
function EntityForm({ schema, formConfig }: EntityFormProps) {
  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);
  // get defaultValues for form
  const defaultValues = formConfig.reduce((result, { name, defaultValue }) => {
    return { ...result, [name]: defaultValue };
  }, {});

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<any>({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
    },
  });

  // console.log('🚀 ~ errors', errors);
  function onSubmit(data) {
    // console.log(data);
  }
  return (
    <>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        id="entityForm"
        autoComplete="off"
        noValidate
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' },
        }}
      >
        {formConfig.map(({ name, type, options, required }, index) => {
          const textConfig: TextFieldProps = {
            key: name,
            label: name,
            required,
            autoFocus: index === 0 ? true : false,
            error: Boolean(errors[name]),
            helperText: errors[name]?.message,
          };
          const selectConfig: SelectProps & { key: string } = {
            key: name,
            fieldName: name,
            options,
            control,
            required,
            error: Boolean(errors[name]),
          };
          switch (type) {
            case 'text':
              return <TextField {...textConfig} {...register(name)} />;
            case 'select':
              return <Select {...selectConfig} />;
            default:
              break;
          }
        })}
      </Box>
    </>
  );
}
