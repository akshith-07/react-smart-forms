import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MultiStepForm } from '../MultiStepForm';
import { FormSchema } from '../../types';

const mockSchema: FormSchema = {
  id: 'test-multi-step-form',
  title: 'Multi-Step Form',
  showProgress: true,
  steps: [
    {
      id: 'step1',
      title: 'Personal Info',
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
      ],
    },
    {
      id: 'step2',
      title: 'Contact Info',
      fields: [
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
      ],
    },
  ],
};

describe('MultiStepForm Component', () => {
  it('renders first step initially', () => {
    render(<MultiStepForm schema={mockSchema} />);

    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
  });

  it('shows progress indicator when showProgress is true', () => {
    render(<MultiStepForm schema={mockSchema} />);

    expect(screen.getByText('Multi-Step Form')).toBeInTheDocument();
  });

  it('navigates to next step when Next button is clicked', async () => {
    render(<MultiStepForm schema={mockSchema} />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Contact Info')).toBeInTheDocument();
    });
  });

  it('navigates to previous step when Previous button is clicked', async () => {
    render(<MultiStepForm schema={mockSchema} />);

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Contact Info')).toBeInTheDocument();
    });

    const prevButton = screen.getByRole('button', { name: /previous|back/i });
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });
  });

  it('validates required fields before allowing next step', async () => {
    render(<MultiStepForm schema={mockSchema} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit when form is completed', async () => {
    const handleSubmit = jest.fn();
    render(<MultiStepForm schema={mockSchema} onSubmit={handleSubmit} />);

    // Fill step 1
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText('Contact Info')).toBeInTheDocument();
    });

    // Fill step 2
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        })
      );
    });
  });
});
