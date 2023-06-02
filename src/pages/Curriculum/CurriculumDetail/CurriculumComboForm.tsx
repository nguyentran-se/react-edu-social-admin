import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
// import Select from 'react-select';
import { CurriculumCombo, GroupType, Syllabus } from 'src/@types';
import { QueryKey, comboApis, curriculumApis, searchApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
const CurriculumComboSchema = z.object({
  combo: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  semester: z.array(z.coerce.number().positive()),
  // name: z.string().min(1),
  // code: z.string().min(1),
  // syllabi: z.array(z.number()).nullable(),
  // active: z.boolean(),
});

export type CurriculumComboFormInputs = z.infer<typeof CurriculumComboSchema>;
interface CurriculumComboFormProps {
  curriculumId: number | string;
  defaultValues?: any;
}
// export type CurriculumComboFormBody = CurriculumComboFormInputs & { id: number };
export type CurriculumComboFormBody = {
  combo: { id: number };
  comboPlans: { syllabus: { id: number }; semester: number }[];
};
interface SelectedCombo {
  value: number;
  label: string;
  syllabi: Syllabus[];
}
function CurriculumComboForm({ curriculumId, defaultValues }: CurriculumComboFormProps) {
  const queryClient = useQueryClient();

  const { dispatch } = useContext(ModalContext);
  const [selectedCombo, setSelectedCombo] = useState<SelectedCombo>({
    value: 0,
    label: '',
    syllabi: [],
  });
  // const mutation = useMutation<CurriculumCombo, unknown, typeof defaultValues, unknown>({
  //   mutationFn: (body) => (body.id ? comboApis.updateCurriculumCombo(body) : comboApis.createCurriculumCombo(body)),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [QueryKey.CurriculumCombos] });
  //     toast.success(`${curriculumId ? 'Update' : 'Create'} CurriculumCombo successfully!`);
  //     dispatch({ type: 'close' });
  //   },
  // });
  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm<CurriculumComboFormInputs>({
    mode: 'all',
    resolver: zodResolver(CurriculumComboSchema),
    defaultValues: {
      // active: true,
      // syllabi: null,
      ...defaultValues,
      semester: defaultValues?.comboPlans ? defaultValues.comboPlans.map((cP) => cP.semester) : [],
    },
  });
  // Feat: Update curriculum combo
  const createComboMutation = useMutation<any, any, CurriculumComboFormBody, any>({
    mutationFn: (body) => curriculumApis.createCurriculumCombo(curriculumId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Curricula, 'slug', QueryKey.Combos] });
      toast.success(`Add Combo successfully!`);
      dispatch({ type: 'close' });
    },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    // @ts-ignore
    name: 'semester' as any, // unique name for your Field Array
  });

  useEffect(() => {
    clearErrors();
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  function onSubmit(data) {
    // console.log('data: ', curriculumId, data);
    const body: CurriculumComboFormBody = {
      // ...data,
      combo: { id: selectedCombo.value },
      comboPlans: selectedCombo.syllabi.map((s, index) => ({
        syllabus: { id: s.id },
        semester: data.semester[index],
      })),
      // syllabi: data.syllabi.map((x) => ({ id: x })),
    };
    // console.log('🚀 ~ body:', body);

    // if (curriculumId) body.id = curriculumId;
    createComboMutation.mutate(body);
  }

  // console.log('🚀 ~ defaultValues', defaultValues);
  // console.log('🚀 ~ errors', errors);
  function onRawSelect(selectedCombo: SelectedCombo) {
    // console.log(option)
    setSelectedCombo(selectedCombo);
  }
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
          height: 350,
        }}
      >
        <AsyncSelect
          fieldName="combo"
          control={control}
          required
          promiseOptions={(input) =>
            // searchApis.searchSyllabus({
            //   id: `${curriculumId}`,
            //   value: input,
            //   type: 'combo',
            // })
            searchApis.search({
              entity: 'combo',
              field: ['name', 'syllabi'],
              value: input,
              operator: ['like', 'nmt'],
            })
          }
          onRawSelect={onRawSelect}
          error={Boolean(errors.combo)}
        />
        {selectedCombo.syllabi.map((s, index) => (
          <TextField
            key={s.id}
            label={`Semester for ${s.name}`}
            required
            error={Boolean(errors.semester?.[index])}
            helperText={errors.semester?.[index]?.message}
            {...register(`semester.${index}` as any)}
          />
        ))}
        {/* <TextField
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
        /> */}
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
export default CurriculumComboForm;
