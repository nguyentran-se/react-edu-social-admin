import React, { useContext, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKey, groupApis } from 'src/apis';
import { termApis } from 'src/apis/termApis';
import Box from '@mui/material/Box';
import { useRefState } from 'src/hooks';
import SuspenseLoader from 'src/components/SuspenseLoader';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { useFieldArray, useForm } from 'react-hook-form';
import { ClassSlot, PrepareGroup, User, WeekDay } from 'src/@types';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import { useTheme, styled } from '@mui/material/styles';
import Select from 'src/components/Select';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import Popper from 'src/components/Popper';
import { useStepperContext } from 'src/contexts/StepperContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';
import { ModalContext } from 'src/contexts/ModalContext';
const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  border: 'none !important',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  // backgroundColor:
  //   theme.palette.mode === 'dark'
  //     ? 'rgba(255, 255, 255, .05)'
  //     : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));
const orderOptions = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
];
const dayOptions = [
  { label: 'Monday', value: WeekDay.Monday },
  { label: 'Tuesday', value: WeekDay.Tuesday },
  { label: 'Wednesday', value: WeekDay.Wednesday },
  { label: 'Thursday', value: WeekDay.Thursday },
  { label: 'Friday', value: WeekDay.Friday },
  { label: 'Saturday', value: WeekDay.Saturday },
  { label: 'Sunday', value: WeekDay.Sunday },
];
function Step1() {
  // const { data: nextData, isLoading } = useQuery({
  //   queryKey: [QueryKey.Terms, 'next'],
  //   queryFn: () => termApis.getTerm('next'),
  // });
  // const [selectedDateRef, setSelectedDate] = useRefState();
  // const [groupInputs, setGroupInputs] = useState<Record<string, { id: string }[]>>();
  const theme = useTheme();
  const { dispatch } = useContext(ModalContext);

  const { data: prepareGroups, isLoading } = useQuery({
    queryKey: [QueryKey.Terms, QueryKey.Prepare, QueryKey.Groups],
    queryFn: termApis.getGroups,
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response.data.message);
      dispatch({ type: 'close' });
      navigate('/');
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
  } = useForm({});
  const { fields, insert, append, remove } = useFieldArray({
    control,
    name: 'slot',
  });
  const [selectedTeachers, setSelectedTeachers] = useState<{ groupId: number; teacher: User }[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dispatchStepper } = useStepperContext();
  const assignTeacherMutation = useMutation({
    mutationFn: (body: { groupId; teacherId }[]) => groupApis.assignTeacher(body),
    onError: () => {
      toast.error(`Create slots failed!`);
      setIsSubmitting(false);
    },
  });
  const navigate = useNavigate();
  const createClassSlotMutation = useMutation({
    mutationFn: (body: ClassSlot[]) => groupApis.createGroupSlotAuto(body),
    onError: () => {
      toast.error(`Create slots failed!`);
      setIsSubmitting(false);
    },
    onSuccess: () => {
      setIsSubmitting(false);
      toast.success(`Create slots successfully!`);
      navigate('/');
    },
  });
  const { data: nextData } = useQuery({
    queryKey: [QueryKey.Terms, 'next'],
    queryFn: () => termApis.getTerm('next'),
  });
  if (isLoading)
    return (
      <Box>
        <SuspenseLoader />
      </Box>
    );

  function handleAddSlotClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    group: PrepareGroup,
  ) {
    event.stopPropagation();
    const gid = group.id;
    append({ gid, order: '', dayOfWeek: '', room: '' });
  }

  function handleDeleteInputClick(group: PrepareGroup, index: number) {
    remove(index);
  }

  function onSubmit(data) {
    const slot = data.slot;
    if (!slot) return;

    setIsSubmitting(true);

    const startDate = dayjs(nextData.startDate).format('YYYY-MM-DD');
    const transformedSlot = transformClassSlot(slot).map((s) => ({ ...s, startDate }));
    const transformedTeachers = selectedTeachers.map((t) => ({
      groupId: t.groupId,
      teacherId: t.teacher.id,
    }));
    assignTeacherMutation.mutate(transformedTeachers, {
      onSuccess: () => {
        createClassSlotMutation.mutate(transformedSlot);
      },
    });
  }
  function handleSelect(group: PrepareGroup, user: User) {
    const selected = { groupId: group.id, teacher: user };
    const existedTeacherIndex = selectedTeachers.findIndex(
      ({ groupId, teacher }) => groupId === group.id,
    );
    if (existedTeacherIndex === -1) {
      setSelectedTeachers([...selectedTeachers, selected]);
    } else {
      const newTeachers = [...selectedTeachers];
      newTeachers[existedTeacherIndex] = selected;
      setSelectedTeachers(newTeachers);
    }
  }
  // const groupIds = groupInputs && Object.keys(groupInputs).map(Number);
  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      id="slotsForm"
      autoComplete="off"
      noValidate
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%' },
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        {prepareGroups.map((g) => (
          <Accordion
            key={g.id}
            defaultExpanded
            sx={{
              border: `1px solid ${theme.colors.alpha.black[30]}`,
              '& .MuiAccordionSummary-root': { pt: 1 },
            }}
          >
            <AccordionSummary>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Typography variant="h5" color="initial">
                  {g.name}
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                  <Popper onSelect={(user) => handleSelect(g, user)}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        py: '4px',
                        '&:hover': {
                          // background: 'unset',
                          // textDecoration: 'underline',
                        },
                      }}
                    >
                      {selectedTeachers.find((t) => t.groupId === g.id)
                        ? `${selectedTeachers.find((t) => t.groupId === g.id).teacher.name}`
                        : 'Select Teacher'}
                    </Button>
                  </Popper>
                  <Button
                    sx={{
                      py: '7px',
                      '&:hover': {
                        // background: 'unset',
                        // textDecoration: 'underline',
                      },
                    }}
                    variant="text"
                    color="primary"
                    startIcon={<AddOutlined />}
                    size="small"
                    onClick={(e) => handleAddSlotClick(e, g)}
                  >
                    Add slot
                  </Button>
                </Box>
              </Box>
            </AccordionSummary>
            <Box sx={{ px: 2 }}>
              {fields.map(
                (gI, index) =>
                  g.id === (gI as any).gid && (
                    <Box
                      key={`${gI.id}`}
                      sx={{ display: 'flex', alignItems: 'center', gap: '0 24px' }}
                    >
                      <Select
                        control={control}
                        options={orderOptions}
                        fieldName={`slot[${index}].order`}
                        required
                        error={false}
                        size="small"
                        label="Order"
                      />
                      <Select
                        control={control}
                        options={dayOptions}
                        fieldName={`slot[${index}].dayOfWeek`}
                        required
                        error={false}
                        size="small"
                        label="Day of week"
                      />
                      <TextField
                        id="room"
                        label="Room"
                        size="small"
                        sx={{ '&.MuiFormControl-root': { minHeight: 38 } }}
                        {...register(`slot[${index}].room`)}
                      />
                      <IconButton
                        onClick={() => handleDeleteInputClick(g, index)}
                        size="small"
                        sx={{ borderRadius: '50%' }}
                        color="secondary"
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Box>
                  ),
              )}
            </Box>
          </Accordion>
        ))}
        {/* <Button variant="outlined" color="primary" type="submit">
          submit
        </Button> */}
      </Box>
      <Modal open={isSubmitting}>
        <Box>
          <SuspenseLoader />
        </Box>
      </Modal>
    </Box>
  );
}

export default Step1;

function transformClassSlot(data: any[]): ClassSlot[] {
  return Object.values(
    data.reduce((acc, curr) => {
      const { gid, ...rest } = curr;
      if (!acc[gid]) {
        acc[gid] = { groupId: gid, slots: [] };
      }
      acc[gid].slots.push(rest);
      return acc;
    }, {}),
  );
}
