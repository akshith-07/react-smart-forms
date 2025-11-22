import React from 'react';
import { Form, FormSchema } from '../src';

const basicFormSchema: FormSchema = {
  id: 'contact-form',
  title: 'Contact Us',
  description: 'Fill out this form to get in touch with us',
  theme: 'default',
  layout: 'vertical',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Full Name',
      name: 'name',
      placeholder: 'Enter your full name',
      required: true,
      validation: [
        {
          type: 'min',
          value: 2,
          message: 'Name must be at least 2 characters',
        },
      ],
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      name: 'email',
      placeholder: 'you@example.com',
      required: true,
      aiValidation: {
        enabled: true,
        checkProfessionalism: true,
      },
    },
    {
      id: 'phone',
      type: 'tel',
      label: 'Phone Number',
      name: 'phone',
      placeholder: '+1 (555) 000-0000',
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Message',
      name: 'message',
      placeholder: 'Tell us what you need...',
      required: true,
      rows: 5,
      validation: [
        {
          type: 'min',
          value: 10,
          message: 'Message must be at least 10 characters',
        },
      ],
      aiValidation: {
        enabled: true,
        checkAppropriate: true,
      },
    },
    {
      id: 'subscribe',
      type: 'checkbox',
      label: 'Subscribe to newsletter',
      name: 'subscribe',
    },
  ],
  submitButton: {
    text: 'Send Message',
    position: 'center',
  },
  resetButton: {
    show: true,
    text: 'Clear Form',
  },
};

export const BasicFormExample: React.FC = () => {
  const handleSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    // Send data to your API
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Form
        schema={basicFormSchema}
        onSubmit={handleSubmit}
        geminiApiKey={process.env.REACT_APP_GEMINI_API_KEY}
      />
    </div>
  );
};
