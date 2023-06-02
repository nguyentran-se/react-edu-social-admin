import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { MRT_Row, MRT_ColumnDef } from 'material-react-table';
import { useContext, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Curriculum } from 'src/@types';
import { QueryKey, curriculumApis } from 'src/apis';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import CurriculumFormPage from './CurriculumForm';
import { toast } from 'react-toastify';

function CurriculumPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { dispatch } = useContext(ModalContext);
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Syllabi],
    queryFn: curriculumApis.getCurriculums,
  });
  const mutation = useMutation({
    mutationFn: (id) => curriculumApis.deleteCurriculum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Curricula] });
      toast.success(`Deactivate Curriculum successfully!`);
      dispatch({ type: 'close' });
    },
  });
  const columns = useMemo<MRT_ColumnDef<Curriculum>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
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
      //   header: 'Description',
      //   accessorKey: 'description',
      // },
      {
        header: 'School Year',
        accessorKey: 'schoolYear',
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
    dispatch({
      type: 'open',
      payload: {
        title: 'Create Curriculum',
        content: () => <CurriculumFormPage />,
      },
      onCreateOrSave: () => {},
    });
    // navigate('create');
  }

  // function onEditEntity(row: MRT_Row<Curriculum>) {
  //   if (!row) return;
  //   navigate(`${row.id}/edit`);
  // }

  function onDeleteEntity(row: MRT_Row<Curriculum>) {
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
  function onAddUserToEntity(row: MRT_Row<Curriculum>) {
    navigate(`${row.id}/users`);
  }
  return (
    <Box>
      <ListPageHeader entity="curriculum" onCreateEntity={onCreateEntity} />
      <Table
        columns={columns}
        data={data}
        onAddUserToEntity={onAddUserToEntity}
        onDeleteEntity={onDeleteEntity}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<Curriculum>) => originalRow.id}
      />
    </Box>
  );
}

export default CurriculumPage;
