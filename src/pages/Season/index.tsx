import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import { Link } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, Season } from 'src/@types';
import { QueryKey, groupApis, syllabusApis, seasonApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SeasonForm, { SeasonFormInputs } from './SeasonForm';
import { generateOptions } from 'src/utils';
import { toast } from 'react-toastify';

function SeasonPage() {
  const { dispatch } = useContext(ModalContext);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Seasons],
    queryFn: seasonApis.getSeasons,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: (id) => seasonApis.deleteSeason(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Seasons] });
      toast.success(`Delete Season successfully!`);
      dispatch({ type: 'close' });
    },
  });
  const columns = useMemo<MRT_ColumnDef<Season>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        Cell: ({ cell, row }) => (
          <MuiLink component={Link} to={`${row.id}`}>
            {cell.getValue<string>()}
          </MuiLink>
        ),
        enableHiding: false,
      },
      {
        header: 'Ordinal number',
        accessorKey: 'ordinalNumber',
      },
      {
        header: 'Start month',
        accessorKey: 'startMonth',
      },
      {
        header: 'End month',
        accessorKey: 'endMonth',
      },
    ],
    [],
  );

  function onCreateEntity() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Create Season',
        content: () => <SeasonForm />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onEditEntity(row: MRT_Row<Season>) {
    const { original } = row;
    const defaultValues = {
      id: original.id,
      name: original.name,
      ordinalNumber: original.ordinalNumber,
      startMonth: original.startMonth,
      endMonth: original.endMonth,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Season',
        content: () => <SeasonForm defaultValues={{ ...(defaultValues as any) }} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onDeleteEntity(row: MRT_Row<Season>) {
    if (!row) return;
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        mutation.mutate(row.id as any);
      },
      payload: {
        // title: 'Delete this item',
        content: () => (
          <Typography variant="body1">
            Are you sure you want to deactivate {row.original.name}?
          </Typography>
        ),
      },
    });
  }

  return (
    <Box>
      <ListPageHeader entity="season" onCreateEntity={onCreateEntity} />
      <Table
        columns={columns}
        data={data}
        onEditEntity={onEditEntity}
        onDeleteEntity={onDeleteEntity}
        state={{ isLoading, showAlertBanner: isError, showProgressBars: isFetching }}
        getRowId={(originalRow: MRT_Row<Season>) => originalRow.id}
      />
    </Box>
  );
}

export default SeasonPage;
