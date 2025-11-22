# react-smart-forms

[![NPM Version](https://img.shields.io/npm/v/react-smart-forms.svg)](https://www.npmjs.com/package/react-smart-forms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Enterprise-grade React form builder with drag-and-drop interface and AI-powered validation using Google Gemini API**

## ✨ Features

- 🎨 **Drag-and-Drop Form Builder** - Visual form creation with intuitive interface
- 🤖 **AI-Powered Validation** - Validate inputs using Google Gemini API
- 📋 **20+ Pre-built Field Types** - Text, email, select, radio, checkbox, file upload, date, rating, and more
- 🔄 **Multi-Step Forms** - Create complex wizard-style forms with ease
- 🎯 **Conditional Logic** - Show/hide fields based on user input
- ✅ **Real-time Validation** - Built on Zod with custom error messages
- 📤 **Schema Export/Import** - Save and load form schemas as JSON
- 🎨 **Multiple Themes** - Default, Bootstrap, Tailwind, and Material Design
- 📱 **Responsive Design** - Works perfectly on all devices
- ♿ **Accessibility** - ARIA labels, keyboard navigation
- 📊 **Analytics Integration** - Track form views, completions, and interactions
- 🔧 **TypeScript Support** - Full type definitions included
- 🧪 **Well Tested** - Comprehensive test coverage with Jest

## 📦 Installation

```bash
npm install react-smart-forms
# or
yarn add react-smart-forms
# or
pnpm add react-smart-forms
```

## 🚀 Quick Start

### Basic Form

```tsx
import { Form, FormSchema } from 'react-smart-forms';

const schema: FormSchema = {
  id: 'contact-form',
  title: 'Contact Us',
  description: 'Fill out this form to get in touch',
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
    {
      id: 'message',
      type: 'textarea',
      label: 'Message',
      name: 'message',
      rows: 5,
    },
  ],
};

function App() {
  const handleSubmit = async (data) => {
    console.log('Form submitted:', data);
    // Send to your API
  };

  return <Form schema={schema} onSubmit={handleSubmit} />;
}
```

### Multi-Step Form

```tsx
import { MultiStepForm, FormSchema } from 'react-smart-forms';

const schema: FormSchema = {
  id: 'registration',
  title: 'User Registration',
  showProgress: true,
  steps: [
    {
      id: 'step1',
      title: 'Personal Info',
      fields: [
        { id: 'firstName', type: 'text', label: 'First Name', name: 'firstName', required: true },
        { id: 'lastName', type: 'text', label: 'Last Name', name: 'lastName', required: true },
      ],
    },
    {
      id: 'step2',
      title: 'Account Details',
      fields: [
        { id: 'email', type: 'email', label: 'Email', name: 'email', required: true },
        { id: 'password', type: 'password', label: 'Password', name: 'password', required: true },
      ],
    },
  ],
};

function App() {
  return <MultiStepForm schema={schema} onSubmit={handleSubmit} />;
}
```

### Form Builder

```tsx
import { FormBuilder } from 'react-smart-forms';

function App() {
  const handleSchemaChange = (schema) => {
    console.log('Schema updated:', schema);
  };

  return (
    <FormBuilder
      onSchemaChange={handleSchemaChange}
      allowExport={true}
      allowImport={true}
    />
  );
}
```

## 🎯 Field Types

react-smart-forms includes 20+ field types out of the box:

- **Text Inputs**: `text`, `email`, `password`, `tel`, `url`
- **Numbers**: `number`, `range`
- **Text Areas**: `textarea`, `rich-text`
- **Selection**: `select`, `multi-select`, `radio`, `autocomplete`
- **Checkboxes**: `checkbox`, `checkboxGroup`, `switch`
- **Files**: `file`
- **Date/Time**: `date`, `datetime`, `time`
- **Special**: `rating`, `color`, `signature`

## 🤖 AI Validation

Enable AI-powered validation using Google Gemini:

```tsx
import { Form } from 'react-smart-forms';

const schema = {
  id: 'form',
  fields: [
    {
      id: 'email',
      type: 'email',
      label: 'Work Email',
      name: 'email',
      aiValidation: {
        enabled: true,
        checkProfessionalism: true, // Checks if email is professional (not gmail, yahoo, etc.)
      },
    },
    {
      id: 'comment',
      type: 'textarea',
      label: 'Comment',
      name: 'comment',
      aiValidation: {
        enabled: true,
        checkAppropriate: true, // Checks for inappropriate content
        customChecks: ['Is this comment constructive and helpful?'],
      },
    },
  ],
};

<Form
  schema={schema}
  geminiApiKey={process.env.REACT_APP_GEMINI_API_KEY}
  onSubmit={handleSubmit}
/>
```

## 🎯 Conditional Logic

Show/hide fields based on user input:

```tsx
const schema = {
  id: 'survey',
  fields: [
    {
      id: 'hasChildren',
      type: 'radio',
      label: 'Do you have children?',
      name: 'hasChildren',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: 'numberOfChildren',
      type: 'number',
      label: 'How many children?',
      name: 'numberOfChildren',
      conditionalRules: [
        {
          fieldId: 'hasChildren',
          operator: 'equals',
          value: 'yes',
          action: 'show', // Only show if hasChildren === 'yes'
        },
      ],
    },
  ],
};
```

### Conditional Operators

- `equals` - Field value equals specified value
- `notEquals` - Field value does not equal specified value
- `contains` - Field value contains specified value (strings/arrays)
- `greaterThan` - Field value is greater than specified value
- `lessThan` - Field value is less than specified value
- `isEmpty` - Field value is empty
- `isNotEmpty` - Field value is not empty

### Conditional Actions

- `show` - Show field when condition is true
- `hide` - Hide field when condition is true
- `enable` - Enable field when condition is true
- `disable` - Disable field when condition is true
- `require` - Make field required when condition is true

## 🎨 Themes

Choose from 4 built-in themes:

```tsx
<Form schema={schema} theme="default" />    // Default theme
<Form schema={schema} theme="bootstrap" />  // Bootstrap style
<Form schema={schema} theme="tailwind" />   // Tailwind style
<Form schema={schema} theme="material" />   // Material Design
```

Or use the schema to set the theme:

```tsx
const schema = {
  id: 'form',
  theme: 'material',
  fields: [...],
};
```

## 📊 Analytics

Track form interactions:

```tsx
const schema = {
  id: 'form',
  analytics: {
    enabled: true,
    trackViews: true,
    trackInteractions: true,
    trackCompletions: true,
    trackErrors: true,
    provider: 'google', // 'google', 'segment', 'mixpanel', or 'custom'
    trackingId: 'GA-XXXXXXXXX',
    onEvent: (event) => {
      console.log('Analytics event:', event);
    },
  },
  fields: [...],
};
```

## 📤 Schema Export/Import

Save and load form schemas:

```tsx
import { exportFormSchema, importFormSchema, downloadSchema, uploadSchema } from 'react-smart-forms';

// Export schema as JSON string
const json = exportFormSchema(schema, { format: 'json', minify: false });

// Import schema from JSON string
const schema = importFormSchema(jsonString, { validate: true });

// Download schema as file
downloadSchema(schema, 'my-form-schema.json');

// Upload schema from file
uploadSchema((schema) => {
  console.log('Imported schema:', schema);
});
```

## 🔧 Custom Hooks

### useForm Hook

For building custom form components:

```tsx
import { useForm } from 'react-smart-forms';

function CustomForm() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleSubmit,
    setValue,
    validateField,
    getFieldState,
  } = useForm({
    schema: mySchema,
    hooks: {
      onSubmit: async (data) => {
        await api.submitForm(data);
      },
      onFieldChange: (fieldId, value) => {
        console.log(`${fieldId} changed to:`, value);
      },
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* Custom form fields */}
    </form>
  );
}
```

## 📋 Form Validation

Built on Zod with custom validation rules:

```tsx
const schema = {
  fields: [
    {
      id: 'password',
      type: 'password',
      label: 'Password',
      name: 'password',
      validation: [
        { type: 'required', message: 'Password is required' },
        { type: 'min', value: 8, message: 'Password must be at least 8 characters' },
        { type: 'pattern', value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)', message: 'Password must contain uppercase, lowercase, and number' },
        {
          type: 'custom',
          validator: (value) => !value.includes('password'),
          message: 'Password cannot contain the word "password"',
        },
      ],
    },
  ],
};
```

## 🎨 Layout Options

### Vertical Layout (Default)

```tsx
const schema = {
  layout: 'vertical',
  fields: [...],
};
```

### Grid Layout

```tsx
const schema = {
  layout: 'grid',
  gridColumns: 2,
  fields: [
    { id: 'firstName', type: 'text', label: 'First Name', name: 'firstName' },
    { id: 'lastName', type: 'text', label: 'Last Name', name: 'lastName' },
    {
      id: 'address',
      type: 'textarea',
      label: 'Address',
      name: 'address',
      gridColumn: '1 / -1' // Span full width
    },
  ],
};
```

## 🧪 Testing

The package includes comprehensive tests:

```bash
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📚 Storybook

View component examples:

```bash
npm run storybook
```

## 🔨 Building

```bash
npm run build         # Build the package
npm run dev          # Build in watch mode
```

## 📖 API Reference

### Form Props

| Prop | Type | Description |
|------|------|-------------|
| `schema` | `FormSchema` | Form configuration object |
| `onSubmit` | `(data: FormData) => void \| Promise<void>` | Submit handler |
| `hooks` | `FormHooks` | Additional form hooks |
| `initialData` | `FormData` | Initial form values |
| `geminiApiKey` | `string` | Google Gemini API key for AI validation |
| `className` | `string` | Custom CSS class |
| `style` | `React.CSSProperties` | Custom inline styles |

### MultiStepForm Props

Same as Form props, with schema containing `steps` instead of `fields`.

### FormBuilder Props

| Prop | Type | Description |
|------|------|-------------|
| `availableFields` | `DraggableField[]` | Custom field library |
| `showFieldLibrary` | `boolean` | Show/hide field library sidebar |
| `allowExport` | `boolean` | Enable schema export |
| `allowImport` | `boolean` | Enable schema import |
| `onSchemaChange` | `(schema: FormSchema) => void` | Schema change handler |
| `initialSchema` | `FormSchema` | Initial form schema |
| `theme` | `ThemeName` | Theme to use |

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT © [react-smart-forms]

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [styled-components](https://styled-components.com/)
- Validation with [Zod](https://github.com/colinhacks/zod)
- Drag and drop with [react-dnd](https://react-dnd.github.io/react-dnd/)
- AI powered by [Google Gemini](https://ai.google.dev/)

## 💬 Support

- 📧 Email: support@react-smart-forms.com
- 💬 Discord: [Join our community](https://discord.gg/react-smart-forms)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/react-smart-forms/issues)

## 🗺️ Roadmap

- [ ] More field types (signature, location picker)
- [ ] Form templates library
- [ ] Visual form analytics dashboard
- [ ] Internationalization (i18n)
- [ ] Form versioning and history
- [ ] Collaboration features
- [ ] WordPress plugin
- [ ] Mobile app (React Native)

---

Made with ❤️ by the react-smart-forms team
