import React from 'react';
import styled from 'styled-components';
import { TextFieldConfig } from '../../types';

interface TextFieldProps {
  config: TextFieldConfig;
  value?: unknown;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  border: 1px solid ${({ theme, hasError }) => (hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled}20;
    cursor: not-allowed;
  }

  &:read-only {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: default;
  }
`;

export const TextField: React.FC<TextFieldProps> = ({
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
      type={config.type}
      value={(value as string) || ''}
      placeholder={config.placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled}
      readOnly={readonly}
      minLength={config.minLength}
      maxLength={config.maxLength}
      pattern={config.pattern}
      autoComplete={config.autocomplete}
      aria-label={config.ariaLabel || config.label}
      aria-describedby={config.ariaDescribedBy}
      aria-required={config.required}
    />
  );
};
