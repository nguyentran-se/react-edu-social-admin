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
import { Combo, GroupType } from 'src/@types';
import { QueryKey, comboApis, groupApis, searchApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const ComboSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  // syllabi: z.array(z.number()).nullable(),
  // active: z.boolean(),
});

export type ComboFormInputs = z.infer<typeof ComboSchema>;
interface ComboFormProps {
  defaultValues?: ComboFormBody;
}
export type ComboFormBody = ComboFormInputs & { id: number };
function ComboForm({ defaultValues }: ComboFormProps) {
  const queryClient = useQueryClient();

  const { dispatch } = useContext(ModalContext);
  const mutation = useMutation<Combo, unknown, typeof defaultValues, unknown>({
    mutationFn: (body) => (body.id ? comboApis.updateCombo(body) : comboApis.createCombo(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Combos] });
      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} Combo successfully!`);
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
  } = useForm<ComboFormInputs>({
    mode: 'all',
    resolver: zodResolver(ComboSchema),
    defaultValues: {
      // active: true,
      // syllabi: null,
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
    const body: ComboFormBody = {
      ...data,
      // syllabi: data.syllabi.map((x) => ({ id: x })),
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
        {/* <AsyncSelect
          fieldName="syllabi"
          control={control}
          required
          isMulti
          promiseOptions={(input) =>
            searchApis.search({ entity: 'syllabus', field: 'name', value: input })
          }
          error={Boolean(errors.syllabi)}
        /> */}
        {/* <Box />
        <Controller
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
export default ComboForm;
