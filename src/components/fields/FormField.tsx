import React from 'react';
import styled from 'styled-components';
import { FieldConfig } from '../../types';
import { TextField } from './TextField';
import { NumberField } from './NumberField';
import { TextareaField } from './TextareaField';
import { SelectField } from './SelectField';
import { RadioField } from './RadioField';
import { CheckboxField } from './CheckboxField';
import { CheckboxGroupField } from './CheckboxGroupField';
import { FileField } from './FileField';
import { DateField } from './DateField';
import { RangeField } from './RangeField';
import { RatingField } from './RatingField';
import { SwitchField } from './SwitchField';

export interface FormFieldProps {
  config: FieldConfig;
  value?: unknown;
  error?: string;
  touched?: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const FieldWrapper = styled.div<{ gridColumn?: string; gridRow?: string }>`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  grid-column: ${({ gridColumn }) => gridColumn || 'auto'};
  grid-row: ${({ gridRow }) => gridRow || 'auto'};
`;

const Label = styled.label<{ required?: boolean }>`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};

  ${({ required, theme }) =>
    required &&
    `
    &::after {
      content: ' *';
      color: ${theme.colors.error};
    }
  `}
`;

const HelpText = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorText = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
`;

export const FormField: React.FC<FormFieldProps> = ({
  config,
  value,
  error,
  touched,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const renderField = () => {
    const commonProps = {
      value,
      onChange,
      onBlur,
      onFocus,
      disabled: disabled || config.disabled,
      readonly: readonly || config.readonly,
    };

    switch (config.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
        return <TextField config={config} {...commonProps} />;

      case 'number':
        return <NumberField config={config} {...commonProps} />;

      case 'textarea':
        return <TextareaField config={config} {...commonProps} />;

      case 'select':
      case 'multi-select':
        return <SelectField config={config} {...commonProps} />;

      case 'radio':
        return <RadioField config={config} {...commonProps} />;

      case 'checkbox':
        return <CheckboxField config={config} {...commonProps} />;

      case 'checkboxGroup':
        return <CheckboxGroupField config={config} {...commonProps} />;

      case 'file':
        return <FileField config={config} {...commonProps} />;

      case 'date':
      case 'datetime':
      case 'time':
        return <DateField config={config} {...commonProps} />;

      case 'range':
        return <RangeField config={config} {...commonProps} />;

      case 'rating':
        return <RatingField config={config} {...commonProps} />;

      case 'switch':
        return <SwitchField config={config} {...commonProps} />;

      default:
        return <TextField config={config} {...commonProps} />;
    }
  };

  return (
    <FieldWrapper
      gridColumn={config.gridColumn}
      gridRow={config.gridRow}
      className={config.className}
      style={config.style}
    >
      {config.type !== 'checkbox' && (
        <Label htmlFor={config.id} required={config.required}>
          {config.label}
          {config.tooltip && <span title={config.tooltip}> ⓘ</span>}
        </Label>
      )}
      {renderField()}
      {config.helpText && !error && <HelpText>{config.helpText}</HelpText>}
      {touched && error && <ErrorText role="alert">{error}</ErrorText>}
    </FieldWrapper>
  );
};
