import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useMemo } from 'react';
// import Select from 'react-select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Workspace } from 'src/@types';
import { QueryKey, workspaceApis } from 'src/apis';
import HeaderRowTable from 'src/components/HeaderRowTable';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { ModalContext } from 'src/contexts/ModalContext';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import WorkspaceForm from './WorkspaceForm';
function transfromWorkspaceDetail(data: Workspace) {
  return {
    name: { label: 'Name', value: data.name },
    code: { label: 'Code', value: data.code },
    domain: { label: 'Domain', value: data.domain },
    emailSuffix: { label: 'Email suffix', value: data.emailSuffix },
    foundedYear: { label: 'Founded Year', value: data.foundedYear },
    morningStartTime: { label: 'Morning start time', value: data.morningStartTime },
    morningEndTime: { label: 'Morning end time', value: data.morningEndTime },
    afternoonStartTime: { label: 'Afternoon start time', value: data.afternoonStartTime },
    afternoonEndTime: { label: 'Afternoon end time', value: data.afternoonEndTime },
  };
}
function WorkspacePage() {
  const { dispatch } = useContext(ModalContext);

  const queryClient = useQueryClient();
  const workspaceQuery = useQuery({
    queryKey: [QueryKey.Workspace],
    queryFn: workspaceApis.getWorkspace,
  });
  // const { data, isLoading, isError, isFetching } = useQuery({
  //   queryKey: [QueryKey.Subjects],
  //   queryFn: subjectApis.getSubjects,
  //   refetchOnWindowFocus: false,
  // });

  // const mutation = useMutation({
  //   mutationFn: (id) => subjectApis.deleteSubject(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [QueryKey.Subjects] });
  //     toast.success(`Deactivate Workspace successfully!`);
  //     dispatch({ type: 'close' });
  //   },
  // });
  const columns = useMemo<MRT_ColumnDef<Workspace>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
        size: 50,
      },

      // {
      //   header: 'Combo',
      //   accessorKey: 'combo',
      //   enableSorting: false,
      //   Cell: ({ cell }) => (
      //     <Checkbox disableRipple disableTouchRipple checked={cell.getValue<boolean>()} readOnly />
      //   ),
      // },
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

  function onEditWorkspace() {
    if (!workspaceQuery.data) return;
    const defaultValues = { ...workspaceQuery.data };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Workspace',
        content: () => <WorkspaceForm defaultValues={defaultValues as any} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onDeleteEntity(row: MRT_Row<Workspace>) {
    if (!row) return;

    // dispatch({
    //   type: 'open_confirm',
    //   onConfirm: () => {
    //     mutation.mutate(row.id as any);
    //   },
    //   payload: {
    //     // title: 'Delete this item',
    //     content: () => (
    //       <Typography variant="body1">
    //         Are you sure you want to deactivate {row.original.name}?
    //       </Typography>
    //     ),
    //   },
    // });
  }
  if (workspaceQuery.isLoading) return <SuspenseLoader />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Subject Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditWorkspace}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromWorkspaceDetail(workspaceQuery.data)} />
    </Box>
  );
}

export default WorkspacePage;
