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
import { Major, GroupType } from 'src/@types';
import { QueryKey, majorApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const MajorSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  // active: z.boolean(),
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type MajorFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type MajorFormInputs = z.infer<typeof MajorSchema>;
interface MajorFormProps {
  defaultValues?: MajorFormInputs & { id?: number };
}
function MajorForm({ defaultValues }: MajorFormProps) {
  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);
  const queryClient = useQueryClient();

  const mutation = useMutation<Major, unknown, typeof defaultValues, unknown>({
    mutationFn: (body) => (body.id ? majorApis.updateMajor(body) : majorApis.createMajor(body)),
    onSuccess: () => {
      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} Major successfully!`);
      if (defaultValues?.id) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Majors, 'slug'] });
      } else {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Majors] });
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
  } = useForm<MajorFormInputs>({
    mode: 'all',
    resolver: zodResolver(MajorSchema),
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
    const body = { ...data };
    if (defaultValues?.id) body.id = defaultValues.id;
    mutation.mutate(body);
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
        height: 250,
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

export default MajorForm;
