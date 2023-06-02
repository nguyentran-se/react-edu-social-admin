import React, { useRef, useState } from 'react';
import Tippy from '@tippyjs/react/headless'; // different import path!
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SearchInput from '../InputSearch';
import { useQuery } from '@tanstack/react-query';
import { QueryKey, userApis } from 'src/apis';
import SuspenseLoader from '../SuspenseLoader';
import { User, UserRole } from 'src/@types';
import { removeAccents } from 'src/utils';
function Popper({
  children,
  onSelect,
}: {
  children: React.ReactElement;
  onSelect?: (u: User) => void;
}) {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Users],
    queryFn: userApis.getUsers,
    refetchOnWindowFocus: false,
    onSuccess: (response) => setList(response),
    select: (response) => response.filter((u) => u.role === UserRole.Teacher),
  });
  const originalListRef = useRef(data);
  originalListRef.current = data;
  const [searchInput, setSearchInput] = useState('');
  const [list, setList] = useState([]);
  const tippyInstance = useRef(null);
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const originalList = originalListRef.current;
    const newList = originalList.filter(
      (item) =>
        Boolean(item?.name) &&
        removeAccents(item.name.toLowerCase()).includes(removeAccents(value.toLowerCase())),
    );
    setSearchInput(value);
    setList(newList);
  }
  function handleOptionClick(u: User) {
    tippyInstance.current?.hide();
    if (onSelect) onSelect(u);
  }
  if (isLoading) return <SuspenseLoader />;
  return (
    <Tippy
      interactive={true}
      trigger="click"
      placement="bottom-start"
      onShow={(instance) => {
        // instance.hide();
        tippyInstance.current = instance;
      }}
      render={(attrs) => (
        <Paper
          className="box"
          tabIndex={-1}
          {...attrs}
          sx={{
            p: 2,
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            height: 200,
            overflowY: 'auto',
            '::-webkit-scrollbar': { width: '8px' },
            '::-webkit-scrollbar-thumb': {
              background: '#f1f1f1',
            },
            cursor: 'default',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <SearchInput onChange={handleSearch} />
          <Box sx={{ mt: 2, cursor: 'pointer' }}>
            {list.map((u) => {
              return (
                <Typography
                  variant="body1"
                  fontWeight={600}
                  key={u.id}
                  sx={{
                    p: '4px',
                    '&:hover': { background: 'rgba(85, 105, 255, 0.1)', borderRadius: '4px' },
                  }}
                  onClick={() => handleOptionClick(u)}
                >
                  {u.name}
                </Typography>
              );
            })}
          </Box>
        </Paper>
      )}
    >
      {children}
    </Tippy>
  );
}
export default Popper;
