import React from 'react';
import styled from 'styled-components';
import { DateFieldConfig } from '../../types';

interface DateFieldProps {
  config: DateFieldConfig;
  value?: unknown;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

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

export const DateField: React.FC<DateFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const getInputType = () => {
    switch (config.type) {
      case 'datetime':
        return 'datetime-local';
      case 'time':
        return 'time';
      default:
        return 'date';
    }
  };

  return (
    <Input
      id={config.id}
      name={config.name}
      type={getInputType()}
      value={(value as string) || ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled}
      readOnly={readonly}
      min={config.min}
      max={config.max}
      aria-label={config.ariaLabel || config.label}
      aria-required={config.required}
    />
  );
};
