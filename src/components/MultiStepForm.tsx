import React, { useState } from 'react';
import styled from 'styled-components';
import { FormSchema, FormHooks, FormData } from '../types';
import { useForm } from '../hooks/useForm';
import { FormField } from './fields/FormField';
import { ThemeProvider } from '../themes/ThemeProvider';

export interface MultiStepFormProps {
  schema: FormSchema;
  onSubmit?: (data: FormData) => void | Promise<void>;
  hooks?: FormHooks;
  initialData?: FormData;
  geminiApiKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

const FormContainer = styled.form`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ProgressBar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ProgressSteps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressStep = styled.div<{ active?: boolean; completed?: boolean }>`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme, active, completed }) =>
    completed || active ? theme.colors.primary : theme.colors.secondary};
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing.md};

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: ${({ theme, completed }) =>
      completed ? theme.colors.primary : theme.colors.border};
    border-radius: 2px;
  }

  ${({ active, theme }) =>
    active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 12px;
      height: 12px;
      background-color: ${theme.colors.primary};
      border-radius: 50%;
      border: 2px solid ${theme.colors.background};
    }
  `}
`;

const StepContent = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StepHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StepTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const StepDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: space-between;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: opacity 0.2s;

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

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  schema,
  onSubmit,
  hooks,
  initialData,
  geminiApiKey,
  className,
  style,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const formHooks: FormHooks = {
    ...hooks,
    onSubmit: onSubmit || hooks?.onSubmit,
    onStepChange: (step: number) => {
      setCurrentStep(step);
      if (hooks?.onStepChange) {
        hooks.onStepChange(step);
      }
    },
  };

  const {
    handleSubmit,
    setValue,
    setFieldTouched,
    validateField,
    getFieldState,
    isSubmitting,
    validateForm,
  } = useForm({
    schema,
    hooks: formHooks,
    initialData,
    geminiApiKey,
  });

  const steps = schema.steps || [];
  const currentStepConfig = steps[currentStep];

  const handleNext = async () => {
    const isValid = await validateForm();
    if (isValid && currentStep < steps.length - 1) {
      if (currentStepConfig.onNext) {
        const canProceed = await currentStepConfig.onNext(
          steps.reduce((acc, step) => {
            step.fields.forEach((field) => {
              const state = getFieldState(field.id);
              acc[field.id] = state.value;
            });
            return acc;
          }, {} as FormData)
        );
        if (!canProceed) return;
      }
      setCurrentStep(currentStep + 1);
      if (hooks?.onStepChange) {
        hooks.onStepChange(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      if (currentStepConfig.onPrevious) {
        currentStepConfig.onPrevious();
      }
      setCurrentStep(currentStep - 1);
      if (hooks?.onStepChange) {
        hooks.onStepChange(currentStep - 1);
      }
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <ThemeProvider theme={schema.theme}>
      <FormContainer onSubmit={handleSubmit} className={className} style={style}>
        {schema.showProgress && (
          <ProgressBar>
            <ProgressSteps>
              {steps.map((step, index) => (
                <ProgressStep
                  key={step.id}
                  active={index === currentStep}
                  completed={index < currentStep}
                >
                  {step.title}
                </ProgressStep>
              ))}
            </ProgressSteps>
          </ProgressBar>
        )}

        <StepContent>
          {currentStepConfig && (
            <>
              <StepHeader>
                <StepTitle>{currentStepConfig.title}</StepTitle>
                {currentStepConfig.description && (
                  <StepDescription>{currentStepConfig.description}</StepDescription>
                )}
              </StepHeader>

              {currentStepConfig.fields.map((field) => {
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
              })}
            </>
          )}
        </StepContent>

        <ButtonGroup>
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {isLastStep ? (
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          ) : (
            <Button type="button" variant="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </ButtonGroup>
      </FormContainer>
    </ThemeProvider>
  );
};
