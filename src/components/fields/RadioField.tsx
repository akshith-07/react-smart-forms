import React from 'react';
import styled from 'styled-components';
import { RadioFieldConfig } from '../../types';

interface RadioFieldProps {
  config: RadioFieldConfig;
  value?: unknown;
  onChange: (value: string | number) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const RadioGroup = styled.div<{ inline?: boolean }>`
  display: ${({ inline }) => (inline ? 'flex' : 'block')};
  gap: ${({ theme, inline }) => (inline ? theme.spacing.md : theme.spacing.sm)};
  flex-wrap: wrap;
`;

const RadioLabel = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme, disabled }) => (disabled ? theme.colors.disabled : theme.colors.text)};
`;

const RadioInput = styled.input`
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

export const RadioField: React.FC<RadioFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  return (
    <RadioGroup
      role="radiogroup"
      aria-labelledby={config.id}
      inline={config.inline}
    >
      {config.options.map((option) => (
        <RadioLabel key={option.value} disabled={disabled || option.disabled}>
          <RadioInput
            type="radio"
            name={config.name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled || readonly || option.disabled}
            aria-label={option.label}
          />
          {option.icon}
          {option.label}
        </RadioLabel>
      ))}
    </RadioGroup>
  );
};
