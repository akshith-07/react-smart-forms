import React from 'react';
import styled from 'styled-components';
import { TextareaFieldConfig } from '../../types';

interface TextareaFieldProps {
  config: TextareaFieldConfig;
  value?: unknown;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const Textarea = styled.textarea<{ resize?: string }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: inherit;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  resize: ${({ resize }) => resize || 'vertical'};

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

export const TextareaField: React.FC<TextareaFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  return (
    <Textarea
      id={config.id}
      name={config.name}
      value={(value as string) || ''}
      placeholder={config.placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onFocus={onFocus}
      disabled={disabled}
      readOnly={readonly}
      rows={config.rows || 4}
      cols={config.cols}
      minLength={config.minLength}
      maxLength={config.maxLength}
      resize={config.resize}
      aria-label={config.ariaLabel || config.label}
      aria-required={config.required}
    />
  );
};
