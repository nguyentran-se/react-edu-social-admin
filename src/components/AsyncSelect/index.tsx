import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import { useEffect, useRef } from 'react';
import { Control, Controller } from 'react-hook-form';
import ReactAsyncSelect from 'react-select/async';
interface AsyncSelectProps {
  control: Control<any, any>;
  fieldName: string;
  promiseOptions: (inputValue: string) => Promise<any[]>;
  error: boolean;
  required?: boolean;
  isMulti?: boolean;
  debounce?: boolean;
  onRawSelect?: Function;
  readOnly?: boolean;
}
function AsyncSelect({
  control,
  fieldName,
  promiseOptions,
  error,
  required,
  isMulti = false,
  debounce = true,
  onRawSelect,
  readOnly = false,
}: AsyncSelectProps) {
  const debounceRef = useRef(null);
  const defaultConfig = {
    // isSearchable: false,
    isClearable: false,
    className: 'react-select-container',
    classNamePrefix: 'react-select',
  };
  const errorSelectStyle = error
    ? {
        borderColor: 'red',
        color: 'red',
      }
    : {};
  useEffect(() => {
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, []);
  function handleLoadOptions(input) {
    if (!debounce) return promiseOptions(input);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    return new Promise((resolve) => {
      debounceRef.current = setTimeout(() => {
        resolve(promiseOptions(input));
      }, 300);
    });
  }
  return (
    <FormControl sx={{ width: '100%', m: '10px 0', position: 'relative' }}>
      <FormLabel
        sx={{
          position: 'absolute',
          top: -8,
          left: 10,
          zIndex: 2,
          fontSize: '10px',
          background: '#fff',
          paddingLeft: '2px',
          paddingRight: '6px',
          boxSizing: 'border-box',
          color: error ? 'red' : 'inherit',
        }}
        required={required}
      >
        {fieldName}
      </FormLabel>
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { onChange, value, name, ref, ...field } }) => {
          return (
            <ReactAsyncSelect
              required={required}
              cacheOptions
              defaultOptions
              defaultValue={value}
              placeholder={`Search ${fieldName} ...`}
              maxMenuHeight={130}
              isMulti={isMulti}
              // @ts-ignore - Conflict btw react-hook-form and react-select
              loadOptions={handleLoadOptions}
              onChange={(option: any) => {
                // console.log('🚀 ~ option:', option);
                if (isMulti) onChange(option.map((o) => o.value));
                else onChange(option.value);
                if (Boolean(onRawSelect)) onRawSelect(option);
              }}
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  ...errorSelectStyle,
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  ...errorSelectStyle,
                }),
              }}
              isDisabled={readOnly}
              {...defaultConfig}
              {...field}
            />
          );
        }}
      />
      <FormHelperText sx={{ m: '3px 14px 0' }} error={error}>
        {error && `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`}
      </FormHelperText>
    </FormControl>
  );
}

export default AsyncSelect;
