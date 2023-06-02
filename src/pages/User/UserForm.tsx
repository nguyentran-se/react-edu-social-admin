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
import { User, GroupType, UserRole } from 'src/@types';
import { QueryKey, searchApis, userApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSelectValue } from 'src/utils';
import { toast } from 'react-toastify';
const phoneRegExp = /^\+?\d{9,15}$/;
const roleOptions = [
  { value: UserRole.Student, label: 'Student' },
  { value: UserRole.Teacher, label: 'Teacher' },
  // { value: UserRole.SystemAdmin, label: 'System Admin' },
  // { value: UserRole.DepartmentAdmin, label: 'Department Admin' },
  { value: UserRole.DepartmentAdmin, label: 'Officer' },
  { value: UserRole.WorkspaceAdmin, label: 'Workspace Admin' },
] as const;
const UserSchema = z.object({
  name: z.string().min(1),
  // code: z.string().min(1),
  role: z.string().min(1),
  identifyNumber: z
    .string({ errorMap: () => ({ message: 'Number must contain exactly 9 or 12 characters' }) })
    .regex(/^(?:\d{9}|\d{12})$/),
  // schoolYear: z.string().min(1),
  personalMail: z.string().email(),
  // eduMail: z.string().email(),
  // avatar: z.string().min(1),
  phoneNumber: z.string().regex(phoneRegExp, { message: 'Invalid phone number' }),
  curriculum: z
    .object({ value: z.number(), label: z.string() })
    .or(z.number())
    .nullable()
    .optional(),
  // active: z.boolean(),
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type UserFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type UserFormInputs = z.infer<typeof UserSchema>;
type UserFormBody = UserFormInputs & { id: number };
interface UserFormProps {
  defaultValues?: UserFormBody;
}
function UserForm({ defaultValues }: UserFormProps) {
  const { dispatch } = useContext(ModalContext);
  const queryClient = useQueryClient();

  const mutation = useMutation<User, unknown, typeof defaultValues, unknown>({
    mutationFn: (body) => (body.id ? userApis.updateUser(body) : userApis.createUser(body)),
    onSuccess: () => {
      if (defaultValues?.id) queryClient.invalidateQueries({ queryKey: [QueryKey.Users, 'slug'] });
      else queryClient.invalidateQueries({ queryKey: [QueryKey.Users] });

      toast.success(`${defaultValues?.id ? 'Update' : 'Create'} User successfully!`);
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
  } = useForm<UserFormInputs>({
    mode: 'all',
    resolver: zodResolver(UserSchema),
    defaultValues: {
      // active: true,
      role: UserRole.Student,
      ...defaultValues,
    },
  });

  const watchRole = watch('role');

  function onSubmit(data) {
    // console.log('data: ', defaultValues?.id, data);
    const body: UserFormBody = {
      ...data,
      role: getSelectValue(data.role),
    };

    if (data.curriculum)
      body.curriculum = {
        id: getSelectValue(data.curriculum),
      } as any;
    if (data.role !== UserRole.Student) delete body.curriculum;
    if (defaultValues?.id) body.id = defaultValues?.id;
    mutation.mutate(body);
  }

  // console.log('🚀 ~ defaultValues', defaultValues);
  // console.log('🚀 ~ errors', errors);
  function promiseOptions(input) {
    return searchApis.search({
      entity: 'curriculum',
      field: 'name',
      value: input,
    });
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
          height: 500,
        }}
      >
        <TextField
          label="Name"
          required
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <Select
          control={control}
          fieldName="role"
          options={roleOptions}
          required
          error={Boolean(errors.role) && errors.role.message === 'Required'}
        />
        {/* <TextField
          label="Code"
          required
          error={Boolean(errors.code)}
          helperText={errors.code?.message}
          {...register('code')}
        /> */}
        <TextField
          label="Identify number"
          required
          error={Boolean(errors.identifyNumber)}
          helperText={errors.identifyNumber?.message}
          {...register('identifyNumber')}
        />
        <TextField
          label="Personal E-mail"
          required
          error={Boolean(errors.personalMail)}
          helperText={errors.personalMail?.message}
          {...register('personalMail')}
        />
        {/* <TextField
          label="Education E-mail"
          required
          error={Boolean(errors.eduMail)}
          helperText={errors.eduMail?.message}
          {...register('eduMail')}
        /> */}
        {/* <TextField
          label="Avatar"
          // required
          error={Boolean(errors.avatar)}
          helperText={errors.avatar?.message}
          {...register('avatar')}
        /> */}
        <TextField
          label="Phone Number"
          // required
          error={Boolean(errors.phoneNumber)}
          helperText={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
        {watchRole === UserRole.Student && (
          <AsyncSelect
            fieldName="curriculum"
            control={control}
            // required
            promiseOptions={promiseOptions}
            error={Boolean(errors.curriculum)}
          />
        )}
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
    </>
  );
}
export default UserForm;
