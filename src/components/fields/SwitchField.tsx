import React from 'react';
import styled from 'styled-components';
import { BaseFieldConfig } from '../../types';

interface SwitchFieldProps {
  config: BaseFieldConfig;
  value?: unknown;
  onChange: (value: boolean) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const SwitchWrapper = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const SwitchInput = styled.input`
  display: none;
`;

const SwitchSlider = styled.span<{ checked?: boolean; disabled?: boolean }>`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  background-color: ${({ checked, theme, disabled }) =>
    disabled ? theme.colors.disabled : checked ? theme.colors.primary : theme.colors.border};
  border-radius: 24px;
  transition: background-color 0.2s;

  &::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    left: ${({ checked }) => (checked ? '26px' : '3px')};
    top: 3px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.2s;
  }

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const SwitchLabel = styled.span<{ disabled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme, disabled }) => (disabled ? theme.colors.disabled : theme.colors.text)};
`;

export const SwitchField: React.FC<SwitchFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const isChecked = (value as boolean) || false;

  return (
    <SwitchWrapper disabled={disabled}>
      <SwitchInput
        id={config.id}
        name={config.name}
        type="checkbox"
        checked={isChecked}
        onChange={(e) => onChange(e.target.checked)}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled || readonly}
        aria-label={config.ariaLabel || config.label}
        aria-required={config.required}
      />
      <SwitchSlider checked={isChecked} disabled={disabled} />
      <SwitchLabel disabled={disabled}>{config.label}</SwitchLabel>
    </SwitchWrapper>
  );
};
