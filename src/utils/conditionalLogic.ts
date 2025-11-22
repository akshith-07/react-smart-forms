import { ConditionalRule, ConditionalOperator, FormData } from '../types';

export const evaluateCondition = (
  rule: ConditionalRule,
  formData: FormData
): boolean => {
  const fieldValue = formData[rule.fieldId];

  switch (rule.operator) {
    case 'equals':
      return fieldValue === rule.value;

    case 'notEquals':
      return fieldValue !== rule.value;

    case 'contains':
      if (typeof fieldValue === 'string' && typeof rule.value === 'string') {
        return fieldValue.includes(rule.value);
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(rule.value);
      }
      return false;

    case 'greaterThan':
      return Number(fieldValue) > Number(rule.value);

    case 'lessThan':
      return Number(fieldValue) < Number(rule.value);

    case 'isEmpty':
      if (Array.isArray(fieldValue)) {
        return fieldValue.length === 0;
      }
      return !fieldValue || fieldValue === '';

    case 'isNotEmpty':
      if (Array.isArray(fieldValue)) {
        return fieldValue.length > 0;
      }
      return !!fieldValue && fieldValue !== '';

    default:
      return false;
  }
};

export const evaluateConditionalRules = (
  rules: ConditionalRule[] | undefined,
  formData: FormData
): {
  visible: boolean;
  enabled: boolean;
  required: boolean;
} => {
  if (!rules || rules.length === 0) {
    return { visible: true, enabled: true, required: false };
  }

  let visible = true;
  let enabled = true;
  let required = false;

  rules.forEach((rule) => {
    const conditionMet = evaluateCondition(rule, formData);

    switch (rule.action) {
      case 'show':
        if (!conditionMet) visible = false;
        break;
      case 'hide':
        if (conditionMet) visible = false;
        break;
      case 'enable':
        if (!conditionMet) enabled = false;
        break;
      case 'disable':
        if (conditionMet) enabled = false;
        break;
      case 'require':
        if (conditionMet) required = true;
        break;
    }
  });

  return { visible, enabled, required };
};

export const getVisibleFields = (
  fields: Array<{ id: string; conditionalRules?: ConditionalRule[] }>,
  formData: FormData
): string[] => {
  return fields
    .filter((field) => {
      const { visible } = evaluateConditionalRules(field.conditionalRules, formData);
      return visible;
    })
    .map((field) => field.id);
};
