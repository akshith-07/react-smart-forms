import { FormSchema, ExportOptions, ImportOptions } from '../types';

export const exportFormSchema = (
  schema: FormSchema,
  options: ExportOptions = { format: 'json', minify: false }
): string => {
  const exportData = {
    ...schema,
    ...(options.includeMetadata && {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: schema.version || '1.0.0',
      },
    }),
  };

  if (options.format === 'json') {
    return options.minify
      ? JSON.stringify(exportData)
      : JSON.stringify(exportData, null, 2);
  }

  // YAML export (basic implementation)
  return convertToYAML(exportData);
};

export const importFormSchema = (
  data: string,
  options: ImportOptions = { validate: true }
): FormSchema => {
  let parsed: FormSchema;

  try {
    parsed = JSON.parse(data);
  } catch (error) {
    throw new Error('Invalid schema format. Expected valid JSON.');
  }

  if (options.validate) {
    validateSchema(parsed);
  }

  return parsed;
};

const validateSchema = (schema: any): void => {
  if (!schema.id || typeof schema.id !== 'string') {
    throw new Error('Schema must have a valid id');
  }

  if (!schema.title || typeof schema.title !== 'string') {
    throw new Error('Schema must have a valid title');
  }

  if (!schema.fields && !schema.steps) {
    throw new Error('Schema must have either fields or steps');
  }

  if (schema.fields && !Array.isArray(schema.fields)) {
    throw new Error('Schema fields must be an array');
  }

  if (schema.steps && !Array.isArray(schema.steps)) {
    throw new Error('Schema steps must be an array');
  }

  // Validate fields
  const fields = schema.fields || [];
  fields.forEach((field: any, index: number) => {
    if (!field.id || !field.name || !field.type) {
      throw new Error(`Field at index ${index} is missing required properties (id, name, type)`);
    }
  });

  // Validate steps
  if (schema.steps) {
    schema.steps.forEach((step: any, index: number) => {
      if (!step.id || !step.title || !step.fields) {
        throw new Error(`Step at index ${index} is missing required properties`);
      }
    });
  }
};

const convertToYAML = (obj: any, indent = 0): string => {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      yaml += `${spaces}${key}: null\n`;
    } else if (Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      value.forEach((item) => {
        if (typeof item === 'object') {
          yaml += `${spaces}- \n${convertToYAML(item, indent + 2)}`;
        } else {
          yaml += `${spaces}- ${item}\n`;
        }
      });
    } else if (typeof value === 'object') {
      yaml += `${spaces}${key}:\n${convertToYAML(value, indent + 1)}`;
    } else if (typeof value === 'string') {
      yaml += `${spaces}${key}: "${value}"\n`;
    } else {
      yaml += `${spaces}${key}: ${value}\n`;
    }
  }

  return yaml;
};

export const downloadSchema = (schema: FormSchema, filename?: string): void => {
  const data = exportFormSchema(schema, { format: 'json', minify: false });
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${schema.id}-schema.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const uploadSchema = (
  onLoad: (schema: FormSchema) => void,
  options?: ImportOptions
): void => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const schema = importFormSchema(event.target?.result as string, options);
          onLoad(schema);
        } catch (error) {
          console.error('Error importing schema:', error);
          throw error;
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};
