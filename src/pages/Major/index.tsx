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
import { Group, GroupType, Major } from 'src/@types';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { majorApis } from 'src/apis';
import { generateOptions } from 'src/utils';
import MajorForm from './MajorForm';
import { toast } from 'react-toastify';

function MajorPage() {
  const { dispatch } = useContext(ModalContext);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => majorApis.deleteMajor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Majors] });
      toast.success(`Deactivate Major successfully!`);
      dispatch({ type: 'close' });
    },
  });
  const columns = useMemo<MRT_ColumnDef<Major>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
        size: 50,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        Cell: ({ cell, row }) => (
          <MuiLink component={Link} to={`${row.id}`}>
            {cell.getValue<string>()}
          </MuiLink>
        ),
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
    queryKey: [QueryKey.Majors],
    queryFn: majorApis.getMajors,
    refetchOnWindowFocus: false,
  });
  function onCreateEntity() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Create Major',
        // content: () => <SubjectForm defaultValues={{ ...(defaultValues as any) }} />,
        content: () => <MajorForm />,
      },
      onCreateOrSave: () => {},
    });
  }
  // function onEditEntity(row: MRT_Row<Major>) {
  //   const { original } = row;
  //   const defaultValues = {
  //     id: original.id,
  //     name: original.name,
  //     code: original.code,
  //     active: original.active,
  //   };
  //   dispatch({
  //     type: 'open',
  //     payload: {
  //       title: 'Edit Major',
  //       content: () => <MajorForm defaultValues={{ ...(defaultValues as any) }} />,
  //       // content: () => <SubjectForm defaultValues />,
  //     },
  //     onCreateOrSave: () => {},
  //   });
  // }
  function onDeleteEntity(row: MRT_Row<Major>) {
    if (!row) return;
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        mutation.mutate(row.id as any);
      },
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
      <ListPageHeader entity="major" onCreateEntity={onCreateEntity} />
      <Table
        columns={columns}
        data={data}
        // onEditEntity={onEditEntity}
        onDeleteEntity={onDeleteEntity}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<Major>) => originalRow.id}
      />
    </Box>
  );
}

export default MajorPage;
