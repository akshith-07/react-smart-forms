import React from 'react';
import { MultiStepForm, FormSchema } from '../src';

const multiStepFormSchema: FormSchema = {
  id: 'registration-form',
  title: 'User Registration',
  description: 'Complete all steps to create your account',
  theme: 'material',
  showProgress: true,
  steps: [
    {
      id: 'step1',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: [
        {
          id: 'firstName',
          type: 'text',
          label: 'First Name',
          name: 'firstName',
          placeholder: 'John',
          required: true,
        },
        {
          id: 'lastName',
          type: 'text',
          label: 'Last Name',
          name: 'lastName',
          placeholder: 'Doe',
          required: true,
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          name: 'email',
          placeholder: 'john@example.com',
          required: true,
        },
        {
          id: 'phone',
          type: 'tel',
          label: 'Phone',
          name: 'phone',
          placeholder: '+1 (555) 000-0000',
        },
      ],
    },
    {
      id: 'step2',
      title: 'Account Details',
      description: 'Set up your account credentials',
      fields: [
        {
          id: 'username',
          type: 'text',
          label: 'Username',
          name: 'username',
          placeholder: 'johndoe',
          required: true,
          validation: [
            {
              type: 'min',
              value: 3,
              message: 'Username must be at least 3 characters',
            },
          ],
        },
        {
          id: 'password',
          type: 'password',
          label: 'Password',
          name: 'password',
          placeholder: '••••••••',
          required: true,
          validation: [
            {
              type: 'min',
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          ],
        },
        {
          id: 'confirmPassword',
          type: 'password',
          label: 'Confirm Password',
          name: 'confirmPassword',
          placeholder: '••••••••',
          required: true,
        },
      ],
    },
    {
      id: 'step3',
      title: 'Preferences',
      description: 'Customize your experience',
      fields: [
        {
          id: 'interests',
          type: 'checkboxGroup',
          label: 'Interests',
          name: 'interests',
          options: [
            { label: 'Technology', value: 'tech' },
            { label: 'Sports', value: 'sports' },
            { label: 'Music', value: 'music' },
            { label: 'Travel', value: 'travel' },
            { label: 'Food', value: 'food' },
          ],
        },
        {
          id: 'notifications',
          type: 'radio',
          label: 'Email Notifications',
          name: 'notifications',
          required: true,
          options: [
            { label: 'All notifications', value: 'all' },
            { label: 'Important only', value: 'important' },
            { label: 'None', value: 'none' },
          ],
        },
        {
          id: 'terms',
          type: 'checkbox',
          label: 'I agree to the Terms and Conditions',
          name: 'terms',
          required: true,
        },
      ],
    },
  ],
  analytics: {
    enabled: true,
    trackViews: true,
    trackInteractions: true,
    trackCompletions: true,
    trackErrors: true,
  },
};

export const MultiStepFormExample: React.FC = () => {
  const handleSubmit = async (data: any) => {
    console.log('Registration data:', data);
    // Create user account
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  const handleStepChange = (step: number) => {
    console.log('Moved to step:', step + 1);
  };

  return (
    <div style={{ padding: '20px' }}>
      <MultiStepForm
        schema={multiStepFormSchema}
        onSubmit={handleSubmit}
        hooks={{
          onStepChange: handleStepChange,
        }}
      />
    </div>
  );
};
