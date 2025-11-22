import React from 'react';
import styled from 'styled-components';
import { CheckboxFieldConfig } from '../../types';

interface CheckboxFieldProps {
  config: CheckboxFieldConfig;
  value?: unknown;
  onChange: (value: boolean) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const CheckboxLabel = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme, disabled }) => (disabled ? theme.colors.disabled : theme.colors.text)};
`;

const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  return (
    <CheckboxLabel disabled={disabled}>
      <CheckboxInput
        id={config.id}
        name={config.name}
        type="checkbox"
        checked={(value as boolean) || false}
        onChange={(e) => onChange(e.target.checked)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled || readonly}
        aria-label={config.ariaLabel || config.label}
        aria-required={config.required}
      />
      {config.label}
      {config.tooltip && <span title={config.tooltip}> ⓘ</span>}
    </CheckboxLabel>
  );
};
