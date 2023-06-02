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
import { Subject, GroupType } from 'src/@types';
import { QueryKey, subjectApis, groupApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
// const SubjectSchema = z.object({
//   name: z.string().min(1),
//   code: z.string().min(1),
//   combo: z.boolean().optional(),
//   active: z.boolean(),

// }).refine((obj, ctx) => {
//   if(obj.combo) return
// });
const SubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  // combo: z.boolean().optional(),
  // active: z.boolean(),
});

// const SubjectSchema = z.discriminatedUnion('combo', [
//   z
//     .object({
//       combo: z.literal(false),
//       subjects: z.array(z.number()).nullable(),
//     })
//     .merge(base),
//   z
//     .object({
//       combo: z.literal(true),
//       subjects: z.array(z.number()).min(1),
//     })
//     .merge(base),
// ]);

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type SubjectFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type SubjectFormInputs = z.infer<typeof SubjectSchema>;
interface SubjectFormProps {
  defaultValues?: SubjectFormBody;
}
export type SubjectFormBody = SubjectFormInputs & { id: number };
function SubjectForm({ defaultValues }: SubjectFormProps) {
  const queryClient = useQueryClient();

  const { dispatch } = useContext(ModalContext);
  const mutation = useMutation<Subject, unknown, typeof defaultValues, unknown>({
    mutationFn: (body) =>
      body.id ? subjectApis.updateSubject(body) : subjectApis.createSubject(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Subjects] });
      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} Subject successfully!`);
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
  } = useForm<SubjectFormInputs>({
    mode: 'all',
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      // active: true,
      // subjects: null,
      // combo: false,
      ...defaultValues,
    },
  });

  // const watchCombo = watch('combo');
  // console.log('🚀 ~ watchCombo', watchCombo);
  useEffect(() => {
    clearErrors();
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  function onSubmit(data) {
    // console.log('data: ', defaultValues?.id, data);
    const body: SubjectFormBody = {
      ...data,
    };
    if (defaultValues?.id) body.id = defaultValues?.id;
    mutation.mutate(body);
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
        <TextField
          label="Name"
          required
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <TextField
          label="Code"
          required
          error={Boolean(errors.code)}
          helperText={errors.code?.message}
          {...register('code')}
        />
        {/* <Controller
          name="combo"
          control={control}
          render={({ field: { value, ...field } }) => (
            <FormControlLabel
              value="combo"
              control={<Checkbox checked={Boolean(value)} {...field} />}
              label="Combo"
              labelPlacement="end"
            />
          )}
        ></Controller> */}
        {/* {watchCombo && (
          <AsyncSelect
            fieldName="subjects"
            control={control}
            required
            isMulti
            promiseOptions={groupApis.getFakedSearch}
            error={Boolean(errors.subjects)}
          />
        )} */}
        <Box />
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
export default SubjectForm;
