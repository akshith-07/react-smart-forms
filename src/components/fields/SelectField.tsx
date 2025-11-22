import React from 'react';
import styled from 'styled-components';
import { SelectFieldConfig } from '../../types';

interface SelectFieldProps {
  config: SelectFieldConfig;
  value?: unknown;
  onChange: (value: string | string[]) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled}20;
    cursor: not-allowed;
  }
`;

export const SelectField: React.FC<SelectFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const isMultiple = config.type === 'multi-select' || config.multiple;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isMultiple) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      onChange(selectedOptions);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <Select
      id={config.id}
      name={config.name}
      value={value as string | string[] || (isMultiple ? [] : '')}
      onChange={handleChange}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled || readonly}
      multiple={isMultiple}
      aria-label={config.ariaLabel || config.label}
      aria-required={config.required}
    >
      {!isMultiple && config.placeholder && (
        <option value="" disabled>
          {config.placeholder}
        </option>
      )}
      {config.options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </Select>
  );
};
