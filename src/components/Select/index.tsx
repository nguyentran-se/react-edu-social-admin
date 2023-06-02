import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { SelectProps } from 'src/@types';

function Select({
  control,
  fieldName,
  options,
  error,
  required,
  isDisabled = false,
  size = 'default',
  label = fieldName,
}: SelectProps) {
  const defaultConfig = {
    isSearchable: false,
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
  return (
    <FormControl
      sx={{
        width: '100%',
        m: '10px 0',
        position: 'relative',
        minHeight: size === 'small' ? 38 : 90,
      }}
    >
      <FormLabel
        sx={{
          position: 'absolute',
          top: -8,
          left: 10,
          zIndex: 2,
          fontSize: '10px',
          background: '#fff',
          paddingLeft: '2px',
          paddingRight: '4px',
          boxSizing: 'border-box',
          color: error ? 'red' : 'inherit',
          backgroundColor: isDisabled ? 'hsl(0, 0%, 95%)' : '#fff',
          userSelect: 'none',
        }}
        required
      >
        {label}
      </FormLabel>
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { onChange, value, name, ref, ...field } }) => {
          return (
            <ReactSelect
              ref={ref}
              required={required}
              placeholder={`Select ${label} ...`}
              defaultValue={options.find((o) => o.value === value)}
              maxMenuHeight={130}
              isDisabled={isDisabled}
              // @ts-ignore - Conflict btw react-hook-form and react-select
              options={options}
              getOptionValue={(option: any) => option.value}
              getOptionLabel={(option: any) => option.label}
              onChange={(option: any) => {
                onChange(option.value);
              }}
              classNames={{
                control: () => (size === 'small' ? 'react-select__control--small' : ''),
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
              {...defaultConfig}
              {...field}
            />
          );
        }}
      />
      <FormHelperText sx={{ m: '3px 14px 0' }} error={error}>
        {error && <span style={{ textTransform: 'capitalize' }}>{fieldName}</span>}
        {error && ' is required'}
      </FormHelperText>
    </FormControl>
  );
}

export default Select;
