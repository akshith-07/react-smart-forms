import { evaluateCondition, evaluateConditionalRules } from '../conditionalLogic';
import { ConditionalRule, FormData } from '../../types';

describe('ConditionalLogic Utils', () => {
  describe('evaluateCondition', () => {
    it('evaluates equals operator correctly', () => {
      const rule: ConditionalRule = {
        fieldId: 'country',
        operator: 'equals',
        value: 'USA',
        action: 'show',
      };
      const formData: FormData = { country: 'USA' };

      expect(evaluateCondition(rule, formData)).toBe(true);
    });

    it('evaluates notEquals operator correctly', () => {
      const rule: ConditionalRule = {
        fieldId: 'country',
        operator: 'notEquals',
        value: 'USA',
        action: 'hide',
      };
      const formData: FormData = { country: 'Canada' };

      expect(evaluateCondition(rule, formData)).toBe(true);
    });

    it('evaluates contains operator for strings', () => {
      const rule: ConditionalRule = {
        fieldId: 'email',
        operator: 'contains',
        value: '@gmail.com',
        action: 'show',
      };
      const formData: FormData = { email: 'user@gmail.com' };

      expect(evaluateCondition(rule, formData)).toBe(true);
    });

    it('evaluates contains operator for arrays', () => {
      const rule: ConditionalRule = {
        fieldId: 'interests',
        operator: 'contains',
        value: 'sports',
        action: 'show',
      };
      const formData: FormData = { interests: ['music', 'sports', 'travel'] };

      expect(evaluateCondition(rule, formData)).toBe(true);
    });

    it('evaluates greaterThan operator correctly', () => {
      const rule: ConditionalRule = {
        fieldId: 'age',
        operator: 'greaterThan',
        value: 18,
        action: 'show',
      };
      const formData: FormData = { age: 25 };

      expect(evaluateCondition(rule, formData)).toBe(true);
    });

    it('evaluates lessThan operator correctly', () => {
      const rule: ConditionalRule = {
        fieldId: 'rating',
        operator: 'lessThan',
        value: 3,
        action: 'show',
      };
      const formData: FormData = { rating: 2 };

      expect(evaluateCondition(rule, formData)).toBe(true);
    });

    it('evaluates isEmpty operator correctly', () => {
      const rule: ConditionalRule = {
        fieldId: 'comment',
        operator: 'isEmpty',
        value: null,
        action: 'hide',
      };
      const formData: FormData = { comment: '' };

      expect(evaluateCondition(rule, formData)).toBe(true);
    });

    it('evaluates isNotEmpty operator correctly', () => {
      const rule: ConditionalRule = {
        fieldId: 'name',
        operator: 'isNotEmpty',
        value: null,
        action: 'show',
      };
      const formData: FormData = { name: 'John' };

      expect(evaluateCondition(rule, formData)).toBe(true);
    });
  });

  describe('evaluateConditionalRules', () => {
    it('returns default state when no rules', () => {
      const result = evaluateConditionalRules(undefined, {});

      expect(result).toEqual({
        visible: true,
        enabled: true,
        required: false,
      });
    });

    it('hides field when show condition is not met', () => {
      const rules: ConditionalRule[] = [
        {
          fieldId: 'userType',
          operator: 'equals',
          value: 'premium',
          action: 'show',
        },
      ];
      const formData: FormData = { userType: 'basic' };

      const result = evaluateConditionalRules(rules, formData);
      expect(result.visible).toBe(false);
    });

    it('makes field required when condition is met', () => {
      const rules: ConditionalRule[] = [
        {
          fieldId: 'hasChildren',
          operator: 'equals',
          value: 'yes',
          action: 'require',
        },
      ];
      const formData: FormData = { hasChildren: 'yes' };

      const result = evaluateConditionalRules(rules, formData);
      expect(result.required).toBe(true);
    });

    it('disables field when condition is met', () => {
      const rules: ConditionalRule[] = [
        {
          fieldId: 'autoFill',
          operator: 'equals',
          value: true,
          action: 'disable',
        },
      ];
      const formData: FormData = { autoFill: true };

      const result = evaluateConditionalRules(rules, formData);
      expect(result.enabled).toBe(false);
    });
  });
});
