import React from 'react';
import styled from 'styled-components';
import { NumberFieldConfig } from '../../types';

interface NumberFieldProps {
  config: NumberFieldConfig;
  value?: unknown;
  onChange: (value: number) => void;
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

export const NumberField: React.FC<NumberFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  return (
    <Input
      id={config.id}
      name={config.name}
      type="number"
      value={value as number || ''}
      placeholder={config.placeholder}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled}
      readOnly={readonly}
      min={config.min}
      max={config.max}
      step={config.step}
      aria-label={config.ariaLabel || config.label}
      aria-required={config.required}
    />
  );
};
