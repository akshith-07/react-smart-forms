import { useState, useCallback, useEffect } from 'react';
import { FormSchema, FormState, FormData, FormHooks, FieldConfig } from '../types';
import { createFormSchema, validateFormData } from '../validators/zodValidator';
import { getAIValidator } from '../validators/aiValidator';
import { evaluateConditionalRules } from '../utils/conditionalLogic';
import { AnalyticsTracker } from '../utils/analytics';

export interface UseFormOptions {
  schema: FormSchema;
  hooks?: FormHooks;
  initialData?: FormData;
  geminiApiKey?: string;
}

export interface UseFormReturn {
  formState: FormState;
  values: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValidating: boolean;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleReset: () => void;
  setValue: (fieldId: string, value: unknown) => void;
  setFieldValue: (fieldId: string, value: unknown) => void;
  setFieldError: (fieldId: string, error: string) => void;
  setFieldTouched: (fieldId: string, touched: boolean) => void;
  validateField: (fieldId: string) => Promise<void>;
  validateForm: () => Promise<boolean>;
  getFieldState: (fieldId: string) => {
    value: unknown;
    error?: string;
    touched: boolean;
    visible: boolean;
    enabled: boolean;
    required: boolean;
  };
}

export const useForm = ({ schema, hooks, initialData = {}, geminiApiKey }: UseFormOptions): UseFormReturn => {
  const [formState, setFormState] = useState<FormState>({
    currentStep: 0,
    data: initialData,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
  });

  const [analytics] = useState(() =>
    schema.analytics?.enabled ? new AnalyticsTracker(schema.analytics) : null
  );

  const aiValidator = geminiApiKey ? getAIValidator(geminiApiKey) : null;

  useEffect(() => {
    if (analytics) {
      analytics.trackFormView(schema.id);
    }
  }, [analytics, schema.id]);

  const getAllFields = useCallback((): FieldConfig[] => {
    if (schema.fields) return schema.fields;
    if (schema.steps && schema.steps[formState.currentStep]) {
      return schema.steps[formState.currentStep].fields;
    }
    return [];
  }, [schema, formState.currentStep]);

  const setValue = useCallback((fieldId: string, value: unknown) => {
    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, [fieldId]: value },
    }));

    if (hooks?.onFieldChange) {
      hooks.onFieldChange(fieldId, value);
    }

    if (analytics) {
      analytics.trackFieldInteraction(schema.id, fieldId, { value });
    }
  }, [hooks, analytics, schema.id]);

  const setFieldError = useCallback((fieldId: string, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [fieldId]: error },
    }));
  }, []);

  const setFieldTouched = useCallback((fieldId: string, touched: boolean) => {
    setFormState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [fieldId]: touched },
    }));
  }, []);

  const validateField = useCallback(async (fieldId: string) => {
    const fields = getAllFields();
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;

    const value = formState.data[fieldId];

    // Zod validation
    const fieldSchema = createFormSchema([field]);
    const result = await validateFormData({ [field.name]: value }, fieldSchema);

    if (!result.success && result.errors) {
      const errorKey = Object.keys(result.errors)[0];
      setFieldError(fieldId, result.errors[errorKey]);
      return;
    }

    // AI validation
    if (field.aiValidation?.enabled && aiValidator && typeof value === 'string') {
      const aiResult = await aiValidator.validateField(value, field.aiValidation);
      if (!aiResult.valid && aiResult.message) {
        setFieldError(fieldId, aiResult.message);
        if (analytics) {
          analytics.trackFormError(schema.id, fieldId, { type: 'ai-validation', message: aiResult.message });
        }
        return;
      }
    }

    // Clear error if validation passed
    setFormState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors[fieldId];
      return { ...prev, errors: newErrors };
    });
  }, [formState.data, getAllFields, aiValidator, analytics, schema.id]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    setFormState((prev) => ({ ...prev, isValidating: true }));

    const fields = getAllFields();
    const formSchema = createFormSchema(fields);
    const result = await validateFormData(formState.data, formSchema);

    if (!result.success && result.errors) {
      setFormState((prev) => ({
        ...prev,
        errors: result.errors || {},
        isValidating: false,
      }));

      if (hooks?.onValidationError) {
        hooks.onValidationError(result.errors);
      }

      return false;
    }

    setFormState((prev) => ({ ...prev, errors: {}, isValidating: false }));
    return true;
  }, [formState.data, getAllFields, hooks]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setFormState((prev) => ({ ...prev, isSubmitting: true, submitCount: prev.submitCount + 1 }));

    const isValid = await validateForm();

    if (!isValid) {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
      return;
    }

    try {
      if (hooks?.onSubmit) {
        await hooks.onSubmit(formState.data);
      }

      if (hooks?.onSuccess) {
        hooks.onSuccess(formState.data);
      }

      if (analytics) {
        analytics.trackFormCompletion(schema.id, { data: formState.data });
      }

      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    } catch (error) {
      if (hooks?.onError) {
        hooks.onError(error as Error);
      }

      if (analytics) {
        analytics.trackFormError(schema.id, 'form', {
          error: (error as Error).message,
        });
      }

      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [formState.data, validateForm, hooks, analytics, schema.id]);

  const handleReset = useCallback(() => {
    setFormState({
      currentStep: 0,
      data: initialData,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
    });

    if (hooks?.onReset) {
      hooks.onReset();
    }
  }, [initialData, hooks]);

  const getFieldState = useCallback((fieldId: string) => {
    const fields = getAllFields();
    const field = fields.find((f) => f.id === fieldId);

    if (!field) {
      return {
        value: undefined,
        error: undefined,
        touched: false,
        visible: false,
        enabled: false,
        required: false,
      };
    }

    const { visible, enabled, required } = evaluateConditionalRules(
      field.conditionalRules,
      formState.data
    );

    return {
      value: formState.data[fieldId],
      error: formState.errors[fieldId],
      touched: formState.touched[fieldId] || false,
      visible,
      enabled,
      required: required || field.required || false,
    };
  }, [formState, getAllFields]);

  return {
    formState,
    values: formState.data,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    isValidating: formState.isValidating,
    handleSubmit,
    handleReset,
    setValue,
    setFieldValue: setValue,
    setFieldError,
    setFieldTouched,
    validateField,
    validateForm,
    getFieldState,
  };
};
