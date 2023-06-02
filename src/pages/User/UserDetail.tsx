import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, userApis, syllabusApis } from 'src/apis';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SuspenseLoader from 'src/components/SuspenseLoader';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { GroupType, Syllabus, User, GroupUser, UserRole } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
// import SyllabusFormPage from '../SyllabusForm';
import { ModalContext } from 'src/contexts/ModalContext';
import UserForm from './UserForm';
import Table from 'src/components/Table';
import { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import { capitalizeAndOmitUnderscore, generateOptions } from 'src/utils';

function transfromGroupDetail(data: User) {
  const studentData =
    data.role === UserRole.Student
      ? {
          schoolYear: { label: 'School Year', value: data.schoolYear },
          curriculum: { label: 'Curriculum', value: data.curriculum?.name },
        }
      : {};
  return {
    name: { label: 'Name', value: data.name },
    code: { label: 'Code', value: data.code },
    identifyNumber: { label: 'Identify Number', value: data.identifyNumber },
    role: { label: 'Role', value: capitalizeAndOmitUnderscore(data.role) },
    email: { label: 'E-mail', value: data.eduMail },
    personalMail: { label: 'Personal e-mail', value: data.personalMail },
    ...studentData,
    phoneNumber: { label: 'Phone Number', value: data.phoneNumber },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function GroupDetailPage() {
  const { slug } = useParams();
  const { dispatch } = useContext(ModalContext);

  const {
    data: userDetailData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QueryKey.Users, 'slug'],
    queryFn: () => userApis.getUser(slug),
    enabled: Boolean(slug),
  });
  // const groupUsersQuery = useQuery({
  //   queryKey: [QueryKey.Groups, 'slug', 'users'],
  //   queryFn: () => userApis.getGroupUsers(slug),
  //   retry: 0,
  //   enabled: Boolean(slug),
  // });

  function onEditUser() {
    if (!userDetailData) return;
    const defaultValues = {
      id: userDetailData.id,
      name: userDetailData.name,
      code: userDetailData.code,
      role: userDetailData.role,
      identifyNumber: userDetailData.identifyNumber,
      schoolYear: userDetailData.schoolYear,
      personalMail: userDetailData.personalMail,
      eduMail: userDetailData.eduMail,
      avatar: userDetailData.avatar,
      phoneNumber: userDetailData.phoneNumber,
      curriculum: generateOptions({
        data: userDetailData.curriculum,
        valuePath: 'id',
        labelPath: 'code',
      }),
      // active: userDetailData.active,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit User',
        content: () => <UserForm defaultValues={{ ...(defaultValues as any) }} />,
      },
      onCreateOrSave: () => {},
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
          User Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditUser}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromGroupDetail(userDetailData)} />
    </Box>
  );
}

export default GroupDetailPage;
