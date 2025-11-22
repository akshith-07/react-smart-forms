import React from 'react';
import styled from 'styled-components';
import { FormSchema, FormHooks, FormData } from '../types';
import { useForm } from '../hooks/useForm';
import { FormField } from './fields/FormField';
import { ThemeProvider } from '../themes/ThemeProvider';

export interface FormProps {
  schema: FormSchema;
  onSubmit?: (data: FormData) => void | Promise<void>;
  hooks?: FormHooks;
  initialData?: FormData;
  geminiApiKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

const FormContainer = styled.form<{
  layout?: 'vertical' | 'horizontal' | 'grid';
  gridColumns?: number;
  spacing?: 'compact' | 'normal' | 'relaxed';
}>`
  width: 100%;
  ${({ layout, gridColumns, theme }) => {
    if (layout === 'grid') {
      return `
        display: grid;
        grid-template-columns: repeat(${gridColumns || 2}, 1fr);
        gap: ${theme.spacing.md};
      `;
    }
    return 'display: block;';
  }}

  ${({ spacing, theme }) => {
    const spacingMap = {
      compact: theme.spacing.sm,
      normal: theme.spacing.md,
      relaxed: theme.spacing.lg,
    };
    return `padding: ${spacingMap[spacing || 'normal']};`;
  }}
`;

const FormHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  grid-column: 1 / -1;
`;

const FormTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const FormDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.secondary};
`;

const FormFields = styled.div<{
  layout?: 'vertical' | 'horizontal' | 'grid';
}>`
  ${({ layout }) => layout === 'grid' && 'grid-column: 1 / -1; display: contents;'}
`;

const ButtonGroup = styled.div<{
  position?: 'left' | 'center' | 'right';
}>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  justify-content: ${({ position }) => {
    switch (position) {
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      case 'center':
      default:
        return 'center';
    }
  }};
  grid-column: 1 / -1;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary'; fullWidth?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: opacity 0.2s;
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.background};
  `
      : `
    background-color: transparent;
    color: ${theme.colors.secondary};
    border: 1px solid ${theme.colors.border};
  `}

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const Form: React.FC<FormProps> = ({
  schema,
  onSubmit,
  hooks,
  initialData,
  geminiApiKey,
  className,
  style,
}) => {
  const formHooks: FormHooks = {
    ...hooks,
    onSubmit: onSubmit || hooks?.onSubmit,
  };

  const {
    handleSubmit,
    handleReset,
    setValue,
    setFieldTouched,
    validateField,
    getFieldState,
    isSubmitting,
  } = useForm({
    schema,
    hooks: formHooks,
    initialData,
    geminiApiKey,
  });

  const fields = schema.steps ? schema.steps[0]?.fields || [] : schema.fields || [];

  const renderFields = () => {
    return fields.map((field) => {
      const fieldState = getFieldState(field.id);

      if (!fieldState.visible) {
        return null;
      }

      return (
        <FormField
          key={field.id}
          config={{
            ...field,
            required: fieldState.required,
            disabled: !fieldState.enabled,
          }}
          value={fieldState.value}
          error={fieldState.error}
          touched={fieldState.touched}
          onChange={(value) => setValue(field.id, value)}
          onBlur={() => {
            setFieldTouched(field.id, true);
            validateField(field.id);
          }}
          onFocus={() => {
            if (hooks?.onFieldFocus) {
              hooks.onFieldFocus(field.id);
            }
          }}
        />
      );
    });
  };

  return (
    <ThemeProvider theme={schema.theme}>
      <FormContainer
        onSubmit={handleSubmit}
        layout={schema.layout}
        gridColumns={schema.gridColumns}
        spacing={schema.spacing}
        className={className}
        style={style}
      >
        {(schema.title || schema.description) && (
          <FormHeader>
            {schema.title && <FormTitle>{schema.title}</FormTitle>}
            {schema.description && <FormDescription>{schema.description}</FormDescription>}
          </FormHeader>
        )}

        <FormFields layout={schema.layout}>{renderFields()}</FormFields>

        <ButtonGroup position={schema.submitButton?.position}>
          {schema.resetButton?.show && (
            <Button type="button" variant="secondary" onClick={handleReset}>
              {schema.resetButton.text || 'Reset'}
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth={schema.submitButton?.fullWidth}
          >
            {isSubmitting ? 'Submitting...' : schema.submitButton?.text || 'Submit'}
          </Button>
        </ButtonGroup>
      </FormContainer>
    </ThemeProvider>
  );
};
