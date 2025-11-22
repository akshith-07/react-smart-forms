import type { Meta, StoryObj } from '@storybook/react';
import { FormBuilder } from './FormBuilder';

const meta: Meta<typeof FormBuilder> = {
  title: 'Components/FormBuilder',
  component: FormBuilder,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormBuilder>;

export const Default: Story = {
  args: {
    showFieldLibrary: true,
    allowExport: true,
    allowImport: true,
    onSchemaChange: (schema) => console.log('Schema changed:', schema),
  },
};

export const WithInitialSchema: Story = {
  args: {
    showFieldLibrary: true,
    allowExport: true,
    allowImport: true,
    initialSchema: {
      id: 'sample-form',
      title: 'Sample Form',
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Name',
          name: 'name',
          required: true,
        },
        {
          id: 'email',
          type: 'email',
          label: 'Email',
          name: 'email',
          required: true,
        },
      ],
    },
    onSchemaChange: (schema) => console.log('Schema changed:', schema),
  },
};

export const MinimalBuilder: Story = {
  args: {
    showFieldLibrary: true,
    allowExport: false,
    allowImport: false,
    onSchemaChange: (schema) => console.log('Schema changed:', schema),
  },
};
