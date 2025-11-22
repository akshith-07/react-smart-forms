import React, { useState } from 'react';
import { FormBuilder, FormSchema, Form } from '../src';

export const FormBuilderExample: React.FC = () => {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSchemaChange = (newSchema: FormSchema) => {
    setSchema(newSchema);
    console.log('Schema updated:', newSchema);
  };

  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>Form Builder Demo</h1>
        <button
          onClick={() => setShowPreview(!showPreview)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      <FormBuilder
        onSchemaChange={handleSchemaChange}
        showFieldLibrary={true}
        allowExport={true}
        allowImport={true}
        theme="default"
      />

      {showPreview && schema && (
        <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ddd' }}>
          <h2>Form Preview</h2>
          <Form schema={schema} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};
