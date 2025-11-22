import React from 'react';
import { Form, FormSchema } from '../src';

const conditionalFormSchema: FormSchema = {
  id: 'survey-form',
  title: 'Customer Survey',
  description: 'Help us improve our service',
  theme: 'bootstrap',
  fields: [
    {
      id: 'customerType',
      type: 'radio',
      label: 'Are you a new or existing customer?',
      name: 'customerType',
      required: true,
      options: [
        { label: 'New Customer', value: 'new' },
        { label: 'Existing Customer', value: 'existing' },
      ],
    },
    {
      id: 'howHeard',
      type: 'select',
      label: 'How did you hear about us?',
      name: 'howHeard',
      required: true,
      options: [
        { label: 'Search Engine', value: 'search' },
        { label: 'Social Media', value: 'social' },
        { label: 'Friend/Family', value: 'referral' },
        { label: 'Advertisement', value: 'ad' },
        { label: 'Other', value: 'other' },
      ],
      conditionalRules: [
        {
          fieldId: 'customerType',
          operator: 'equals',
          value: 'new',
          action: 'show',
        },
      ],
    },
    {
      id: 'otherSource',
      type: 'text',
      label: 'Please specify',
      name: 'otherSource',
      placeholder: 'Tell us where you heard about us',
      conditionalRules: [
        {
          fieldId: 'howHeard',
          operator: 'equals',
          value: 'other',
          action: 'show',
        },
      ],
    },
    {
      id: 'yearsCustomer',
      type: 'number',
      label: 'How many years have you been a customer?',
      name: 'yearsCustomer',
      min: 0,
      max: 100,
      conditionalRules: [
        {
          fieldId: 'customerType',
          operator: 'equals',
          value: 'existing',
          action: 'show',
        },
      ],
    },
    {
      id: 'satisfaction',
      type: 'rating',
      label: 'Rate your overall satisfaction',
      name: 'satisfaction',
      max: 5,
      required: true,
    },
    {
      id: 'improvement',
      type: 'textarea',
      label: 'What could we improve?',
      name: 'improvement',
      placeholder: 'Your feedback helps us improve...',
      rows: 4,
      conditionalRules: [
        {
          fieldId: 'satisfaction',
          operator: 'lessThan',
          value: 4,
          action: 'show',
        },
      ],
    },
    {
      id: 'recommend',
      type: 'radio',
      label: 'Would you recommend us to others?',
      name: 'recommend',
      required: true,
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
        { label: 'Maybe', value: 'maybe' },
      ],
    },
    {
      id: 'testimonial',
      type: 'textarea',
      label: 'Would you like to share a testimonial?',
      name: 'testimonial',
      placeholder: 'Share your experience...',
      rows: 3,
      conditionalRules: [
        {
          fieldId: 'recommend',
          operator: 'equals',
          value: 'yes',
          action: 'show',
        },
      ],
    },
  ],
  submitButton: {
    text: 'Submit Survey',
    position: 'center',
  },
};

export const ConditionalLogicExample: React.FC = () => {
  const handleSubmit = async (data: any) => {
    console.log('Survey data:', data);
    await fetch('/api/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <Form schema={conditionalFormSchema} onSubmit={handleSubmit} />
    </div>
  );
};
