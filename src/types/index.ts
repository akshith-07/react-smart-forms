import { ReactNode } from 'react';
import { z } from 'zod';

// Field Types
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'checkboxGroup'
  | 'switch'
  | 'file'
  | 'date'
  | 'datetime'
  | 'time'
  | 'range'
  | 'color'
  | 'rating'
  | 'signature'
  | 'rich-text'
  | 'autocomplete'
  | 'multi-select'
  | 'custom';

// Validation Types
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom' | 'ai';
  value?: unknown;
  message?: string;
  validator?: (value: unknown) => boolean | Promise<boolean>;
}

export interface AIValidationConfig {
  enabled: boolean;
  apiKey?: string;
  prompt?: string;
  checkProfessionalism?: boolean;
  checkAppropriate?: boolean;
  customChecks?: string[];
}

// Conditional Logic
export type ConditionalOperator = 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';

export interface ConditionalRule {
  fieldId: string;
  operator: ConditionalOperator;
  value: unknown;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
}

// Field Options
export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: ReactNode;
}

// Base Field Configuration
export interface BaseFieldConfig {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: unknown;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  helpText?: string;
  tooltip?: string;
  className?: string;
  style?: React.CSSProperties;
  validation?: ValidationRule[];
  aiValidation?: AIValidationConfig;
  conditionalRules?: ConditionalRule[];
  order?: number;
  gridColumn?: string;
  gridRow?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// Specific Field Configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'password' | 'tel' | 'url';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  autocomplete?: string;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  rows?: number;
  cols?: number;
  minLength?: number;
  maxLength?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select' | 'multi-select';
  options: FieldOption[];
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio';
  options: FieldOption[];
  inline?: boolean;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  checkedValue?: unknown;
  uncheckedValue?: unknown;
}

export interface CheckboxGroupFieldConfig extends BaseFieldConfig {
  type: 'checkboxGroup';
  options: FieldOption[];
  inline?: boolean;
  min?: number;
  max?: number;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: 'file';
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: 'date' | 'datetime' | 'time';
  min?: string;
  max?: string;
  format?: string;
}

export interface RangeFieldConfig extends BaseFieldConfig {
  type: 'range';
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
}

export interface RatingFieldConfig extends BaseFieldConfig {
  type: 'rating';
  max?: number;
  icon?: ReactNode;
  color?: string;
}

export interface RichTextFieldConfig extends BaseFieldConfig {
  type: 'rich-text';
  toolbar?: string[];
  height?: number;
}

export interface AutocompleteFieldConfig extends BaseFieldConfig {
  type: 'autocomplete';
  options: FieldOption[];
  fetchOptions?: (query: string) => Promise<FieldOption[]>;
  minChars?: number;
}

export type FieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig
  | CheckboxGroupFieldConfig
  | FileFieldConfig
  | DateFieldConfig
  | RangeFieldConfig
  | RatingFieldConfig
  | RichTextFieldConfig
  | AutocompleteFieldConfig
  | BaseFieldConfig;

// Form Step (for multi-step forms)
export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  validation?: z.ZodSchema;
  onNext?: (data: FormData) => boolean | Promise<boolean>;
  onPrevious?: () => void;
}

// Form Schema
export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  version?: string;
  steps?: FormStep[];
  fields?: FieldConfig[];
  submitButton?: {
    text?: string;
    position?: 'left' | 'center' | 'right';
    fullWidth?: boolean;
  };
  resetButton?: {
    text?: string;
    show?: boolean;
  };
  theme?: ThemeName;
  layout?: 'vertical' | 'horizontal' | 'grid';
  gridColumns?: number;
  spacing?: 'compact' | 'normal' | 'relaxed';
  showProgress?: boolean;
  allowSaveProgress?: boolean;
  analytics?: AnalyticsConfig;
}

// Theme Types
export type ThemeName = 'default' | 'bootstrap' | 'tailwind' | 'material';

export interface Theme {
  name: ThemeName;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    background: string;
    text: string;
    border: string;
    disabled: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

// Analytics Types
export interface AnalyticsConfig {
  enabled: boolean;
  trackViews?: boolean;
  trackInteractions?: boolean;
  trackCompletions?: boolean;
  trackErrors?: boolean;
  customEvents?: boolean;
  provider?: 'google' | 'segment' | 'mixpanel' | 'custom';
  trackingId?: string;
  onEvent?: (event: AnalyticsEvent) => void;
}

export interface AnalyticsEvent {
  type: 'view' | 'interaction' | 'completion' | 'error' | 'custom';
  formId: string;
  stepId?: string;
  fieldId?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

// Form Data Types
export type FormData = Record<string, unknown>;

export interface FormState {
  currentStep: number;
  data: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValidating: boolean;
  submitCount: number;
}

// Form Hooks Types
export interface FormHooks {
  onSubmit?: (data: FormData) => void | Promise<void>;
  onReset?: () => void;
  onStepChange?: (step: number) => void;
  onFieldChange?: (fieldId: string, value: unknown) => void;
  onFieldBlur?: (fieldId: string) => void;
  onFieldFocus?: (fieldId: string) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  onSuccess?: (data: FormData) => void;
  onError?: (error: Error) => void;
}

// Form Builder Types
export interface DraggableField {
  id: string;
  type: FieldType;
  label: string;
  icon?: ReactNode;
  config?: Partial<FieldConfig>;
}

export interface FormBuilderConfig {
  availableFields?: DraggableField[];
  showFieldLibrary?: boolean;
  showPreview?: boolean;
  allowExport?: boolean;
  allowImport?: boolean;
  onSchemaChange?: (schema: FormSchema) => void;
  initialSchema?: FormSchema;
}

// Export/Import Types
export interface ExportOptions {
  format: 'json' | 'yaml';
  minify?: boolean;
  includeMetadata?: boolean;
}

export interface ImportOptions {
  validate?: boolean;
  merge?: boolean;
}

// Validation Error Types
export interface ValidationError {
  fieldId: string;
  message: string;
  type: 'required' | 'format' | 'custom' | 'ai';
}

export interface FormValidationResult {
  valid: boolean;
  errors: ValidationError[];
  data?: FormData;
}
