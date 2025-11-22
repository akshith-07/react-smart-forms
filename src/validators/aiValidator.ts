import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIValidationConfig } from '../types';

export class AIValidator {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.initialize(apiKey);
    }
  }

  initialize(apiKey: string): void {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async validateField(
    value: string,
    config: AIValidationConfig
  ): Promise<{ valid: boolean; message?: string }> {
    if (!this.model) {
      if (!config.apiKey) {
        throw new Error('Gemini API key is required for AI validation');
      }
      this.initialize(config.apiKey);
    }

    try {
      const prompt = this.buildPrompt(value, config);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseResponse(text);
    } catch (error) {
      console.error('AI validation error:', error);
      return {
        valid: true, // Fail gracefully
        message: 'AI validation temporarily unavailable',
      };
    }
  }

  private buildPrompt(value: string, config: AIValidationConfig): string {
    if (config.prompt) {
      return config.prompt.replace('{value}', value);
    }

    const checks: string[] = [];

    if (config.checkProfessionalism) {
      checks.push('- Is this text professional and appropriate for business communication?');
    }

    if (config.checkAppropriate) {
      checks.push('- Is this text free from offensive, harmful, or inappropriate content?');
    }

    if (config.customChecks && config.customChecks.length > 0) {
      config.customChecks.forEach((check) => {
        checks.push(`- ${check}`);
      });
    }

    if (checks.length === 0) {
      checks.push('- Is this text appropriate and valid?');
    }

    return `Please analyze the following text and answer these questions:

${checks.join('\n')}

Text: "${value}"

Respond in JSON format with:
{
  "valid": true/false,
  "message": "explanation if invalid, empty if valid"
}

Only respond with the JSON object, nothing else.`;
  }

  private parseResponse(text: string): { valid: boolean; message?: string } {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          valid: parsed.valid === true,
          message: parsed.message || undefined,
        };
      }

      // Fallback: check for keywords
      const lowerText = text.toLowerCase();
      if (lowerText.includes('valid') && lowerText.includes('true')) {
        return { valid: true };
      }
      if (lowerText.includes('invalid') || lowerText.includes('false')) {
        return {
          valid: false,
          message: 'Content does not meet validation criteria',
        };
      }

      // Default to valid if we can't parse
      return { valid: true };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return { valid: true };
    }
  }

  async validateEmail(email: string, checkProfessional = true): Promise<{ valid: boolean; message?: string }> {
    if (!this.model) {
      throw new Error('AI validator not initialized');
    }

    const prompt = checkProfessional
      ? `Is "${email}" a professional email address (not from free email providers like gmail, yahoo, hotmail, etc.)? Respond with JSON: {"valid": true/false, "message": "reason if invalid"}`
      : `Is "${email}" a valid email format? Respond with JSON: {"valid": true/false, "message": "reason if invalid"}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return this.parseResponse(text);
    } catch (error) {
      console.error('AI email validation error:', error);
      return { valid: true };
    }
  }

  async validateText(
    text: string,
    options: {
      checkAppropriate?: boolean;
      checkProfessionalism?: boolean;
      minWords?: number;
      maxWords?: number;
      customPrompt?: string;
    } = {}
  ): Promise<{ valid: boolean; message?: string }> {
    if (!this.model) {
      throw new Error('AI validator not initialized');
    }

    const checks: string[] = [];

    if (options.checkAppropriate) {
      checks.push('free from inappropriate content');
    }

    if (options.checkProfessionalism) {
      checks.push('professional and business-appropriate');
    }

    if (options.minWords) {
      checks.push(`at least ${options.minWords} words`);
    }

    if (options.maxWords) {
      checks.push(`no more than ${options.maxWords} words`);
    }

    const prompt = options.customPrompt
      ? options.customPrompt.replace('{text}', text)
      : `Analyze this text: "${text}"\n\nCheck if it is: ${checks.join(', ')}.\n\nRespond with JSON: {"valid": true/false, "message": "reason if invalid"}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();
      return this.parseResponse(responseText);
    } catch (error) {
      console.error('AI text validation error:', error);
      return { valid: true };
    }
  }
}

// Singleton instance
let aiValidatorInstance: AIValidator | null = null;

export const getAIValidator = (apiKey?: string): AIValidator => {
  if (!aiValidatorInstance) {
    aiValidatorInstance = new AIValidator(apiKey);
  } else if (apiKey) {
    aiValidatorInstance.initialize(apiKey);
  }
  return aiValidatorInstance;
};
