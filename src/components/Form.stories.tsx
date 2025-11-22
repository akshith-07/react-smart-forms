import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';
import { FormSchema } from '../types';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

const basicSchema: FormSchema = {
  id: 'basic-form',
  title: 'Contact Form',
  description: 'Please fill out this form',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Name',
      name: 'name',
      placeholder: 'Enter your name',
      required: true,
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      name: 'email',
      placeholder: 'your@email.com',
      required: true,
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Message',
      name: 'message',
      placeholder: 'Your message',
      rows: 4,
    },
  ],
  submitButton: {
    text: 'Submit',
    position: 'center',
  },
};

export const Basic: Story = {
  args: {
    schema: basicSchema,
    onSubmit: (data) => console.log('Form submitted:', data),
  },
};

const gridSchema: FormSchema = {
  id: 'grid-form',
  title: 'Registration Form',
  description: 'Create your account',
  layout: 'grid',
  gridColumns: 2,
  fields: [
    {
      id: 'firstName',
      type: 'text',
      label: 'First Name',
      name: 'firstName',
      required: true,
    },
    {
      id: 'lastName',
      type: 'text',
      label: 'Last Name',
      name: 'lastName',
      required: true,
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      name: 'email',
      required: true,
    },
    {
      id: 'phone',
      type: 'tel',
      label: 'Phone',
      name: 'phone',
    },
    {
      id: 'address',
      type: 'textarea',
      label: 'Address',
      name: 'address',
      gridColumn: '1 / -1',
    },
  ],
  submitButton: {
    text: 'Register',
    position: 'right',
  },
  resetButton: {
    show: true,
    text: 'Clear',
  },
};

export const GridLayout: Story = {
  args: {
    schema: gridSchema,
    onSubmit: (data) => console.log('Form submitted:', data),
  },
};

const allFieldsSchema: FormSchema = {
  id: 'all-fields-form',
  title: 'All Field Types',
  description: 'Showcase of all available field types',
  fields: [
    {
      id: 'text',
      type: 'text',
      label: 'Text Input',
      name: 'text',
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      name: 'email',
    },
    {
      id: 'number',
      type: 'number',
      label: 'Number',
      name: 'number',
    },
    {
      id: 'select',
      type: 'select',
      label: 'Select',
      name: 'select',
      options: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
      ],
    },
    {
      id: 'radio',
      type: 'radio',
      label: 'Radio Buttons',
      name: 'radio',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: 'checkbox',
      type: 'checkbox',
      label: 'I agree to terms',
      name: 'checkbox',
    },
    {
      id: 'date',
      type: 'date',
      label: 'Date',
      name: 'date',
    },
    {
      id: 'range',
      type: 'range',
      label: 'Range',
      name: 'range',
      min: 0,
      max: 100,
      showValue: true,
    },
    {
      id: 'rating',
      type: 'rating',
      label: 'Rating',
      name: 'rating',
      max: 5,
    },
  ],
  submitButton: {
    text: 'Submit',
  },
};

export const AllFieldTypes: Story = {
  args: {
    schema: allFieldsSchema,
    onSubmit: (data) => console.log('Form submitted:', data),
  },
};
