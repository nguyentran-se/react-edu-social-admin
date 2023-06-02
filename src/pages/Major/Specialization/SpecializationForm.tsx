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
import { Specialization, GroupType } from 'src/@types';
import { QueryKey, searchApis, specializationApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { getSelectValue } from 'src/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const SpecializationSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  studentCode: z.string().min(1),
  // major: z
  //   .number()
  //   .positive()
  //   .or(z.object({ value: z.number().positive(), label: z.string() })),
  // active: z.boolean(),
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type SpecializationFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type SpecializationFormInputs = z.infer<typeof SpecializationSchema>;
interface SpecializationFormProps {
  defaultValues?: SpecializationFormInputs & { id?: number };
  majorId: string | number;
}
function SpecializationForm({ defaultValues, majorId }: SpecializationFormProps) {
  const queryClient = useQueryClient();

  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);
  const mutation = useMutation<Specialization, unknown, typeof defaultValues, unknown>({
    mutationFn: (body) =>
      body.id
        ? specializationApis.updateSpecialization(body)
        : specializationApis.createSpecialization(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Majors, 'slug', 'specializations'] });
      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} Specialization successfully!`);
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
  } = useForm<SpecializationFormInputs>({
    mode: 'all',
    resolver: zodResolver(SpecializationSchema),
    defaultValues: {
      // active: true,
      ...defaultValues,
    },
  });

  useEffect(() => {
    clearErrors();
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  function onSubmit(data) {
    // console.log('data: ', defaultValues?.id, data);
    const body = { ...data, major: { id: majorId } };
    if (defaultValues?.id) body.id = defaultValues.id;
    mutation.mutate(body);
  }

  function promiseOptions(input) {
    return searchApis.search({
      entity: 'major',
      field: 'name',
      value: input,
    });
  }
  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      id="entityForm"
      autoComplete="off"
      noValidate
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%' },
        height: 320,
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
      <TextField
        label="Student Code"
        required
        error={Boolean(errors.studentCode)}
        helperText={errors.studentCode?.message}
        {...register('studentCode')}
      />
      {/* <AsyncSelect
        fieldName="major"
        control={control}
        required
        // isMulti
        promiseOptions={promiseOptions}
        error={Boolean(errors.major)}
      /> */}
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
  );
}

export default SpecializationForm;
