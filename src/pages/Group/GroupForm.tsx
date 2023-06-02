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
import { Group, GroupType } from 'src/@types';
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

const typeOptions = [
  { value: GroupType.Class, label: 'Class' },
  { value: GroupType.Course, label: 'Course' },
  { value: GroupType.Department, label: 'Department' },
  { value: GroupType.Normal, label: 'Normal' },
] as const;
const options = typeOptions.map((t) => t.value);

const nameSchema = z.string().min(1);
const asyncSelectSchema = z
  .number()
  .positive()
  .or(z.object({ value: z.number().positive(), label: z.string() }));
const classSchema = z.object({
  // name: nameSchema,
  curriculum: asyncSelectSchema,
});

const courseSchema = z.object({
  syllabus: asyncSelectSchema,
  class: asyncSelectSchema,
  teacher: asyncSelectSchema,
});

const departmentSchema = z.object({
  name: nameSchema,
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type GroupFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type GroupFormInputs = z.infer<typeof classSchema> &
  z.infer<typeof courseSchema> & { type: typeof options[number] };
const GroupSchema = z.union([
  z.object({ type: z.literal(GroupType.Class) }).and(classSchema),
  z.object({ type: z.literal(GroupType.Course) }).and(courseSchema),
  z.object({ type: z.literal(GroupType.Department) }).and(departmentSchema),
  z.object({ type: z.literal(GroupType.Normal) }).and(departmentSchema),
]);

interface GroupFormProps {
  defaultValues?: GroupFormBody;
}
// export type GroupFormBody = GroupFormInputs & { id?: number };
export type GroupFormBody = any;
function GroupForm({ defaultValues }: GroupFormProps) {
  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation<Group, unknown, typeof defaultValues, unknown>({
    mutationFn: (body) => (body.id ? groupApis.updateGroup(body) : groupApis.createGroup(body)),
    onSuccess: () => {
      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} Group successfully!`);
      queryClient.invalidateQueries({ queryKey: [QueryKey.Groups, 'slug'] });
      if (!defaultValues?.id) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Groups] });
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
    resolver: zodResolver(GroupSchema),
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

  function onSubmit(data: GroupFormInputs) {
    const body: GroupFormBody = {
      ...defaultValues,
      ...data,
    };
    if (defaultValues?.id) {
      data.class = null;
    }
    if (data.curriculum)
      body.curriculum = {
        id: getSelectValue((data as any).curriculum),
      };
    if (data.syllabus)
      body.syllabus = {
        id: getSelectValue((data as any).syllabus),
      };
    if (data.class) {
      body.referenceClass = {
        id: getSelectValue((data as any).class),
      };
      delete body.class;
    }
    if (data.teacher)
      body.teacher = {
        id: getSelectValue((data as any).teacher),
      };
    if (defaultValues?.id) body.id = defaultValues.id;

    mutation.mutate(body);
  }

  // useEffect(() => {
  //   console.log(defaultValues?.id);
  //   if(watchType === GroupType.Course && defaultValues?.id) {
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
  // console.log('🚀 ~ errors', errors);

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
          height: 400,
        }}
      >
        <Select
          control={control}
          fieldName="type"
          options={typeOptions}
          required
          error={Boolean(errors.type) && errors.type.message === 'Required'}
          isDisabled={Boolean(defaultValues?.type)}
          // defaultValue={defaultValues.type ?? ''}
        />
        {watchType && watchType !== GroupType.Course && watchType !== GroupType.Class && (
          <TextField
            label="Name"
            required
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register('name')}
          />
        )}
        {watchType === GroupType.Class && (
          <AsyncSelect
            fieldName="curriculum"
            control={control}
            required
            promiseOptions={promiseOptionFactory({ entity: 'curriculum' })}
            error={Boolean(errors.curriculum)}
          />
        )}

        {watchType === GroupType.Course && (
          <>
            {!defaultValues?.id && (
              <AsyncSelect
                fieldName="class"
                control={control}
                required
                promiseOptions={promiseOptionFactory({
                  entity: 'group',
                  field: ['type', 'name'],
                  parentValue: 'CLASS',
                  operator: ['eq', 'like'],
                })}
                error={Boolean(errors.class)}
              />
            )}
            <AsyncSelect
              fieldName="syllabus"
              control={control}
              required
              promiseOptions={promiseOptionFactory({ entity: 'syllabus' })}
              error={Boolean(errors.syllabus)}
            />
            <AsyncSelect
              fieldName="teacher"
              control={control}
              required
              promiseOptions={promiseOptionFactory({
                entity: 'user',
                field: ['role', 'name'],
                parentValue: 'TEACHER',
                operator: ['eq', 'like'],
              })}
              error={Boolean(errors.teacher)}
            />
          </>
        )}
        {/* <Controller
          name="active"
          control={control}
          render={({ field: { value, ...field } }) => (
            <FormControlLabel
              control={<Checkbox checked={Boolean(value)} {...field} />}
              label="Active"
              labelPlacement="end"
            />
          )}
        ></Controller> */}
      </Box>
    </>
  );
}
export default GroupForm;
