import React from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';

import { Syllabus } from 'src/@types';
interface HeaderRowTableProps {
  data: {
    [key: string]: {
      label: string;
      value: string | boolean | number;
    };
  };
}
function HeaderRowTable({ data }: HeaderRowTableProps) {
  return (
    <Paper sx={{ overflow: 'hidden' }}>
      <Table>
        <TableBody
          sx={{
            '& tr::first-of-type th': {
              borderTopLeftRadius: '10px',
            },
            '& td::first-of-type': {
              borderBottomLeftRadius: '10px',
            },
            '& td:last-child': {
              borderBottomRightRadius: '10px',
            },
            '& tr:last-child th': {
              borderBottomLeftRadius: '10px',
            },
          }}
        >
          {data &&
            Object.keys(data).map((k) => {
              const { label, value } = data[k];
              return (
                <TableRow key={label}>
                  <TableCell
                    style={{
                      width: 'max-content',
                      whiteSpace: 'nowrap',
                      borderRight: '1px solid #ccc',
                    }}
                    component="th"
                    scope="row"
                  >
                    {label}
                  </TableCell>
                  <TableCell style={{ width: '100%' }}>{value}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default HeaderRowTable;
