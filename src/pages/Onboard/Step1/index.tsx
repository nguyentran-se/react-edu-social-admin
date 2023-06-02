import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
// import Select from 'react-select';
import { Subject, GroupType, CreateSeasonPayload } from 'src/@types';
import { QueryKey, subjectApis, groupApis, seasonApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useStepperContext } from 'src/contexts/StepperContext';
const OnboardStep1Schema = z.object({
  numberOfSeasons: z.number().positive(),
  seasons: z.array(
    z.object({
      name: z.string().min(1),
      ordinalNumber: z.coerce.number().positive(),
      startMonth: z.coerce.number().min(1).max(12),
      endMonth: z.coerce.number().min(1).max(12),
    }),
  ),
  // combo: z.boolean().optional(),
  // active: z.boolean(),
});
const seasonOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
];
export type SubjectFormInputs = z.infer<typeof OnboardStep1Schema>;

function OnboardStep1() {
  const { activeStep, dispatchStepper } = useStepperContext();

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
    resolver: zodResolver(OnboardStep1Schema),
  });
  // console.log('🚀 ~ errors:', errors);

  const { fields, insert, append, remove } = useFieldArray({
    control,
    name: 'seasons',
  });

  const createSessonsMutation = useMutation({
    mutationFn: (data: { season: CreateSeasonPayload[] }) => seasonApis.createWorkspaceSeason(data),
    onSuccess: () => {
      dispatchStepper({ type: 'change_status', payload: 'fulfilled' });
      dispatchStepper({ type: 'next' });
    },
  });

  const numberOfSeasons = watch('numberOfSeasons');
  useEffect(() => {
    if (numberOfSeasons > 0) {
      // numberOfSeasons.forEach()
      remove();
      Array(numberOfSeasons)
        .fill(null)
        .forEach((n, index) => {
          append(
            { name: '', ordinalNumber: index + 1, startMonth: null, endMonth: null },
            { focusIndex: 0 },
          );
        });
    }
  }, [append, numberOfSeasons, remove]);

  function onSubmit(data) {
    // console.log('🚀 ~ data:', data);
    createSessonsMutation.mutate({ season: data.seasons });
  }
  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      id="onboard"
      autoComplete="off"
      noValidate
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%' },
        height: 550,
      }}
    >
      <Select
        control={control}
        fieldName="numberOfSeasons"
        size="small"
        label="Number of seasons"
        options={seasonOptions}
        required
        error={Boolean(errors.numberOfSeasons) && errors.numberOfSeasons.message === 'Required'}
        // defaultValue={defaultValues.seasons ?? ''}
      />
      {fields.map((field, index) => (
        <Box
          key={`${field.id}`}
          sx={{ display: 'flex', alignItems: 'center', gap: '0 24px', mb: 1 }}
        >
          <TextField
            label="Name"
            size="small"
            sx={{ '&.MuiFormControl-root': { minHeight: 38 } }}
            error={Boolean(errors.seasons?.[index]?.name)}
            // helperText={errors.seasons?.[index]?.name?.message}
            {...register(`seasons.${index}.name` as const)}
          />
          <TextField
            label="Ordinal Number"
            size="small"
            type="number"
            sx={{ '&.MuiFormControl-root': { minHeight: 38 } }}
            error={Boolean(errors.seasons?.[index]?.ordinalNumber)}
            InputProps={{ readOnly: true }}
            // helperText={errors.seasons?.[index]?.ordinalNumber?.message}
            {...register(`seasons.${index}.ordinalNumber` as const)}
          />
          <TextField
            label="Start Month"
            size="small"
            type="number"
            sx={{ '&.MuiFormControl-root': { minHeight: 38 } }}
            error={Boolean(errors.seasons?.[index]?.startMonth)}
            // helperText={errors.seasons?.[index]?.startMonth?.message}
            {...register(`seasons.${index}.startMonth` as const)}
          />
          <TextField
            label="End Month"
            size="small"
            type="number"
            sx={{ '&.MuiFormControl-root': { minHeight: 38 } }}
            error={Boolean(errors.seasons?.[index]?.endMonth)}
            // helperText={errors.seasons?.[index]?.endMonth?.message}
            {...register(`seasons.${index}.endMonth` as const)}
          />
        </Box>
      ))}
      <Box />
    </Box>
  );
}

export default OnboardStep1;
