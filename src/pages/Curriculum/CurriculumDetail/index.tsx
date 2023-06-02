import React, { useMemo, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey, groupApis, curriculumApis, syllabusApis } from 'src/apis';
import SuspenseLoader from 'src/components/SuspenseLoader';
import MuiLink from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { Curriculum, CurriculumCombo, CurriculumSyllabus } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
import Table from 'src/components/Table';
import { syllabusData } from 'src/__mock__';
import { MRT_Row, MRT_ColumnDef } from 'material-react-table';
import { Add, EditOutlined } from '@mui/icons-material';
import CurriculumFormPage, {
  CurriculumFormInputs,
  CurriculumSyllabusForm,
} from '../CurriculumForm';
import { ModalContext } from 'src/contexts/ModalContext';
import { generateOptions } from 'src/utils';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelect from 'src/components/AsyncSelect';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useCheckboxSearchList } from 'src/components/CheckboxSearchList';
import CurriculumComboForm from './CurriculumComboForm';
import { capitalizeAndOmitUnderscore } from 'src/utils';
function transfromCurriculumDetail(data: Curriculum) {
  const formattedSeason = capitalizeAndOmitUnderscore(data.startedTerm.season.name);
  return {
    code: { label: 'Code', value: data.code },
    name: { label: 'Name', value: data.name },
    term: { label: 'Term', value: `${formattedSeason} ${data.startedTerm.year}` },
    noSemester: { label: 'Semester', value: `${data.noSemester}` },
    currentSemester: { label: 'Current Semester', value: data.currentSemester },
    schoolYear: { label: 'School Year', value: data.schoolYear },
    description: { label: 'Description', value: data.description },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function CurriculumDetailPage() {
  const queryClient = useQueryClient();

  const columns = useMemo<MRT_ColumnDef<CurriculumSyllabus>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'syllabus.code',
      },
      {
        header: 'Name',
        accessorKey: 'syllabus.name',
        Cell: ({ cell, row }) => (
          <MuiLink component={Link} to={`/syllabi/${row.id}`}>
            {cell.getValue<string>()}
          </MuiLink>
        ),
        enableHiding: false,
      },
      {
        header: 'Semester',
        accessorKey: 'semester',
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
  const comboColumns = useMemo<MRT_ColumnDef<CurriculumCombo>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
      },
      {
        header: 'Name',
        accessorKey: 'name',
        Cell: ({ cell, row }) => (
          <MuiLink component={Link} to={`combo/${row.id}`}>
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
  const { dispatch } = useContext(ModalContext);
  const { slug } = useParams();

  const curriculumDetailQuery = useQuery({
    queryKey: [QueryKey.Curricula, 'slug'],
    queryFn: () => curriculumApis.getCurriculum(slug),
    refetchOnWindowFocus: false,
    // select: (data) => transfromCurriculumDetail(data),
    retry: 0,
    enabled: Boolean(slug),
  });

  const curriculumSyllabusQuery = useQuery({
    queryKey: [QueryKey.Curricula, 'slug', QueryKey.Syllabi],
    queryFn: () => curriculumApis.getCurriculumSyllabuses(slug),
    refetchOnWindowFocus: false,
  });
  const curriculumCombosQuery = useQuery({
    queryKey: [QueryKey.Curricula, 'slug', QueryKey.Combos],
    queryFn: () => curriculumApis.getCurriculumCombos(slug),
    select: (data) => data.combos,
    refetchOnWindowFocus: false,
  });

  // const { CheckboxSearchList, values, valuesRef } = useCheckboxSearchList({
  //   initialList: curriculumCombosQuery.data,
  //   // initialChecked: comboDetailData?.syllabi ? comboDetailData.syllabi.map((s) => s.id) : [],
  // });

  const deleteSyllabusMutation = useMutation({
    mutationFn: (syllabusId) => curriculumApis.deleteCurriculumSyllabus(slug, syllabusId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Curricula, 'slug', QueryKey.Syllabi] });
      toast.success(`Remove Syllabus successfully!`);
      dispatch({ type: 'close' });
    },
  });
  const deleteComboMutation = useMutation({
    mutationFn: (comboId) => curriculumApis.deleteCurriculumCombo(slug, comboId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Curricula, 'slug', QueryKey.Combos] });
      toast.success(`Remove Combo successfully!`);
      dispatch({ type: 'close' });
    },
  });

  function onEditCurriculum() {
    const original = curriculumDetailQuery.data;
    // const defaultValues = {};

    const defaultValues = {
      ...original,
      id: original.id,
      schoolYear: original.schoolYear,
      description: original.description,
      // major: generateOptions({ data: original.major, valuePath: 'id', labelPath: 'name' }),
      specialization: generateOptions({
        data: original.specialization,
        valuePath: 'id',
        labelPath: 'name',
      }),
      noSemester: original.noSemester,
      season: original.startedTerm?.season ?? '',
      year: original.startedTerm?.year,
      // active: original.active,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Curriculum',
        content: () => <CurriculumFormPage defaultValues={{ ...(defaultValues as any) }} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onAddCurriculumSyllabus() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Add Syllabus into Curriculum',
        content: () => <CurriculumSyllabusForm curriculumId={slug} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onEditCurriculumSyllabus(row: MRT_Row<CurriculumSyllabus>) {
    const { original } = row;
    const defaultValues = {
      id: original.syllabus.id,
      syllabus: { label: original.syllabus.name, value: original.syllabus.id },
      semester: original.semester,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Syllabus in Curriculum',
        content: () => (
          <CurriculumSyllabusForm curriculumId={slug} defaultValues={defaultValues as any} />
        ),
      },
      onCreateOrSave: () => {},
    });
  }

  function onAddCurriculumCombo() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Add Combo into Curriculum',
        content: () => <CurriculumComboForm curriculumId={slug} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onEditCurriculumCombo() {}
  function onDeleteCurriculumSyllabus(row: MRT_Row<CurriculumSyllabus>) {
    if (!row) return;
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        deleteSyllabusMutation.mutate(row.id as any);
      },
      payload: {
        title: 'Remove this item',
        content: () => (
          <Typography variant="body1">
            Are you sure you want to remove {row.original.syllabus.name}?
          </Typography>
        ),
        confirmTitle: 'Remove',
      },
    });
  }
  function onDeleteCurriculumCombo(row: MRT_Row<CurriculumCombo>) {
    if (!row) return;
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        deleteComboMutation.mutate(row.id as any);
      },
      payload: {
        title: 'Remove this item',
        content: () => (
          <Typography variant="body1">
            Are you sure you want to remove {row.original.name}?
          </Typography>
        ),
        confirmTitle: 'Remove',
      },
    });
  }
  if (curriculumDetailQuery.isLoading) return <SuspenseLoader />;
  if (curriculumDetailQuery.isError) {
    //TODO: Handle error case here
    return <div>This ID does not exist!</div>;
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Curriculum Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditCurriculum}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromCurriculumDetail(curriculumDetailQuery.data)} />
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: '24px 0' }}
      >
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Combos
        </Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onAddCurriculumCombo}>
          Add combo
        </Button>
      </Box>
      <Table
        columns={comboColumns}
        data={curriculumCombosQuery.data}
        // onEditEntity={onEditCurriculumCombo}
        onDeleteEntity={onDeleteCurriculumCombo}
        state={{
          isLoading: curriculumCombosQuery.isLoading,
          showAlertBanner: curriculumCombosQuery.isError,
          showProgressBars: curriculumCombosQuery.isFetching,
        }}
        getRowId={(originalRow: MRT_Row<CurriculumSyllabus>) => originalRow.id}
      />

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: '24px 0' }}
      >
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Curriculum Plan
        </Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onAddCurriculumSyllabus}>
          Add syllabus
        </Button>
      </Box>
      <Table
        columns={columns}
        data={curriculumSyllabusQuery.data}
        onEditEntity={onEditCurriculumSyllabus}
        onDeleteEntity={onDeleteCurriculumSyllabus}
        state={{
          isLoading: curriculumSyllabusQuery.isLoading,
          showAlertBanner: curriculumSyllabusQuery.isError,
          showProgressBars: curriculumSyllabusQuery.isFetching,
        }}
        getRowId={(originalRow: MRT_Row<CurriculumSyllabus>) =>
          (originalRow as any).syllabus?.id ?? originalRow.id
        }
      />
    </Box>
  );
}

export default CurriculumDetailPage;
