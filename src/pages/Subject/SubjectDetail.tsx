import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, groupApis, subjectApis } from 'src/apis';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { Subject, SubjectSyllabus } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
import SubjectForm from './SubjectForm';
import { ModalContext } from 'src/contexts/ModalContext';
import { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import Table from 'src/components/Table';
import SuspenseLoader from 'src/components/SuspenseLoader';

function transfromSubjectDetail(data: Subject) {
  return {
    name: { label: 'Subject Name', value: data.name },
    code: { label: 'Subject Code', value: data.code },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function SubjectDetailPage() {
  const { slug } = useParams();
  const { dispatch } = useContext(ModalContext);
  const columns = useMemo<MRT_ColumnDef<Subject>[]>(
    () => [
      {
        header: 'Syllabus Code',
        accessorKey: 'code',
      },
      {
        header: 'Syllabus Name',
        accessorKey: 'name',
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
    data: subjectDetailData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QueryKey.Subjects, 'slug'],
    queryFn: () => subjectApis.getSubject(slug),
    // select: (data) => transfromSubjectDetail(data),
    enabled: Boolean(slug),
  });
  const subjectSyllabiQuery = useQuery({
    queryKey: [QueryKey.Subjects, 'slug', 'syllabi'],
    queryFn: () => subjectApis.getSubjectSyllabi(slug),
    // select: (data) => transfromSubjectDetail(data),
    enabled: Boolean(slug),
  });

  function onEditSubject() {
    const defaultValues = {
      ...subjectDetailData,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Subject in Curriculum',
        content: () => <SubjectForm defaultValues={defaultValues as any} />,
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
          Subject Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditSubject}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromSubjectDetail(subjectDetailData)} />
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: '24px 0' }}
      >
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Syllabi
        </Typography>
        {/* <Button startIcon={<Add />} variant="contained" onClick={onAddSyllabus}>
          Add syllabus
        </Button> */}
      </Box>
      <Table
        columns={columns}
        data={subjectSyllabiQuery.data}
        // onEditEntity={onEditCurriculumSyllabus}
        // onDeleteEntity={onDeleteSyllabus}
        state={{
          isLoading: subjectSyllabiQuery.isLoading,
          showAlertBanner: subjectSyllabiQuery.isError,
          showProgressBars: subjectSyllabiQuery.isFetching,
        }}
        getRowId={(originalRow: MRT_Row<SubjectSyllabus>) => originalRow.id}
      />
    </Box>
  );
}

export default SubjectDetailPage;
