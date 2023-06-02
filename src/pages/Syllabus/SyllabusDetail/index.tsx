import React, { useContext } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import { Syllabus } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
import SyllabusFormPage from '../SyllabusForm';
import { ModalContext } from 'src/contexts/ModalContext';
import { generateOptions } from 'src/utils';
import SuspenseLoader from 'src/components/SuspenseLoader';

function transfromSyllabusDetail(data: Syllabus) {
  return {
    name: { label: 'Name', value: data.name },
    code: { label: 'Code', value: data.code },
    subjectName: { label: 'Subject Name', value: data.subject?.name },
    noCredit: { label: 'Credit', value: data.noCredit },
    noSlot: { label: 'Slot', value: data.noSlot },
    // duration: { label: 'Duration', value: data.duration },
    preRequisite: {
      label: 'Pre-Requisite',
      value: data.preRequisite ? data.preRequisite.map((s) => s.name).join(', ') : '',
    },
    description: { label: 'Description', value: data.description },
    minAvgMarkToPass: { label: 'Min Avg Mark To Pass', value: data.minAvgMarkToPass },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function SyllabusDetailPage() {
  const { slug } = useParams();
  const { dispatch } = useContext(ModalContext);

  const {
    data: syllabusDetailData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QueryKey.Syllabi, 'slug'],
    queryFn: () => syllabusApis.getSyllabus(slug),
    refetchOnWindowFocus: false,
    // select: (data) => transfromSyllabusDetail(data),
    retry: 0,
    enabled: Boolean(slug),
  });

  function onEditSyllabus() {
    const defaultValues = {
      ...syllabusDetailData,
      subject: {
        label: syllabusDetailData.subject?.name,
        value: syllabusDetailData.subject?.id,
      },
      preRequisite: generateOptions({
        data: syllabusDetailData.preRequisite,
        labelPath: 'name',
        valuePath: 'id',
      }),
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Syllabus',
        content: () => <SyllabusFormPage syllabusId={slug} defaultValues={defaultValues as any} />,
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
          Syllabus Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditSyllabus}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromSyllabusDetail(syllabusDetailData)} />
    </Box>
  );
}

export default SyllabusDetailPage;
