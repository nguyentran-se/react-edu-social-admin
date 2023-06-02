import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { useRef, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import { removeAccents } from 'src/utils';
interface CheckboxSearchListProps {
  initialList: any[];
  initialChecked?: number[];
  onToggleCheckbox: (value: number[]) => void;
}

function CheckboxSearchList({
  initialList,
  initialChecked = [],
  onToggleCheckbox,
}: CheckboxSearchListProps) {
  const [searchInput, setSearchInput] = useState('');
  const [checked, setChecked] = useState(initialChecked);
  const [list, setList] = useState(initialList);
  const originalListRef = useRef(initialList);

  const handleToggle = (value: number) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    //WARN: react portal not re-render this component if update outside @@
    setChecked(newChecked);
    onToggleCheckbox(newChecked);
  };

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
  return (
    <Box sx={{ maxHeight: 400, overflowY: 'hidden', pt: '10px' }}>
      <TextField
        value={searchInput}
        onChange={handleSearch}
        label="Search"
        sx={{ width: '100%' }}
      />
      <List sx={{ width: '100%', bgcolor: 'background.paper', height: 300, overflowY: 'auto' }}>
        {list.length !== 0 ? (
          list.map((item) => {
            const labelId = `checkbox-list-label-${item.id}`;
            return (
              <React.Fragment key={item.id}>
                <ListItem
                  // secondaryAction={
                  //   <IconButton edge="end" aria-label="comments">
                  //     <DeleteOutlined color="error" />
                  //   </IconButton>
                  // }
                  disablePadding
                >
                  <ListItemButton role={undefined} onClick={() => handleToggle(item.id)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(item.id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={labelId}
                      primary={`${item.name} ${item.email ? `- ${item.email}` : ''}`}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })
        ) : (
          <Typography sx={{ textAlign: 'center' }}>No records</Typography>
        )}
      </List>
    </Box>
  );
}

export default CheckboxSearchList;

export function useCheckboxSearchList({
  initialList,
  initialChecked,
}: {
  initialList: any[];
  initialChecked?: number[];
}) {
  const [values, setValues] = useState([]);
  const valuesRef = useRef(null);
  function onToggleCheckbox(values: number[]) {
    valuesRef.current = values;
    setValues(values);
  }

  const Component = () => {
    return (
      <div>
        <CheckboxSearchList
          initialList={initialList}
          initialChecked={initialChecked}
          onToggleCheckbox={onToggleCheckbox}
        />
      </div>
    );
  };
  return {
    values,
    CheckboxSearchList: Component,
    valuesRef,
  };
}
