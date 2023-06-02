import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import Select from 'react-select';
import { GroupSlot, GroupType, WeekDay } from 'src/@types';
import { QueryKey, groupApis, searchApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation, useParams } from 'react-router';
import { getSelectValue } from 'src/utils';
import { toast } from 'react-toastify';

// const nameSchema = z.string().min(1);
// const asyncSelectSchema = z
//   .number()
//   .positive()
//   .or(z.object({ value: z.number().positive(), label: z.string() }));
// const classSchema = z.object({
//   // name: nameSchema,
//   curriculum: asyncSelectSchema,
// });

// const courseSchema = z.object({
//   syllabus: asyncSelectSchema,
//   class: asyncSelectSchema,
//   teacher: asyncSelectSchema,
// });

// const departmentSchema = z.object({
//   name: nameSchema,
// });

const orderOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
];
const dayOptions = [
  { label: 'Monday', value: WeekDay.Monday },
  { label: 'Tuesday', value: WeekDay.Tuesday },
  { label: 'Wednesday', value: WeekDay.Wednesday },
  { label: 'Thursday', value: WeekDay.Thursday },
  { label: 'Friday', value: WeekDay.Friday },
  { label: 'Saturday', value: WeekDay.Saturday },
  { label: 'Sunday', value: WeekDay.Sunday },
];
// https://github.com/react-hook-form/react-hook-form/issues/9287
// type GroupSlotFormInputs2 = z.infer<typeof GroupSlotSchema>; //will not work
const GroupSlotSchema = z.object({
  name: z.string().min(1),
  ordinalNumber: z.coerce.number().positive(),
  startMonth: z.coerce.number().positive(),
  endMonth: z.coerce.number().positive(),
});

interface GroupSlotFormProps {
  defaultValues?: GroupSlotFormBody;
  groupId: any;
}
// export type GroupSlotFormBody = GroupSlotFormInputs & { id?: number };
export type GroupSlotFormBody = any;
function GroupSlotForm({ defaultValues, groupId }: GroupSlotFormProps) {
  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation<GroupSlot, unknown, typeof defaultValues, unknown>({
    mutationFn: (body) =>
      body.id ? groupApis.updateGroupSlot(groupId, body) : groupApis.createGroupSlot(groupId, body),
    onSuccess: () => {
      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} GroupSlot successfully!`);
      queryClient.invalidateQueries({ queryKey: [QueryKey.Slot, 'slug'] });
      if (!defaultValues?.id) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Slot] });
      }
      dispatch({ type: 'close' });
    },
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    // resolver: zodResolver(GroupSlotSchema),
    defaultValues: {
      // active: true,
      ...defaultValues,
    },
    // shouldUnregister: true,
  });

  const watchType = watch('type');
  // console.log('🚀 ~ watchType', watchType);
  useEffect(() => {
    clearErrors();
    return () => {
      clearErrors();
    };
  }, [clearErrors, watchType]);

  function onSubmit(data: any) {
    const body: GroupSlotFormBody = {
      ...defaultValues,
      ...data,
    };

    mutation.mutate(body);
  }

  // useEffect(() => {
  //   console.log(defaultValues?.id);
  //   if(watchType === GroupSlotType.Course && defaultValues?.id) {
  //     unregister('class');
  //   }
  // }, [unregister, defaultValues?.id, watchType]);

  function promiseOptionFactory({
    entity,
    field = 'name',
    parentValue,
    operator = 'like',
  }: {
    entity: string;
    field?: string | string[];
    parentValue?: string;
    operator?: string | string[];
  }) {
    return (input) =>
      searchApis.search({
        entity,
        field,
        value: [parentValue].concat(input),
        operator,
      });
  }
  // console.log('🚀 ~ defaultValues', defaultValues);
  console.log('🚀 ~ errors', errors);

  return (
    <>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        id="entityForm"
        autoComplete="off"
        noValidate
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' },
          height: 300,
        }}
      >
        <Select
          control={control}
          options={orderOptions}
          fieldName={`order`}
          required
          error={false}
          // size="small"
          label="Order"
        />
        <Select
          control={control}
          options={dayOptions}
          fieldName={`dayOfWeek`}
          required
          error={false}
          // size="small"
          label="Day of week"
        />
        <TextField
          id="room"
          label="Room"
          // size="small"
          sx={{ '&.MuiFormControl-root': { minHeight: 38 } }}
          {...register(`room`)}
        />
      </Box>
    </>
  );
}
export default GroupSlotForm;
