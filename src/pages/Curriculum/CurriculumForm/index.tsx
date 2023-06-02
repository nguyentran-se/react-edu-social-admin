import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import SuspenseLoader from 'src/components/SuspenseLoader';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { Curriculum, CurriculumSyllabus } from 'src/@types';
import { QueryKey, curriculumApis, searchApis, seasonApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import Select from 'src/components/Select';
import { ModalContext } from 'src/contexts/ModalContext';
import { getSelectValue } from 'src/utils';
import { z } from 'zod';
import { toast } from 'react-toastify';

interface CurriculumFormPageProps {
  defaultValues?: CurriculumFormInputs;
}
// const seasonOptions = [
//   { value: 'SPRING', label: 'Spring' },
//   { value: 'SUMMER', label: 'Summer' },
//   { value: 'FALL', label: 'Fall' },
// ] as const;

export type CurriculumBody = {
  id?: number;
  schoolYear: string;
  description: string;
  // major: { id: number };
  specialization: { id: number };
  startedTerm: { season: { id: number }; year: string };
  noSemester: number;
  // active: boolean;
};
const CurriculumSchema = z.object({
  // schoolYear: z.string().min(1),
  description: z.string(),
  // major: z
  //   .number()
  //   .positive()
  //   .or(z.object({ value: z.number().positive(), label: z.string() })),
  specialization: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  noSemester: z.coerce.number().positive(),
  season: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  year: z.coerce
    .number()
    .positive()
    .refine((value) => value < new Date().getFullYear() + 20 && value > new Date().getFullYear(), {
      message: 'Year must be greater than CURRENT YEAR and less than next 20 years',
    }),
  // active: z.boolean(),
});
export type CurriculumFormInputs = z.infer<typeof CurriculumSchema>;

function CurriculumFormPage({
  defaultValues,
}: {
  defaultValues?: CurriculumFormInputs & { id: number };
}) {
  // console.log('🚀 ~ defaultValues:', defaultValues);
  const navigate = useNavigate();
  const { dispatch } = useContext(ModalContext);
  const queryClient = useQueryClient();
  const location = useLocation();

  const mutation = useMutation<Curriculum, unknown, CurriculumBody, unknown>({
    mutationFn: (body) =>
      body.id ? curriculumApis.updateCurriculum(body) : curriculumApis.createCurriculum(body),
    onSuccess: (data) => {
      // navigate(-1);
      queryClient.invalidateQueries({ queryKey: [QueryKey.Curricula, 'slug'] });
      dispatch({ type: 'close' });
      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} Curriculum successfully!`);
      if (!defaultValues?.id) navigate(`/curricula/${data}`);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<CurriculumFormInputs>({
    mode: 'all',
    resolver: zodResolver(CurriculumSchema),
    defaultValues: {
      // active: true,
      ...defaultValues,
    },
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: defaultValues?.id ? [QueryKey.Curricula, defaultValues?.id] : [QueryKey.Curricula],
    queryFn: () => curriculumApis.getCurriculum(defaultValues?.id),
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: Boolean(defaultValues?.id),
    cacheTime: 0,
    onSuccess: (newData) => {
      // const defaultValues: CurriculumFormInputs = newData
      //   ? {
      //       ...newData,
      //       subject: {
      //         label: newData.subject.name,
      //         value: newData.subject.id,
      //       },
      //     }
      //   : {};
      // reset(defaultValues);
    },
  });
  const seasonsQuery = useQuery({
    queryKey: [QueryKey.Seasons],
    queryFn: seasonApis.getSeasons,
  });
  const seasonOptions = seasonsQuery.data?.map((s) => ({ label: s.name, value: s.id }));
  function handleClose() {
    // navigate(getPreviousPathSlash(location.pathname));
    navigate(-1);
  }
  function onSubmit(data: CurriculumFormInputs) {
    const { season, year, ...rest } = data;
    const body: CurriculumBody = {
      ...defaultValues,
      ...rest,
      // major: { id: getSelectValue(data.major) },
      specialization: { id: getSelectValue(data.specialization) },
      startedTerm: {
        season: { id: getSelectValue(data.season) },
        year: `${getSelectValue(data.year)}`,
      },
    } as CurriculumBody;

    if (defaultValues?.id) body.id = defaultValues.id;
    // console.log('🚀 ~ data:', body);
    mutation.mutate(body);
  }
  // console.log(errors);

  if (isLoading && defaultValues?.id)
    return (
      <Box sx={{ display: 'flex' }}>
        <SuspenseLoader />
      </Box>
    );

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
      {/* <TextField
        label="School Year"
        required
        error={Boolean(errors.schoolYear)}
        helperText={errors.schoolYear?.message}
        {...register('schoolYear')}
      /> */}
      {/* <AsyncSelect
        fieldName="major"
        control={control}
        required
        // isMulti
        promiseOptions={(input) =>
          searchApis.search({ entity: 'major', field: 'name', value: input })
        }
        error={Boolean(errors.major)}
      /> */}
      <AsyncSelect
        readOnly={Boolean(defaultValues?.id)}
        fieldName="specialization"
        control={control}
        required
        // isMulti
        promiseOptions={(input) =>
          searchApis.search({ entity: 'specialization', field: 'name', value: input })
        }
        error={Boolean(errors.specialization)}
      />
      <TextField
        label="No. Semester"
        type="number"
        required
        error={Boolean(errors.noSemester)}
        helperText={errors.noSemester?.message}
        {...register('noSemester')}
      />
      <Select
        control={control}
        fieldName="season"
        options={seasonOptions ?? []}
        required
        error={Boolean(errors.season) && errors.season.message === 'Required'}
        // defaultValue={defaultValues.season ?? ''}
      />
      <TextField
        label="Year"
        type="number"
        required
        error={Boolean(errors.year)}
        helperText={errors.year?.message}
        {...register('year')}
      />
      <TextField
        label="Description"
        error={Boolean(errors.description)}
        multiline
        rows={3}
        sx={{ marginBottom: '20px !important' }}
        helperText={errors.description?.message}
        {...register('description')}
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

export default CurriculumFormPage;
const CurriculumSyllabusSchema = z.object({
  syllabus: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  semester: z.coerce.number().positive(),
});
type CurriculumSyllabusFormInputs = z.infer<typeof CurriculumSyllabusSchema>;
function CurriculumSyllabusForm({
  defaultValues,
  curriculumId,
}: {
  defaultValues?: any;
  curriculumId: any;
}) {
  const queryClient = useQueryClient();

  const { dispatch } = useContext(ModalContext);
  const mutation = useMutation<CurriculumSyllabus, unknown, any, unknown>({
    mutationFn: (body) =>
      body.id
        ? curriculumApis.updateCurriculumSyllabus(curriculumId, body)
        : curriculumApis.createCurriculumSyllabus(curriculumId, body),
    onSuccess: (data) => {
      toast.success(
        `${defaultValues?.id ? 'Update' : 'Add'} Syllabus into Curriculum successfully!`,
      );
      queryClient.invalidateQueries({
        queryKey: [QueryKey.Curricula, 'slug', QueryKey.Syllabi],
      });
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
  } = useForm({
    mode: 'all',
    resolver: zodResolver(CurriculumSyllabusSchema),
    defaultValues: {
      ...defaultValues,
    },
  });
  // console.log('🚀 ~ errors:', errors);
  function onSubmit(data) {
    const body = {
      ...data,
      syllabus: {
        id: getSelectValue(data.syllabus),
      },
    };
    // console.log('🚀 ~ body:', body);
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
        '& .MuiTextField-root': { m: 1, width: '100%', paddingBottom: 2 },
        // height: 400,
      }}
    >
      <AsyncSelect
        readOnly={Boolean(defaultValues?.id)}
        fieldName="syllabus"
        control={control}
        required
        promiseOptions={
          (input) =>
            searchApis.searchSyllabus({
              id: curriculumId,
              value: input,
              type: 'curriculum',
            })
          // searchApis.search({
          //   entity: 'syllabus',
          //   field: ['isSyllabusCombo', 'name'],
          //   value: [false, input],
          //   operator: ['bool', 'like'],
          // })
        }
        error={Boolean(errors.syllabus)}
      />
      <TextField
        label="Semester"
        type="number"
        required
        error={Boolean(errors.semester)}
        helperText={errors.semester?.message}
        autoFocus={false}
        {...register('semester')}
      />
    </Box>
  );
}
export { CurriculumSyllabusForm };
