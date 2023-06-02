import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import { Link } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, Season } from 'src/@types';
import { QueryKey, groupApis, syllabusApis, seasonApis, dataApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateOptions } from 'src/utils';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Button from '@mui/material/Button';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SuspenseLoader from 'src/components/SuspenseLoader';
import Modal from '@mui/material/Modal';
import { AxiosError } from 'axios';

const DATA_TEMPLATES = [
  { id: 'all', display: 'All' },
  { id: 'major', display: 'Major' },
  { id: 'specification', display: 'Specification' },
  { id: 'subject', display: 'Subject' },
  { id: 'syllabus', display: 'Syllabus' },
  { id: 'curriculum', display: 'Curriculum' },
  { id: 'curriculumPlan', display: 'Curriculum Plan' },
  { id: 'user', display: 'User' },
  { id: 'group', display: 'Group' },
];
function ImportDataPage() {
  const [templateAnchorEl, setTemplateAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const { dispatch } = useContext(ModalContext);

  const queryClient = useQueryClient();

  const importDataMutation = useMutation({
    mutationFn: (data: FormData) => dataApis.importData(data),
    onMutate: () => {
      dispatch({ type: 'close' });
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [QueryKey.Seasons] });
      toast.success(`Import Data successfully!`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response.data.message);
    },
  });
  // const columns = useMemo<MRT_ColumnDef<Season>[]>(
  //   () => [
  //     {
  //       header: 'Name',
  //       accessorKey: 'name',
  //       Cell: ({ cell, row }) => (
  //         <MuiLink component={Link} to={`${row.id}`}>
  //           {cell.getValue<string>()}
  //         </MuiLink>
  //       ),
  //       enableHiding: false,
  //     },
  //     {
  //       header: 'Ordinal number',
  //       accessorKey: 'ordinalNumber',
  //     },
  //     {
  //       header: 'Start month',
  //       accessorKey: 'startMonth',
  //     },
  //     {
  //       header: 'End month',
  //       accessorKey: 'endMonth',
  //     },
  //   ],
  //   [],
  // );
  function onCreateEntity() {}
  // const getTemplateQuery = useQuery({
  //   queryKey: [QueryKey.Data, { entity: 'all' }],
  //   queryFn: ({ queryKey: [, params] }) => dataApis.getTemplate(params as { entity: string }),
  //   enabled: false,
  //   onSuccess: (blob) => {
  //     const urlObj = URL.createObjectURL(new Blob([blob]));

  //     const link = document.createElement('a');
  //     link.href = urlObj;
  //     link.download = 'template.xlsx';
  //     link.click();

  //     URL.revokeObjectURL(urlObj);
  //   },
  // });
  async function handleDownloadTemplateClick(e) {
    // getTemplateQuery.refetch();
    setTemplateAnchorEl(e.currentTarget);
  }
  async function handleTemplateItemClick(templateName: string) {
    const params = { entity: templateName };
    setTemplateAnchorEl(null);
    try {
      const blob = await dataApis.getTemplate(params);
      const urlObj = URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = urlObj;
      link.download = `${templateName}.xlsx`;
      link.click();

      URL.revokeObjectURL(urlObj);
    } catch (err) {}
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target?.files[0];
    setSelectedFile(event.target.value);
    if (!file) return;
    dispatch({
      type: 'open_confirm',
      payload: {
        title: 'Import Data',
        content: () => (
          <Typography variant="subtitle1" color="initial">
            Do you want to import <strong>{file.name}</strong>?
          </Typography>
        ),
        confirmTitle: 'Apply',
      },
      onConfirm: () => {
        const formData = new FormData();
        formData.append('file', file, event.target.value);
        importDataMutation.mutate(formData);
      },
    });
  }

  return (
    <Box>
      <Helmet>
        <title>FUniverse | Data</title>
      </Helmet>
      <Paper sx={{ p: 2, marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Data
        </Typography>
        <Box sx={{ display: 'flex', gap: '0 10px' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileUploadIcon />}
            component="label"
            onClick={() => setSelectedFile('')}
          >
            Import
            <input
              hidden
              accept="*"
              multiple
              type="file"
              onChange={handleFileChange}
              value={selectedFile}
            />
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleDownloadTemplateClick}
          >
            Download Template
          </Button>
          <Popover
            open={Boolean(templateAnchorEl)}
            anchorEl={templateAnchorEl}
            onClose={() => setTemplateAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <List sx={{ p: 1, width: '192px' }}>
              {DATA_TEMPLATES.map(({ id, display }) => (
                <ListItemButton key={id} onClick={() => handleTemplateItemClick(id)}>
                  <ListItemText primary={`${display}`} />
                </ListItemButton>
              ))}
            </List>
          </Popover>
        </Box>
        <Modal open={importDataMutation.isLoading}>
          <Box>
            <SuspenseLoader />
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
}

export default ImportDataPage;
