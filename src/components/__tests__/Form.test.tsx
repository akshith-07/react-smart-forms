import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../Form';
import { FormSchema } from '../../types';

const mockSchema: FormSchema = {
  id: 'test-form',
  title: 'Test Form',
  description: 'A test form',
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
};

describe('Form Component', () => {
  it('renders form with title and description', () => {
    render(<Form schema={mockSchema} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByText('A test form')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<Form schema={mockSchema} />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it('displays submit button', () => {
    render(<Form schema={mockSchema} />);

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    const handleSubmit = jest.fn();
    render(<Form schema={mockSchema} onSubmit={handleSubmit} />);

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
        })
      );
    });
  });

  it('validates required fields', async () => {
    render(<Form schema={mockSchema} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
  });

  it('resets form when reset button is clicked', () => {
    const schemaWithReset = {
      ...mockSchema,
      resetButton: { show: true, text: 'Reset' },
    };

    render(<Form schema={schemaWithReset} />);

    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: /reset/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');

    fireEvent.click(resetButton);
    expect(nameInput.value).toBe('');
  });
});
