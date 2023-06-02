import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, groupApis, seasonApis } from 'src/apis';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { Season } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
import SeasonForm from './SeasonForm';
import { ModalContext } from 'src/contexts/ModalContext';
import { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import Table from 'src/components/Table';
import SuspenseLoader from 'src/components/SuspenseLoader';

function transfromSeasonDetail(data: Season) {
  return {
    name: { label: 'Name', value: data.name },
    ordinalNumber: { label: 'Ordinal Number', value: data.ordinalNumber },
    startMonth: { label: 'Start Month', value: data.startMonth },
    endMonth: { label: 'End Month', value: data.endMonth },
  };
}

function SeasonDetailPage() {
  const { slug } = useParams();
  const { dispatch } = useContext(ModalContext);
  const {
    data: seasonDetailData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QueryKey.Seasons, 'slug'],
    queryFn: () => seasonApis.getSeason(slug),
    // select: (data) => transfromSeasonDetail(data),
    enabled: Boolean(slug),
  });

  function onEditSeason() {
    const defaultValues = {
      ...seasonDetailData,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Season in Curriculum',
        content: () => <SeasonForm defaultValues={defaultValues as any} />,
      },
      onCreateOrSave: () => {},
    });
  }

  if (isLoading) return <SuspenseLoader />;
  if (isError) {
    //TODO: Handle error case here
    return <div>This ID does not exist!</div>;
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Season Detail
        </Typography>
        {/* <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditSeason}>
          Edit
        </Button> */}
      </Box>
      <HeaderRowTable data={transfromSeasonDetail(seasonDetailData)} />
    </Box>
  );
}

export default SeasonDetailPage;
