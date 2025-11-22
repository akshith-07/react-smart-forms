import { z } from 'zod';
import { FieldConfig, ValidationRule, FormData } from '../types';

export const createFieldSchema = (field: FieldConfig): z.ZodType => {
  let schema: z.ZodType = z.any();

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
    case 'textarea':
      schema = z.string();
      if (field.type === 'email') {
        schema = (schema as z.ZodString).email('Invalid email format');
      }
      if (field.type === 'url') {
        schema = (schema as z.ZodString).url('Invalid URL format');
      }
      break;

    case 'number':
    case 'range':
      schema = z.number();
      break;

    case 'checkbox':
      schema = z.boolean();
      break;

    case 'checkboxGroup':
    case 'multi-select':
      schema = z.array(z.string());
      break;

    case 'select':
    case 'radio':
      schema = z.string();
      break;

    case 'file':
      schema = z.instanceof(FileList).or(z.instanceof(File)).or(z.array(z.instanceof(File)));
      break;

    case 'date':
    case 'datetime':
    case 'time':
      schema = z.string().or(z.date());
      break;

    default:
      schema = z.any();
  }

  // Apply validation rules
  if (field.validation) {
    field.validation.forEach((rule) => {
      schema = applyValidationRule(schema, rule, field);
    });
  }

  // Handle required
  if (field.required) {
    if (schema instanceof z.ZodString) {
      schema = schema.min(1, `${field.label} is required`);
    } else if (schema instanceof z.ZodArray) {
      schema = schema.min(1, `${field.label} is required`);
    }
  } else {
    schema = schema.optional();
  }

  return schema;
};

const applyValidationRule = (schema: z.ZodType, rule: ValidationRule, field: FieldConfig): z.ZodType => {
  switch (rule.type) {
    case 'required':
      if (schema instanceof z.ZodString) {
        return schema.min(1, rule.message || `${field.label} is required`);
      }
      break;

    case 'min':
      if (schema instanceof z.ZodString) {
        return schema.min(
          Number(rule.value),
          rule.message || `${field.label} must be at least ${rule.value} characters`
        );
      }
      if (schema instanceof z.ZodNumber) {
        return schema.min(
          Number(rule.value),
          rule.message || `${field.label} must be at least ${rule.value}`
        );
      }
      if (schema instanceof z.ZodArray) {
        return schema.min(
          Number(rule.value),
          rule.message || `Select at least ${rule.value} options`
        );
      }
      break;

    case 'max':
      if (schema instanceof z.ZodString) {
        return schema.max(
          Number(rule.value),
          rule.message || `${field.label} must be at most ${rule.value} characters`
        );
      }
      if (schema instanceof z.ZodNumber) {
        return schema.max(
          Number(rule.value),
          rule.message || `${field.label} must be at most ${rule.value}`
        );
      }
      if (schema instanceof z.ZodArray) {
        return schema.max(
          Number(rule.value),
          rule.message || `Select at most ${rule.value} options`
        );
      }
      break;

    case 'pattern':
      if (schema instanceof z.ZodString && typeof rule.value === 'string') {
        const regex = new RegExp(rule.value);
        return schema.regex(regex, rule.message || `${field.label} format is invalid`);
      }
      break;

    case 'custom':
      if (rule.validator) {
        return schema.refine(
          (val) => {
            const result = rule.validator!(val);
            return result instanceof Promise ? result : Promise.resolve(result);
          },
          { message: rule.message || 'Validation failed' }
        );
      }
      break;
  }

  return schema;
};

export const createFormSchema = (fields: FieldConfig[]): z.ZodObject<any> => {
  const shape: Record<string, z.ZodType> = {};

  fields.forEach((field) => {
    shape[field.name] = createFieldSchema(field);
  });

  return z.object(shape);
};

export const validateFormData = async (
  data: FormData,
  schema: z.ZodSchema
): Promise<{ success: boolean; errors?: Record<string, string>; data?: FormData }> => {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    throw error;
  }
};
