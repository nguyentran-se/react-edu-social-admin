import React, { useContext, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey, groupApis, syllabusApis, comboApis } from 'src/apis';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { Combo, ComboDetail, Syllabus, CurriculumCombo } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
import ComboForm from './ComboForm';
import { ModalContext } from 'src/contexts/ModalContext';
import { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import Table from 'src/components/Table';
import { useCheckboxSearchList } from 'src/components/CheckboxSearchList';
import { toast } from 'react-toastify';
import SuspenseLoader from 'src/components/SuspenseLoader';

function transfromComboDetail(data: Combo) {
  return {
    name: { label: 'Name', value: data.name },
    code: { label: 'Code', value: data.code },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function ComboDetailPage() {
  const { slug } = useParams();
  const { dispatch } = useContext(ModalContext);
  const queryClient = useQueryClient();
  const checkedValuesRef = useRef(null);
  const columns = useMemo<MRT_ColumnDef<CurriculumCombo>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
      },
      {
        header: 'Syllabus Name',
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
    data: comboDetailData,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: [QueryKey.Combos, 'slug'],
    queryFn: () => comboApis.getCombo(slug),
    refetchOnWindowFocus: false,
    // select: (data) => transfromComboDetail(data),
    retry: 0,
    enabled: Boolean(slug),
  });

  const syllabusQuery = useQuery({
    queryKey: [QueryKey.Syllabus, 'slug'],
    queryFn: syllabusApis.getSyllabuses,
    refetchOnWindowFocus: false,
    // select: (data) => {
    //   if (!comboDetailData.syllabi) return data;
    //   const comboSyllabusIds = comboDetailData.syllabi.map((s) => s.id);
    //   return data.filter((d) => !comboSyllabusIds.includes(d.id));
    // },
    retry: 0,
    enabled: Boolean(slug),
  });
  const { CheckboxSearchList, values, valuesRef } = useCheckboxSearchList({
    initialList: syllabusQuery.data,
    initialChecked: comboDetailData?.syllabi ? comboDetailData.syllabi.map((s) => s.id) : [],
  });
  checkedValuesRef.current = values;
  const mutation = useMutation<Combo, unknown, any, unknown>({
    mutationFn: (body) => (body.id ? comboApis.updateCombo(body) : comboApis.createCombo(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Combos, 'slug'] });
      toast.success(`Update Combo successfully!`);
      dispatch({ type: 'close' });
    },
  });
  function onEditCombo() {
    const defaultValues = {
      ...comboDetailData,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Combo',
        content: () => <ComboForm defaultValues={defaultValues as any} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onAddSyllabus() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Add Syllabus into Combo',
        content: () => <CheckboxSearchList />,
      },
      onCreateOrSave: () => {
        const body = {
          ...comboDetailData,
          syllabi: valuesRef.current.map((x) => ({ id: x })),
        };
        mutation.mutate(body);
      },
    });
  }
  function onDeleteSyllabus() {}
  if (isLoading) return <SuspenseLoader />;
  if (isError) {
    //TODO: Handle error case here
    return <div>This ID does not exist!</div>;
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Combo Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditCombo}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromComboDetail(comboDetailData)} />
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: '24px 0' }}
      >
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Syllabi
        </Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onAddSyllabus}>
          Add syllabus
        </Button>
      </Box>
      <Table
        columns={columns}
        data={comboDetailData.syllabi}
        // onEditEntity={onEditCurriculumSyllabus}
        onDeleteEntity={onDeleteSyllabus}
        state={{
          isLoading: isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<ComboDetail>) => originalRow.id}
      />
    </Box>
  );
}

export default ComboDetailPage;
