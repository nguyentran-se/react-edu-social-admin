import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { MRT_Row, MRT_ColumnDef } from 'material-react-table';
import { useContext, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { User, Group, GroupUser } from 'src/@types';
import { QueryKey, curriculumApis, searchApis, userApis, groupApis } from 'src/apis';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
import { useCheckboxSearchList } from 'src/components/CheckboxSearchList';
function GroupUsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug } = useParams();

  const { dispatch } = useContext(ModalContext);
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Groups, 'slug', 'users'],
    queryFn: () => groupApis.getGroupUsers(slug),
    retry: 0,
    enabled: Boolean(slug),
  });
  const deleteMutation = useMutation({
    mutationFn: (userId) => groupApis.removeGroupUser(slug, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Groups, 'slug', 'users'] });
      toast.success(`Remove User successfully!`);
      dispatch({ type: 'close' });
    },
  });
  const userNotInGroupQuery = useQuery({
    queryKey: [QueryKey.Groups, 'slug', 'users', 'none'],
    queryFn: () => userApis.getGroupUsersNone(slug),
  });

  const { values, CheckboxSearchList } = useCheckboxSearchList({
    initialList: userNotInGroupQuery.data ?? [],
  });

  const mutation = useMutation({
    mutationFn: () => groupApis.addGroupUsers(slug, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Groups, 'slug', 'users'] });
      toast.success(`Add User successfully!`);
      dispatch({ type: 'close' });
    },
  });
  const setAdminMutation = useMutation<unknown, unknown, { userId; data }>({
    mutationFn: ({ userId, data }) => groupApis.setAdmin(slug, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Groups, 'slug', 'users'] });
      toast.success(`Update successfully!`);
      dispatch({ type: 'close' });
    },
  });

  const groupDetailQuery = useQuery({
    queryKey: [QueryKey.Groups, 'slug'],
    queryFn: () => groupApis.getGroup(slug),
    enabled: Boolean(slug),
  });

  const columns = useMemo<MRT_ColumnDef<GroupUser>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
      },
      {
        header: 'Name',
        accessorKey: 'name',
        Cell: ({ cell, row }) => (
          <MuiLink component={Link} to={`/users/${row.id}`}>
            {cell.getValue<string>()}
          </MuiLink>
        ),
        enableHiding: false,
      },
      {
        header: 'E-mail',
        accessorKey: 'eduMail',
      },
      // {
      //   header: 'Role',
      //   accessorKey: 'role',
      // },
      {
        header: 'Role',
        accessorKey: 'groupAdmin',
        Cell: ({ cell }) => <span>{cell.getValue<boolean>() ? 'Admin' : 'Member'}</span>,
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
    // dispatch({
    //   type: 'open',
    //   payload: {
    //     title: 'Create User',
    //     content: () => <CurriculumFormPage />,
    //   },
    //   onCreateOrSave: () => {},
    // });
    // navigate('create');
  }

  // function onEditEntity(row: MRT_Row<User>) {
  //   if (!row) return;
  //   navigate(`${row.id}/edit`);
  // }

  function onDeleteEntity(row: MRT_Row<User>) {
    if (!row) return;

    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        deleteMutation.mutate(row.id as any);
      },
      payload: {
        title: 'Remove this user',
        content: () => (
          <Typography variant="body1">
            Are you sure you want to remove {row.original.name}?
          </Typography>
        ),
        confirmTitle: 'Remove',
      },
    });
  }
  function onAddUserToGroup() {
    dispatch({
      type: 'open',
      payload: {
        title: `Add Member to Group ${groupDetailQuery.data.name}`,
        content: () => <CheckboxSearchList />,
        saveTitle: 'Add',
      },
      onCreateOrSave: () => {
        mutation.mutate();
      },
    });
  }
  function onSetAdmin(row: MRT_Row<User>) {
    if (!row) return;
    const isGroupAdmin = row.original.groupAdmin;
    dispatch({
      type: 'open',
      onCreateOrSave: () => {
        setAdminMutation.mutate({ userId: row.id, data: { value: !isGroupAdmin } });
      },
      payload: {
        title: 'Set Admin',
        content: () => (
          <Typography variant="body1">
            {isGroupAdmin
              ? `Are you sure you want to unset ${row.original.name}?`
              : `Are you sure you want to set ${row.original.name} as Admin?`}
          </Typography>
        ),
        saveTitle: isGroupAdmin ? 'Unset' : 'Apply',
      },
    });
  }
  return (
    <Box>
      {/* <ListPageHeader entity="curriculum" onCreateEntity={onCreateEntity} /> */}
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: '24px 0' }}
      >
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Users in group
        </Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onAddUserToGroup}>
          Add Users
        </Button>
      </Box>
      <Table
        columns={columns}
        data={data}
        // onAddUserToEntity={onAddUserToEntity}
        onDeleteEntity={onDeleteEntity}
        onSetAdmin={onSetAdmin}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<User>) => originalRow.id}
      />
    </Box>
  );
}

export default GroupUsersPage;
