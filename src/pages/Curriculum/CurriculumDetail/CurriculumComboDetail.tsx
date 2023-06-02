import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, curriculumApis, groupApis, syllabusApis } from 'src/apis';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import { CurriculumCombo, CurriculumComboDetail, Combo, ComboPlan } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
// import SyllabusFormPage from '../SyllabusForm';
import { ModalContext } from 'src/contexts/ModalContext';
import Table from 'src/components/Table';
import { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import SuspenseLoader from 'src/components/SuspenseLoader';

function transfromSyllabusDetail(data: Combo) {
  return {
    name: { label: 'CurriculumComboDetail Name', value: data.name },
    code: { label: 'Code', value: `${data.code}` },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function CurriculumComboDetailPage() {
  const { slug, comboSlug } = useParams();
  const { dispatch } = useContext(ModalContext);
  const columns = useMemo<MRT_ColumnDef<ComboPlan>[]>(
    () => [
      {
        header: 'Syllabus Code',
        accessorKey: 'syllabus.code',
      },
      {
        header: 'Syllabus Name',
        accessorKey: 'syllabus.name',
      },
      {
        header: 'Combo Plan',
        accessorKey: 'comboPlan',
        Cell: ({ cell }) => (
          <Checkbox disableRipple disableTouchRipple checked={cell.getValue<boolean>()} readOnly />
        ),
      },
      {
        header: 'Active',
        accessorKey: 'syllabus.active',
        enableSorting: false,
        Cell: ({ cell }) => (
          <Checkbox disableRipple disableTouchRipple checked={cell.getValue<boolean>()} readOnly />
        ),
      },
    ],
    [],
  );
  const {
    data: curriculumComboDetailData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: [QueryKey.Curricula, 'slug', QueryKey.Combos, 'comboSlug'],
    queryFn: () => curriculumApis.getCurriculumCombo(slug, comboSlug),
    refetchOnWindowFocus: false,
    // select: (data) => transfromSyllabusDetail(data),
    retry: 0,
    enabled: Boolean(slug),
  });

  function onEditSyllabus() {
    const defaultValues = {
      ...curriculumComboDetailData,
    };
    // dispatch({
    //   type: 'open',
    //   payload: {
    //     title: 'Edit CurriculumComboDetail in Curriculum',
    //     content: () => <SyllabusFormPage syllabusId={slug} defaultValues={defaultValues as any} />,
    //   },
    //   onCreateOrSave: () => {},
    // });
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
          Curriculum Combo Detail
        </Typography>
        {/* <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditSyllabus}>
          Edit
        </Button> */}
      </Box>
      <HeaderRowTable data={transfromSyllabusDetail(curriculumComboDetailData.combo)} />
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
        data={curriculumComboDetailData.comboPlans}
        // onEditEntity={onEditCurriculumSyllabus}
        // onDeleteEntity={onDeleteSyllabus}
        state={{
          isLoading: isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<CurriculumComboDetail>) => originalRow.id}
      />
    </Box>
  );
}

export default CurriculumComboDetailPage;
