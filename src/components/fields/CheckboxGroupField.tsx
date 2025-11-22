import React from 'react';
import styled from 'styled-components';
import { CheckboxGroupFieldConfig } from '../../types';

interface CheckboxGroupFieldProps {
  config: CheckboxGroupFieldConfig;
  value?: unknown;
  onChange: (value: string[]) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const CheckboxGroup = styled.div<{ inline?: boolean }>`
  display: ${({ inline }) => (inline ? 'flex' : 'block')};
  gap: ${({ theme, inline }) => (inline ? theme.spacing.md : theme.spacing.sm)};
  flex-wrap: wrap;
`;

const CheckboxLabel = styled.label<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: ${({ theme }) => theme.fontSize.md};
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

export const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const selectedValues = (value as string[]) || [];

  const handleChange = (optionValue: string | number, checked: boolean) => {
    const stringValue = String(optionValue);
    if (checked) {
      onChange([...selectedValues, stringValue]);
    } else {
      onChange(selectedValues.filter((v) => v !== stringValue));
    }
  };

  return (
    <CheckboxGroup
      role="group"
      aria-labelledby={config.id}
      inline={config.inline}
    >
      {config.options.map((option) => (
        <CheckboxLabel key={option.value} disabled={disabled || option.disabled}>
          <CheckboxInput
            type="checkbox"
            name={`${config.name}[]`}
            value={option.value}
            checked={selectedValues.includes(String(option.value))}
            onChange={(e) => handleChange(option.value, e.target.checked)}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled || readonly || option.disabled}
            aria-label={option.label}
          />
          {option.icon}
          {option.label}
        </CheckboxLabel>
      ))}
    </CheckboxGroup>
  );
};
