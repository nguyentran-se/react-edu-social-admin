import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey, majorApis, syllabusApis, specializationApis } from 'src/apis';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { GroupType, Syllabus, Major, GroupUser, MajorSpecialization } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
// import SyllabusFormPage from '../SyllabusForm';
import { ModalContext } from 'src/contexts/ModalContext';
import MajorForm from './MajorForm';
import Table from 'src/components/Table';
import { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import SpecializationForm from './Specialization/SpecializationForm';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { toast } from 'react-toastify';
function transfromGroupDetail(data: Major) {
  return {
    code: { label: 'Code', value: data.code },
    name: { label: 'Name', value: data.name },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function MajorDetailPage() {
  const { slug } = useParams();
  const { dispatch } = useContext(ModalContext);
  const queryClient = useQueryClient();

  const columns = useMemo<MRT_ColumnDef<MajorSpecialization>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
        size: 50,
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

  const {
    data: majorDetailData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QueryKey.Majors, 'slug'],
    queryFn: () => majorApis.getMajor(slug),
    retry: 0,
    enabled: Boolean(slug),
  });

  const majorSpecializationsQuery = useQuery({
    queryKey: [QueryKey.Majors, 'slug', 'specializations'],
    queryFn: () => majorApis.getMajorSpecializations(slug),
    retry: 0,
    enabled: Boolean(slug),
  });
  const mutation = useMutation({
    mutationFn: () => specializationApis.deleteSpecialization(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Majors, 'slug', 'specializations'] });
      toast.success(`Deactivate Specialization successfully!`);
      dispatch({ type: 'close' });
    },
  });
  // const groupUsersQuery = useQuery({
  //   queryKey: [QueryKey.Majors, 'slug', 'specialization'],
  //   queryFn: () => majorApis.getGroupUsers(slug),
  //   retry: 0,
  //   enabled: Boolean(slug),
  // });

  function onEditMajor() {
    const original = majorDetailData;
    const defaultValues = {
      id: original.id,
      name: original.name,
      code: original.code,
      // active: original.active,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Major',
        content: () => <MajorForm defaultValues={{ ...(defaultValues as any) }} />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onAddSpecialization() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Add Specialization',
        // content: () => <SubjectForm defaultValues={{ ...(defaultValues as any) }} />,
        content: () => <SpecializationForm majorId={slug} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onEditMajorSpecialization(row: MRT_Row<MajorSpecialization>) {
    const { original } = row;
    const defaultValues = {
      id: original.id,
      name: original.name,
      code: original.code,
      // active: original.active,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Specialization',
        content: () => (
          <SpecializationForm majorId={slug} defaultValues={{ ...(defaultValues as any) }} />
        ),
        // content: () => <SubjectForm defaultValues />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onDeleteMajorSpecialization(row: MRT_Row<MajorSpecialization>) {
    if (!row) return;
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        mutation.mutate();
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
  if (isLoading) return <SuspenseLoader />;
  if (isError) {
    //TODO: Handle error case here
    return <div>This ID does not exist!</div>;
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Major Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditMajor}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromGroupDetail(majorDetailData)} />
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: '24px 0' }}
      >
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Specializations
        </Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onAddSpecialization}>
          Add specialization
        </Button>
      </Box>
      <Table
        columns={columns}
        data={majorSpecializationsQuery.data}
        onEditEntity={onEditMajorSpecialization}
        onDeleteEntity={onDeleteMajorSpecialization}
        state={{
          isLoading: majorSpecializationsQuery.isLoading,
          showAlertBanner: majorSpecializationsQuery.isError,
          showProgressBars: majorSpecializationsQuery.isFetching,
        }}
        getRowId={(originalRow: MRT_Row<GroupUser>) => originalRow.id}
      />
    </Box>
  );
}

export default MajorDetailPage;
