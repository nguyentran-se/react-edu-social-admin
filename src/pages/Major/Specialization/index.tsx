import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import { Link } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, Specialization } from 'src/@types';
import { QueryKey, specializationApis, syllabusApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateOptions } from 'src/utils';
import SpecializationForm from './SpecializationForm';
import { toast } from 'react-toastify';

function SpecializationPage() {
  const { dispatch } = useContext(ModalContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => specializationApis.deleteSpecialization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Specializations] });
      toast.success(`Deactivate Specialization successfully!`);
      dispatch({ type: 'close' });
    },
  });
  const columns = useMemo<MRT_ColumnDef<Specialization>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
      },
      {
        header: 'Name',
        accessorKey: 'name',
        enableHiding: false,
      },
      // {
      //   header: 'Active',
      //   accessorKey: 'active',
      //   enableSorting: false,
      //   Cell: ({ cell }) => (
      //     <Checkbox disableRipple disableTouchRipple checked={cell.getValue<boolean>()} readOnly />
      //   ),
      // },
    ],
    [],
  );
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Specializations],
    queryFn: specializationApis.getSpecializations,
    refetchOnWindowFocus: false,
  });
  function onCreateEntity() {
    // dispatch({
    //   type: 'open',
    //   payload: {
    //     title: 'Create Specialization',
    //     // content: () => <SubjectForm defaultValues={{ ...(defaultValues as any) }} />,
    //     content: () => <SpecializationForm />,
    //   },
    //   onCreateOrSave: () => {},
    // });
  }
  function onEditEntity(row: MRT_Row<Specialization>) {
    // const { original } = row;
    // const defaultValues = {
    //   id: original.id,
    //   name: original.name,
    //   code: original.code,
    //   active: original.active,
    //   major: { value: original.major.id, label: original.major.name },
    // };
    // dispatch({
    //   type: 'open',
    //   payload: {
    //     title: 'Edit Specialization',
    //     content: () => <SpecializationForm defaultValues={{ ...(defaultValues as any) }} />,
    //     // content: () => <SubjectForm defaultValues />,
    //   },
    //   onCreateOrSave: () => {},
    // });
  }
  function onDeleteEntity(row: MRT_Row<Specialization>) {
    if (!row) return;
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {},
      payload: {
        // title: 'Delete this item',
        content: () => (
          <Typography variant="body1">
            Are you sure you want to deactivate {row.original.name}?
          </Typography>
        ),
      },
    });
  }
  return (
    <Box>
      <ListPageHeader entity="Specialization" onCreateEntity={onCreateEntity} />
      <Table
        columns={columns}
        data={data}
        onEditEntity={onEditEntity}
        onDeleteEntity={onDeleteEntity}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<Specialization>) => originalRow.id}
      />
    </Box>
  );
}

export default SpecializationPage;
