import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import { Link, useNavigate } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, Syllabus } from 'src/@types';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SyllabusFormPage from './SyllabusForm';
import { toast } from 'react-toastify';

function SyllabusPage() {
  const { dispatch } = useContext(ModalContext);
  const mutation = useMutation({
    mutationFn: (id: number) => syllabusApis.deleteSyllabus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Syllabi] });
      toast.success(`Deactivate Syllabus successfully!`);
      dispatch({ type: 'close' });
    },
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const columns = useMemo<MRT_ColumnDef<Syllabus>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
      },
      // {
      //   header: 'Subject Name',
      //   accessorKey: 'subject.name',
      // },
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
      {
        header: 'No credit',
        accessorKey: 'noCredit',
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
  function onCreateEntity() {
    // navigate('create');
    dispatch({
      type: 'open',
      payload: {
        title: 'Create Syllabus',
        content: () => <SyllabusFormPage />,
      },
      onCreateOrSave: () => {},
    });
  }
  // function onEditEntity(row: MRT_Row<Syllabus>) {
  //   navigate(`${row.id}/edit`);
  // }

  function onDeleteEntity(row: MRT_Row<Syllabus>) {
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        mutation.mutate(row.original.id);
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
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Syllabi],
    queryFn: syllabusApis.getSyllabuses,
    refetchOnWindowFocus: false,
  });
  return (
    <Box>
      <ListPageHeader entity="syllabus" onCreateEntity={onCreateEntity} />
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
        getRowId={(originalRow: MRT_Row<Syllabus>) => originalRow.id}
      />
    </Box>
  );
}

export default SyllabusPage;
