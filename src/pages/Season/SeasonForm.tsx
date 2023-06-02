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
import { Season, GroupType } from 'src/@types';
import { QueryKey, seasonApis, groupApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const SeasonSchema = z.object({
  name: z.string().min(1),
  ordinalNumber: z.coerce.number().positive(),
  startMonth: z.coerce.number().positive(),
  endMonth: z.coerce.number().positive(),
});

export type SeasonFormInputs = z.infer<typeof SeasonSchema>;
interface SeasonFormProps {
  defaultValues?: SeasonFormBody;
}
export type SeasonFormBody = SeasonFormInputs & { id: number };
function SeasonForm({ defaultValues }: SeasonFormProps) {
  const queryClient = useQueryClient();

  const { dispatch } = useContext(ModalContext);
  const mutation = useMutation<Season, unknown, any, unknown>({
    mutationFn: (body) =>
      body.id ? seasonApis.updateSeason(body) : seasonApis.createSeason(body as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Seasons] });
      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} Season successfully!`);
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
  } = useForm<SeasonFormInputs>({
    mode: 'all',
    resolver: zodResolver(SeasonSchema),
    defaultValues: {
      // active: true,
      // seasons: null,
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
    const body: SeasonFormBody = {
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
          label="Ordinal Number"
          type="number"
          required
          error={Boolean(errors.ordinalNumber)}
          helperText={errors.ordinalNumber?.message}
          {...register('ordinalNumber')}
        />
        <TextField
          label="Start Month"
          type="number"
          required
          error={Boolean(errors.startMonth)}
          helperText={errors.startMonth?.message}
          {...register('startMonth')}
        />
        <TextField
          label="End Month"
          type="number"
          required
          error={Boolean(errors.endMonth)}
          helperText={errors.endMonth?.message}
          {...register('endMonth')}
        />
      </Box>
    </>
  );
}
export default SeasonForm;
