import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SuspenseLoader from 'src/components/SuspenseLoader';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { GroupType, Syllabus, Group, GroupUser, GroupSlot } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
// import SyllabusFormPage from '../SyllabusForm';
import { ModalContext } from 'src/contexts/ModalContext';
import GroupForm, { GroupFormInputs } from './GroupForm';
import Table from 'src/components/Table';
import { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import GroupSlotForm from './GroupSlotForm';
function transfromGroupDetail(data: Group) {
  const classDetail = {} as any;
  if (data.type === GroupType.Class) {
    classDetail.curriculum = {
      label: 'Curriculum',
      value: `${data.curriculum.code} - ${data.curriculum.name}`,
    };
  }
  const courseDetail = {} as any;
  if (data.type === GroupType.Course) {
    courseDetail.publish = {
      label: 'Publish',
      value: `${data.publish}`,
    };
  }
  return {
    name: { label: 'Name', value: data.name },
    type: { label: 'Type', value: data.type },
    ...classDetail,
    private: { label: 'Private', value: `${data.private}` },
    // preRequisite: {
    //   label: 'Pre-Requisite',
    //   value: data.preRequisite ? data.preRequisite.map((s) => s.name).join(', ') : '',
    // },
    ...courseDetail,
    active: { label: 'Active', value: `${data.active}` },
  };
}

function GroupDetailPage() {
  const { slug } = useParams();
  const { dispatch } = useContext(ModalContext);
  const columns = useMemo<MRT_ColumnDef<GroupSlot>[]>(
    () => [
      {
        header: 'No.',
        accessorKey: 'no',
      },
      {
        header: 'Order',
        accessorKey: 'order',
      },
      // {
      //   header: 'Day of week',
      //   accessorKey: 'dayOfWeek',
      // },
      {
        header: 'Room',
        accessorKey: 'room',
      },
      {
        header: 'Start Date',
        accessorKey: 'date',
        Cell: ({ cell }) => (
          <span>{cell.getValue<string>() ? cell.getValue<string>() : 'TBD'}</span>
        ),
      },
    ],
    [],
  );

  const {
    data: groupDetailData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QueryKey.Groups, 'slug'],
    queryFn: () => groupApis.getGroup(slug),
    enabled: Boolean(slug),
  });
  const groupSlotsQuery = useQuery({
    queryKey: [QueryKey.Groups, 'slug', QueryKey.Slot],
    queryFn: () => groupApis.getGroupSlots(slug),
    enabled: Boolean(slug) && groupDetailData?.type === GroupType.Course,
  });

  function onEditGroup() {
    if (!groupDetailData) return;
    const original = groupDetailData;
    let defaultValues: Partial<GroupFormInputs & { id: number; name: string }> = {
      ...groupDetailData,
      id: +groupDetailData.id,
      type: original.type as any,
      // active: original.active,
    };
    switch (original.type) {
      case GroupType.Class:
        defaultValues = {
          ...defaultValues,
          // name: original.name,
          curriculum: { label: original.curriculum.name, value: original.curriculum.id },
        };
        break;
      case GroupType.Course:
        defaultValues = {
          ...defaultValues,
          syllabus: { value: original.syllabus.id, label: original.syllabus.name },
          class: { value: 1, label: 'NO SEND' }, //WARN: This value will not be in body payload
          teacher: { value: original.teacher.id, label: original.teacher.name },
        };
        break;
      case GroupType.Department:
      case GroupType.Normal:
        defaultValues = {
          ...defaultValues,
          name: original.name,
        };
        break;
    }
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Group',
        content: () => <GroupForm defaultValues={{ ...(defaultValues as any) }} />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onAddGroupSlot() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Add Slot',
        content: () => <GroupSlotForm groupId={slug} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onCreateGroupSlot() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Create Slot',
        content: () => <GroupSlotForm groupId={slug} />,
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
          Group Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditGroup}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromGroupDetail(groupDetailData)} />

      {groupDetailData.type === GroupType.Course && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              m: '24px 0',
            }}
          >
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              sx={{ textTransform: 'capitalize' }}
            >
              Slots
            </Typography>
            <Box>
              {/* <Button
                sx={{ mr: 1 }}
                startIcon={<Add />}
                variant="contained"
                onClick={onAddGroupSlot}
              >
                Add slot
              </Button> */}
              <Button startIcon={<Add />} variant="contained" onClick={onCreateGroupSlot}>
                Create slot
              </Button>
            </Box>
          </Box>
          <Table
            columns={columns}
            data={groupSlotsQuery.data}
            // onEditEntity={onEditCurriculumSyllabus}
            // onDeleteEntity={onDeleteEntity}
            state={{
              isLoading: groupSlotsQuery.isLoading,
              showAlertBanner: groupSlotsQuery.isError,
              showProgressBars: groupSlotsQuery.isFetching,
            }}
            getRowId={(originalRow: MRT_Row<GroupUser>) => originalRow.id}
          />
        </>
      )}
    </Box>
  );
}

export default GroupDetailPage;
