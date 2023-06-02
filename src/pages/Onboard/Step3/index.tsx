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
import { appCookies, getSelectValue } from 'src/utils';
import dayjs from 'dayjs';
import InputAdornment from '@mui/material/InputAdornment';
const timeRegex = /.*\d{2}.*\d{2}.*/;
const OnboardStep3Schema = z
  .object({
    // season: z
    //   .number()
    //   .positive()
    //   .or(z.object({ value: z.number().positive(), label: z.string() })),
    // startDate: z.string(),
    foundedYear: z.coerce.number().int().positive(),
    slotDurationInMin: z.coerce.number().int().positive(),
    restTimeInMin: z.coerce.number().int().positive(),
    morningStartTime: z.string().regex(timeRegex),
    morningEndTime: z.string().regex(timeRegex),
    afternoonStartTime: z.string().regex(timeRegex),
    afternoonEndTime: z.string().regex(timeRegex),
    // emailSuffix: z.string().min(1),
  })
  // .transform((val) => {
  //   const morningStartTime = val.morningStartTime.replace(/[^\x20-\x7E]/g, '');
  //   const morningEndTime = val.morningEndTime.replace(/[^\x20-\x7E]/g, '');
  //   const afternoonStartTime = val.afternoonStartTime.replace(/[^\x20-\x7E]/g, '');
  //   const afternoonEndTime = val.afternoonEndTime.replace(/[^\x20-\x7E]/g, '');
  //   return {
  //     ...val,
  //     morningStartTime,
  //     morningEndTime,
  //     afternoonStartTime,
  //     afternoonEndTime,
  //   };
  // })
  .refine(
    (val) => {
      const morningStartTime = val.morningStartTime.replace(/[^\x20-\x7E]/g, '');
      const morningEndTime = val.morningEndTime.replace(/[^\x20-\x7E]/g, '');
      return dayjs(`2000-01-01 ${morningStartTime}`) < dayjs(`2000-01-01 ${morningEndTime}`);
    },
    {
      message: 'End date cannot be earlier than start date.',
      path: ['morningEndTime'], // path of error
    },
  )
  .refine(
    (val) => {
      const afternoonStartTime = val.afternoonStartTime.replace(/[^\x20-\x7E]/g, '');
      const afternoonEndTime = val.afternoonEndTime.replace(/[^\x20-\x7E]/g, '');
      return dayjs(`2000-01-01 ${afternoonStartTime}`) < dayjs(`2000-01-01 ${afternoonEndTime}`);
    },
    {
      message: 'End date cannot be earlier than start date.',
      path: ['afternoonEndTime'], // path of error
    },
  );
export type OnboardStep3FormInputs = z.infer<typeof OnboardStep3Schema>;
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
function OnboardStep3() {
  const { activeStep, dispatchStepper, data: step2Data } = useStepperContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm<OnboardStep3FormInputs>({
    mode: 'all',
    resolver: zodResolver(OnboardStep3Schema),
  });
  // console.log('🚀 ~ errors:', errors);

  // const createSessonsMutation = useMutation({
  //   mutationFn: (data: { season: CreateSeasonPayload[] }) => seasonApis.createWorkspaceSeason(data),
  //   onSuccess: () => {
  //     dispatchStepper({ type: 'change_status', payload: 'fulfilled' });
  //     dispatchStepper({ type: 'next' });
  //   },
  // });

  // const workspaceDetailQuery = useQuery({
  //   queryFn: termApis.getWorkspaceDetail,
  //   queryKey: ['workspace-detail'],
  // });

  const updateWorkspaceMutation = useMutation({
    mutationFn: (data: any) => termApis.updateWorkspace(data),
    onSuccess: () => {
      appCookies.setWorkspaceActive();
      window.location.href = '/';
    },
  });

  function onSubmit(data: OnboardStep3FormInputs) {
    const { ...rest } = data;
    const morningStartTime = rest.morningStartTime.replace(/[^\x20-\x7E]/g, '');
    const morningEndTime = rest.morningEndTime.replace(/[^\x20-\x7E]/g, '');
    const afternoonStartTime = rest.afternoonStartTime.replace(/[^\x20-\x7E]/g, '');
    const afternoonEndTime = rest.afternoonEndTime.replace(/[^\x20-\x7E]/g, '');

    const submittedData = {
      // ...workspaceDetailQuery.data,
      ...step2Data,
      ...rest,
      morningStartTime,
      morningEndTime,
      afternoonStartTime,
      afternoonEndTime,
      // currentTerm: {
      //   season: { id: getSelectValue(season) },
      //   startDate: startDate,
      // },
    };
    updateWorkspaceMutation.mutate(submittedData);
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
      <TextField
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
        label="slot Duration"
        InputProps={{
          endAdornment: <InputAdornment position="end">min</InputAdornment>,
        }}
        size="small"
        sx={{ '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' } }}
        error={Boolean(errors.slotDurationInMin)}
        helperText={errors.slotDurationInMin?.message}
        {...register('slotDurationInMin')}
      />
      <TextField
        id="restTimeInMin"
        label="rest Time"
        InputProps={{
          endAdornment: <InputAdornment position="end">min</InputAdornment>,
        }}
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
      />
      <Box />
    </Box>
  );
}

export default OnboardStep3;
