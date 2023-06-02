import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
// import Select from 'react-select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { Syllabus } from 'src/@types';
import { QueryKey, searchApis, syllabusApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import { ModalContext } from 'src/contexts/ModalContext';
import { getSelectValue } from 'src/utils';
import { z } from 'zod';
import { toast } from 'react-toastify';

interface SyllabusFormPageProps {
  defaultValues?: SyllabusFormInputs;
}

export type SyllabusBody = Omit<SyllabusFormInputs, 'subject' | 'preRequisite'> & {
  id?: number;
  subject: { id: number };
  preRequisite: { id: number }[];
};
const SyllabusSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  subject: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  noCredit: z.coerce.number().positive(),
  noSlot: z.coerce.number().positive(),
  // duration: z.coerce.number().positive(),
  description: z.string(),
  minAvgMarkToPass: z.coerce.number().positive(),
  preRequisite: z.array(z.number()).optional().nullable(),

  // active: z.boolean(),
});
type SyllabusFormInputs = z.infer<typeof SyllabusSchema>;
function SyllabusFormPage({
  syllabusId,
  defaultValues,
}: {
  syllabusId?: any;
  defaultValues?: any;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useContext(ModalContext);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<SyllabusFormInputs>({
    mode: 'all',
    resolver: zodResolver(SyllabusSchema),
    defaultValues: {
      // active: true,
      preRequisite: null,
      ...defaultValues,
    },
  });
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: [QueryKey.Syllabi, syllabusId],
  //   queryFn: () => syllabusApis.getSyllabus(syllabusId),
  //   refetchOnWindowFocus: false,
  //   retry: 0,
  //   enabled: Boolean(syllabusId),
  //   cacheTime: 0,
  //   onSuccess: (newData) => {
  //     const defaultValues: SyllabusFormInputs = newData
  //     ? {
  //       ...newData,
  //       subject: {
  //         label: newData.subject.name,
  //         value: newData.subject.id,
  //       },
  //     }
  //     : {};
  //     console.log("🚀 ~ defaultValues:", defaultValues)
  //     reset(defaultValues);
  //   },
  // });
  const mutation = useMutation<Syllabus, unknown, SyllabusBody, unknown>({
    mutationFn: (body) =>
      body.id ? syllabusApis.updateSyllabus(body) : syllabusApis.createSyllabus(body),
    onSuccess: (response) => {
      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} Syllabus successfully!`);
      if (defaultValues?.id) {
        queryClient.invalidateQueries({ queryKey: [QueryKey.Syllabi, 'slug'] });
        // navigate(`${response}`);
      } else queryClient.invalidateQueries({ queryKey: [QueryKey.Syllabi] });
      dispatch({ type: 'close' });
    },
  });
  function onSubmit(data: SyllabusFormInputs) {
    const { subject, ...rest } = data;
    // console.log('🚀 ~ data:', data);
    const body: SyllabusBody = {
      ...rest,
      //TODO: Enhance type subject here
      subject: { id: getSelectValue(subject as any) as number },
    } as any;
    if (data.preRequisite) body.preRequisite = data.preRequisite.map((x) => ({ id: x }));
    if (syllabusId) body.id = +syllabusId;
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
        '& .MuiTextField-root': { m: 1, width: '100%', paddingBottom: 2 },
        // height: 400,
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
      <AsyncSelect
        fieldName="subject"
        control={control}
        required
        // isMulti
        promiseOptions={(input) =>
          searchApis.search({ entity: 'subject', field: 'name', value: input })
        }
        error={Boolean(errors.subject)}
      />
      <AsyncSelect
        fieldName="preRequisite"
        control={control}
        isMulti
        promiseOptions={(input) =>
          searchApis.search({ entity: 'syllabus', field: 'name', value: input })
        }
        error={Boolean(errors.preRequisite)}
      />
      <TextField
        label="Credit"
        type="number"
        required
        error={Boolean(errors.noCredit)}
        helperText={errors.noCredit?.message}
        {...register('noCredit')}
      />
      <TextField
        label="Slot"
        type="number"
        required
        error={Boolean(errors.noSlot)}
        helperText={errors.noSlot?.message}
        {...register('noSlot')}
      />
      {/* <TextField
        label="Duration"
        type="number"
        required
        error={Boolean(errors.duration)}
        helperText={errors.duration?.message}
        {...register('duration')}
      /> */}
      <TextField
        label="Description"
        error={Boolean(errors.description)}
        multiline
        rows={3}
        sx={{ marginBottom: '20px !important' }}
        helperText={errors.description?.message}
        {...register('description')}
      />
      <TextField
        label="Min Avg Mark To Pass"
        type="number"
        required
        error={Boolean(errors.minAvgMarkToPass)}
        helperText={errors.minAvgMarkToPass?.message}
        {...register('minAvgMarkToPass')}
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
      {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0 16px' }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box> */}
    </Box>
  );
}

export default SyllabusFormPage;
