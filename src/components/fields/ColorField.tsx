import React from 'react';
import styled from 'styled-components';
import { BaseFieldConfig } from '../../types';

interface ColorFieldProps {
  config: BaseFieldConfig & { type: 'color' };
  value?: unknown;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const ColorInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ColorInput = styled.input<{ disabled?: boolean; readonly?: boolean }>`
  width: 60px;
  height: 40px;
  padding: 2px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: ${({ disabled, readonly }) => (disabled || readonly ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  background-color: ${({ theme, readonly }) => (readonly ? theme.colors.disabled : 'transparent')};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

const ColorValue = styled.span`
  font-family: monospace;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
  text-transform: uppercase;
`;

export const ColorField: React.FC<ColorFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const colorValue = typeof value === 'string' ? value : '#000000';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <ColorInputWrapper>
      <ColorInput
        id={config.id}
        name={config.name}
        type="color"
        value={colorValue}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readonly={readonly}
        aria-label={config.ariaLabel || config.label}
        aria-required={config.required}
      />
      <ColorValue>{colorValue}</ColorValue>
    </ColorInputWrapper>
  );
};
