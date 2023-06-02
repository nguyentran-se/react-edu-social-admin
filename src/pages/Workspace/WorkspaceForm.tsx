import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
// import Select from 'react-select';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Workspace } from 'src/@types';
import { QueryKey, subjectApis, termApis } from 'src/apis';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import dayjs from 'dayjs';
// import Select from 'react-select';
// const WorkspaceSchema = z.object({
//   name: z.string().min(1),
//   code: z.string().min(1),
//   combo: z.boolean().optional(),
//   active: z.boolean(),

// }).refine((obj, ctx) => {
//   if(obj.combo) return
// });
const timeRegex = /.*\d{2}.*\d{2}.*/;

const WorkspaceSchema = z.object({
  name: z.string(),
  code: z.string(),
  slotDurationInMin: z.coerce.number().positive(),
  restTimeInMin: z.coerce.number().positive(),
  morningStartTime: z.string().regex(timeRegex),
  morningEndTime: z.string().regex(timeRegex),
  afternoonStartTime: z.string().regex(timeRegex),
  afternoonEndTime: z.string().regex(timeRegex),
});
const defaultSlotProps: any = {
  textField: {
    sx: {
      width: '100%',
      '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' },
    },
    // size: 'small',
  },
  openPickerButton: {
    // size: 'small',
  },
};

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type SubjectFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type WorkspaceFormInputs = z.infer<typeof WorkspaceSchema>;
interface WorkspaceFormProps {
  defaultValues?: WorkspaceFormBody;
}
export type WorkspaceFormBody = WorkspaceFormInputs & { id: number };
function WorkspaceForm({ defaultValues }: WorkspaceFormProps) {
  const queryClient = useQueryClient();

  const { dispatch } = useContext(ModalContext);

  const updateWorkspaceMutation = useMutation({
    mutationFn: (data: any) => termApis.updateWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Workspace] });
      toast.success('Update Workspace successfully!');
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
  } = useForm<WorkspaceFormInputs>({
    mode: 'all',
    resolver: zodResolver(WorkspaceSchema),
    defaultValues: {
      // active: true,
      // subjects: null,
      // combo: false,
      ...defaultValues,
    },
  });
  // console.log('🚀 ~ defaultValues:', defaultValues);

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
    const body: WorkspaceFormBody = {
      ...defaultValues,
      ...data,
    };
    updateWorkspaceMutation.mutate(body);
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
          height: 550,
        }}
      >
        <TextField
          id="name"
          label="Name"
          // size="small"
          sx={{ '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' } }}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <TextField
          id="code"
          label="Code"
          // size="small"
          sx={{ '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' } }}
          error={Boolean(errors.code)}
          helperText={errors.code?.message}
          {...register('code')}
        />
        <TextField
          id="slotDurationInMin"
          label="slot Duration"
          InputProps={{
            endAdornment: <InputAdornment position="end">min</InputAdornment>,
          }}
          // size="small"
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
          // size="small"
          sx={{ '&.MuiFormControl-root': { minHeight: 38, mb: '16px !important' } }}
          error={Boolean(errors.restTimeInMin)}
          helperText={errors.restTimeInMin?.message}
          {...register('restTimeInMin')}
        />
        <Controller
          name="morningStartTime"
          control={control}
          render={({ field: { onChange, value, name, ref, ...field } }) => {
            return (
              <TimeField
                inputRef={ref}
                label="morning Start Time"
                format="HH:mm:ss"
                slotProps={defaultSlotProps}
                // @ts-ignore
                error={Boolean(errors.morningStartTime)}
                helperText={errors.morningStartTime?.message}
                value={dayjs(value, 'HH:mm:ss')}
                // defaultValue={dayjs(value, "HH:mm:ss")}
                onChange={(time) => {
                  const formattedTime = dayjs(time).format('HH:mm:ss');
                  onChange(formattedTime);
                  console.log(formattedTime);
                }}
                {...field}
              />
            );
          }}
        />
        <Controller
          name="morningEndTime"
          control={control}
          render={({ field: { onChange, value, name, ref, ...field } }) => {
            return (
              <TimeField
                inputRef={ref}
                label="morning End Time"
                format="HH:mm:ss"
                slotProps={defaultSlotProps}
                // @ts-ignore
                error={Boolean(errors.morningEndTime)}
                helperText={errors.morningEndTime?.message}
                value={dayjs(value, 'HH:mm:ss')}
                onChange={(time) => {
                  const formattedTime = dayjs(time).format('HH:mm:ss');
                  onChange(formattedTime);
                }}
                {...field}
              />
            );
          }}
        />
        <Controller
          name="afternoonStartTime"
          control={control}
          render={({ field: { onChange, value, name, ref, ...field } }) => {
            return (
              <TimeField
                inputRef={ref}
                label="afternoon Start Time"
                format="HH:mm:ss"
                slotProps={defaultSlotProps}
                // @ts-ignore
                error={Boolean(errors.afternoonStartTime)}
                helperText={errors.afternoonStartTime?.message}
                value={dayjs(value, 'HH:mm:ss')}
                onChange={(time) => {
                  const formattedTime = dayjs(time).format('HH:mm:ss');
                  onChange(formattedTime);
                }}
                {...field}
              />
            );
          }}
        />
        <Controller
          name="afternoonEndTime"
          control={control}
          render={({ field: { onChange, value, name, ref, ...field } }) => {
            return (
              <TimeField
                inputRef={ref}
                label="afternoon End Time"
                format="HH:mm:ss"
                slotProps={defaultSlotProps}
                // @ts-ignore
                error={Boolean(errors.afternoonEndTime)}
                helperText={errors.afternoonEndTime?.message}
                value={dayjs(value, 'HH:mm:ss')}
                onChange={(time) => {
                  const formattedTime = dayjs(time).format('HH:mm:ss');
                  onChange(formattedTime);
                }}
                {...field}
              />
            );
          }}
        />
        <Box />
      </Box>
    </>
  );
}
export default WorkspaceForm;
