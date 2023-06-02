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
import { Subject, GroupType, CreateSeasonPayload, UpdateWorkspacePayload } from 'src/@types';
import { QueryKey, subjectApis, groupApis, seasonApis, termApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useStepperContext } from 'src/contexts/StepperContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { useNavigate } from 'react-router-dom';
import { getSelectValue } from 'src/utils';
import dayjs from 'dayjs';

const timeRegex = /.*\d{2}.*\d{2}.*/;
const OnboardStep2Schema = z.object({
  season: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  year: z.string().regex(/^\d{4}$/),
  // foundedYear: z.coerce.number().positive(),
  // slotDurationInMin: z.coerce.number().positive(),
  // restTimeInMin: z.coerce.number().positive(),
  // morningStartTime: z.string().regex(timeRegex),
  // morningEndTime: z.string().regex(timeRegex),
  // afternoonStartTime: z.string().regex(timeRegex),
  // afternoonEndTime: z.string().regex(timeRegex),
  emailSuffix: z.string().min(1),
});
export type OnboardStep2FormInputs = z.infer<typeof OnboardStep2Schema>;
const defaultSlotProps: any = {
  textField: {
    sx: {
      width: '100%',
      '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' },
    },
    size: 'small',
  },
  openPickerButton: {
    size: 'small',
  },
};
function OnboardStep2() {
  const { activeStep, dispatchStepper, data: stepData } = useStepperContext();
  const navigate = useNavigate();
  const seasonsQuery = useQuery({
    queryKey: [QueryKey.Seasons],
    queryFn: seasonApis.getSeasons,
    select: (res) => res.map((r) => ({ label: r.name, value: r.id })),
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<OnboardStep2FormInputs>({
    mode: 'all',
    resolver: zodResolver(OnboardStep2Schema),
    defaultValues: {
      season: stepData ? stepData.currentTerm.season.id : undefined,
      year: stepData ? stepData.currentTerm.year : dayjs().format('YYYY'),
      emailSuffix: stepData?.emailSuffix ?? '',
    },
  });

  const workspaceDetailQuery = useQuery({
    queryFn: termApis.getWorkspaceDetail,
    queryKey: ['workspace-detail'],
  });

  const updateWorkspaceMutation = useMutation({
    mutationFn: (data: UpdateWorkspacePayload) => termApis.updateWorkspace(data),
    onSuccess: () => {
      navigate('/');
    },
  });

  function onSubmit(data: OnboardStep2FormInputs) {
    const { year, season, ...rest } = data;
    // const morningStartTime = rest.morningStartTime.replace(/[^\x20-\x7E]/g, '');
    // const morningEndTime = rest.morningEndTime.replace(/[^\x20-\x7E]/g, '');
    // const afternoonStartTime = rest.afternoonStartTime.replace(/[^\x20-\x7E]/g, '');
    // const afternoonEndTime = rest.afternoonEndTime.replace(/[^\x20-\x7E]/g, '');

    const submittedData = {
      ...workspaceDetailQuery.data,
      ...rest,
      // morningStartTime,
      // morningEndTime,
      // afternoonStartTime,
      // afternoonEndTime,
      currentTerm: {
        season: { id: getSelectValue(season) },
        year,
      },
    };
    dispatchStepper({ type: 'save_step_data', payload: submittedData });
    dispatchStepper({ type: 'next' });
    // updateWorkspaceMutation.mutate(submittedData);
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
        // height: 550,
      }}
    >
      <Select
        control={control}
        fieldName="season"
        options={seasonsQuery.data || []}
        size="small"
        required
        error={Boolean(errors.season) && errors.season.message === 'Required'}
      />
      <Controller
        name={'year'}
        control={control}
        render={({ field: { onChange, value, name, ref, ...field } }) => (
          <DatePicker
            label="Year"
            disablePast
            slotProps={{
              ...defaultSlotProps,
              textField: {
                ...defaultSlotProps.textField,
                error: Boolean(errors.year),
                helperText: errors.year?.message,
              },
            }}
            format="YYYY"
            views={['year']}
            onChange={(value) => {
              onChange(dayjs(value as any).format('YYYY'));
            }}
            value={dayjs(value)}
            inputRef={ref}
            {...field}
          />
        )}
        // defaultValue
      />
      {/* <TextField
        id="foundedYear"
        label="founded Year"
        size="small"
        sx={{ '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' } }}
        error={Boolean(errors.foundedYear)}
        helperText={errors.foundedYear?.message}
        {...register('foundedYear')}
      />
      <TextField
        id="slotDurationInMin"
        label="slot Duration In Min"
        size="small"
        sx={{ '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' } }}
        error={Boolean(errors.slotDurationInMin)}
        helperText={errors.slotDurationInMin?.message}
        {...register('slotDurationInMin')}
      />
      <TextField
        id="restTimeInMin"
        label="rest Time In Min"
        size="small"
        sx={{ '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' } }}
        error={Boolean(errors.restTimeInMin)}
        helperText={errors.restTimeInMin?.message}
        {...register('restTimeInMin')}
      />
      <TimeField
        label="morning Start Time"
        format="HH:mm:ss"
        slotProps={defaultSlotProps}
        // @ts-ignore
        error={Boolean(errors.morningStartTime)}
        helperText={errors.morningStartTime?.message}
        {...register('morningStartTime')}
      />
      <TimeField
        label="morning End Time"
        format="HH:mm:ss"
        slotProps={defaultSlotProps}
        // @ts-ignore
        error={Boolean(errors.morningEndTime)}
        helperText={errors.morningEndTime?.message}
        {...register('morningEndTime')}
      />
      <TimeField
        label="afternoon Start Time"
        format="HH:mm:ss"
        slotProps={defaultSlotProps}
        // @ts-ignore
        error={Boolean(errors.afternoonStartTime)}
        helperText={errors.afternoonStartTime?.message}
        {...register('afternoonStartTime')}
      />
      <TimeField
        label="afternoon End Time"
        format="HH:mm:ss"
        slotProps={defaultSlotProps}
        // @ts-ignore
        error={Boolean(errors.afternoonEndTime)}
        helperText={errors.afternoonEndTime?.message}
        {...register('afternoonEndTime')}
      /> */}
      <TextField
        id="emailSuffix"
        label="email Suffix"
        size="small"
        sx={{ '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' } }}
        error={Boolean(errors.emailSuffix)}
        helperText={errors.emailSuffix?.message}
        {...register('emailSuffix')}
      />
      <Box />
    </Box>
  );
}

export default OnboardStep2;
