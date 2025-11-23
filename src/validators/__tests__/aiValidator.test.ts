import { AIValidator } from '../aiValidator';

// Mock the Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('{"valid": true, "message": ""}'),
        },
      }),
    }),
  })),
}));

describe('AIValidator', () => {
  const mockApiKey = 'test-api-key';

  describe('initialization', () => {
    it('initializes with API key', () => {
      const validator = new AIValidator(mockApiKey);
      expect(validator).toBeInstanceOf(AIValidator);
    });

    it('can be initialized without API key', () => {
      const validator = new AIValidator();
      expect(validator).toBeInstanceOf(AIValidator);
    });
  });

  describe('validateField', () => {
    it('validates field with professionalism check', async () => {
      const validator = new AIValidator(mockApiKey);
      const result = await validator.validateField('test@business.com', {
        enabled: true,
        checkProfessionalism: true,
      });

      expect(result).toHaveProperty('valid');
      expect(typeof result.valid).toBe('boolean');
    });

    it('validates field with appropriate content check', async () => {
      const validator = new AIValidator(mockApiKey);
      const result = await validator.validateField('This is appropriate content', {
        enabled: true,
        checkAppropriate: true,
      });

      expect(result).toHaveProperty('valid');
    });

    it('validates field with custom checks', async () => {
      const validator = new AIValidator(mockApiKey);
      const result = await validator.validateField('Custom text', {
        enabled: true,
        customChecks: ['Is this text polite?'],
      });

      expect(result).toHaveProperty('valid');
    });

    it('fails gracefully on API error', async () => {
      const validator = new AIValidator(mockApiKey);
      // Override the model to simulate error
      (validator as any).model = {
        generateContent: jest.fn().mockRejectedValue(new Error('API Error')),
      };

      const result = await validator.validateField('test', {
        enabled: true,
      });

      expect(result.valid).toBe(true); // Fails gracefully
      expect(result.message).toBe('AI validation temporarily unavailable');
    });
  });

  describe('validateEmail', () => {
    it('validates professional email', async () => {
      const validator = new AIValidator(mockApiKey);
      const result = await validator.validateEmail('john@company.com', true);

      expect(result).toHaveProperty('valid');
    });

    it('validates email format', async () => {
      const validator = new AIValidator(mockApiKey);
      const result = await validator.validateEmail('test@example.com', false);

      expect(result).toHaveProperty('valid');
    });
  });

  describe('validateText', () => {
    it('validates text with multiple options', async () => {
      const validator = new AIValidator(mockApiKey);
      const result = await validator.validateText('Professional business text', {
        checkAppropriate: true,
        checkProfessionalism: true,
        minWords: 2,
        maxWords: 10,
      });

      expect(result).toHaveProperty('valid');
    });

    it('validates text with custom prompt', async () => {
      const validator = new AIValidator(mockApiKey);
      const result = await validator.validateText('Custom text', {
        customPrompt: 'Is this text {text} appropriate?',
      });

      expect(result).toHaveProperty('valid');
    });
  });

  describe('response parsing', () => {
    it('parses valid JSON response', () => {
      const validator = new AIValidator(mockApiKey);
      const result = (validator as any).parseResponse('{"valid": true, "message": "Good"}');

      expect(result.valid).toBe(true);
      expect(result.message).toBe('Good');
    });

    it('parses invalid JSON response with fallback', () => {
      const validator = new AIValidator(mockApiKey);
      const result = (validator as any).parseResponse('This is valid and true');

      expect(result.valid).toBe(true);
    });

    it('handles malformed responses gracefully', () => {
      const validator = new AIValidator(mockApiKey);
      const result = (validator as any).parseResponse('Random text');

      expect(result.valid).toBe(true); // Default to valid
    });
  });
});
