import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, User } from 'src/@types';
import { QueryKey, groupApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GroupForm, { GroupFormInputs } from './GroupForm';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
// class || department || course

// class: name, curriculum
// department: name
// course: syllabus, class // WARN: Syllabus code - Class

function GroupPage() {
  const { dispatch } = useContext(ModalContext);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const columns = useMemo<MRT_ColumnDef<Group>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        Cell: ({ cell, row }) => (
          <MuiLink component={Link} to={`${row.id}`}>
            {cell.getValue<string>()}
          </MuiLink>
        ),
        enableHiding: false,
      },
      {
        header: 'Type',
        accessorKey: 'type',
      },
      // {
      //   header: 'Curriculum',
      //   accessorKey: 'curriculum.name',
      // },
      // {
      //   header: 'Syllabus',
      //   accessorKey: 'syllabus.id',
      // },
      // {
      //   header: 'Teacher',
      //   accessorKey: 'teacher.name',
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

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Groups],
    queryFn: groupApis.getGroups,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (id) => groupApis.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Groups] });
      toast.success(`Deactivate Group successfully!`);
      dispatch({ type: 'close' });
    },
  });

  function onCreateEntity() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Create Group',
        content: () => <GroupForm />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onEditEntity(row: MRT_Row<Group>) {
    if (!row) return;
    const { original } = row;
    // console.log(row.original);
    let defaultValues: Partial<GroupFormInputs & { id: number; name: string }> = {
      id: +row.id,
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

  function onDeleteEntity(row: MRT_Row<Group>) {
    if (!row) return;

    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        mutation.mutate(row.id as any);
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
  function onAddUserToEntity(row: MRT_Row<User>) {
    navigate(`${row.id}/users`);
  }
  return (
    <Box>
      <ListPageHeader entity="group" onCreateEntity={onCreateEntity} />
      <Table
        columns={columns}
        data={data}
        // onEditEntity={onEditEntity}
        onAddUserToEntity={onAddUserToEntity}
        onDeleteEntity={onDeleteEntity}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<Group>) => originalRow.id}
      />
    </Box>
  );
}

export default GroupPage;
// interface GroupFormProps {
//   defaultValues?: GroupFormInputs & { id: number };
// }
// function GroupForm({ defaultValues }: GroupFormProps) {
//   const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);

//   const {
//     register,
//     handleSubmit,
//     control,
//     watch,
//     unregister,
//     clearErrors,
//     formState: { errors },
//   } = useForm<GroupFormInputs>({
//     mode: 'all',
//     resolver: zodResolver(GroupSchema),
//     defaultValues: {
//       ...defaultValues,
//     },
//   });

//   const watchType = watch('type');
//   // console.log('🚀 ~ watchType', watchType);
//   useEffect(() => {
//     clearErrors();
//     return () => {
//       clearErrors();
//     };
//   }, [clearErrors, watchType]);

//   function onSubmit(data) {
//     console.log('data: ', defaultValues?.id, data);
//   }

//   // console.log('🚀 ~ defaultValues', defaultValues);
//   // console.log('🚀 ~ errors', errors);

//   return (
//     <>
//       <Box
//         onSubmit={handleSubmit(onSubmit)}
//         component="form"
//         id="entityForm"
//         autoComplete="off"
//         noValidate
//         sx={{
//           '& .MuiTextField-root': { m: 1, width: '100%' },
//           height: 400,
//         }}
//       >
//         <Select
//           control={control}
//           fieldName="type"
//           options={typeOptions}
//           required
//           error={Boolean(errors.type) && errors.type.message === 'Required'}
//           // defaultValue={defaultValues.type ?? ''}
//         />
//         {watchType !== GroupType.Course && (
//           <TextField
//             label="Name"
//             required
//             error={Boolean(errors.name)}
//             helperText={errors.name?.message}
//             {...register('name')}
//           />
//         )}
//         {watchType === GroupType.Class && (
//           <AsyncSelect
//             fieldName="curriculum"
//             control={control}
//             required
//             promiseOptions={groupApis.getFakedSearch}
//             error={Boolean(errors.curriculum)}
//           />
//         )}

//         {watchType === GroupType.Course && (
//           <>
//             <AsyncSelect
//               fieldName="syllabus"
//               control={control}
//               required
//               promiseOptions={groupApis.getFakedSearch}
//               error={Boolean(errors.syllabus)}
//             />
//             <AsyncSelect
//               fieldName="class"
//               control={control}
//               required
//               promiseOptions={groupApis.getFakedSearch}
//               error={Boolean(errors.class)}
//             />
//             <AsyncSelect
//               fieldName="teacher"
//               control={control}
//               required
//               promiseOptions={groupApis.getFakedSearch}
//               error={Boolean(errors.teacher)}
//             />
//           </>
//         )}
//       </Box>
//     </>
//   );
// }
