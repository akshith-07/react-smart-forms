import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextField } from '../fields/TextField';
import { TextFieldConfig } from '../../types';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../themes';

const mockConfig: TextFieldConfig = {
  id: 'test-field',
  type: 'text',
  label: 'Test Field',
  name: 'testField',
  placeholder: 'Enter text',
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={defaultTheme}>{component}</ThemeProvider>);
};

describe('TextField Component', () => {
  it('renders with correct attributes', () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    renderWithTheme(
      <TextField
        config={mockConfig}
        value=""
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );

    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('text');
  });

  it('calls onChange when value changes', () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    renderWithTheme(
      <TextField
        config={mockConfig}
        value=""
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );

    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(onChange).toHaveBeenCalledWith('Hello');
  });

  it('calls onBlur when field loses focus', () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    renderWithTheme(
      <TextField
        config={mockConfig}
        value=""
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );

    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.blur(input);

    expect(onBlur).toHaveBeenCalled();
  });

  it('calls onFocus when field gains focus', () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    renderWithTheme(
      <TextField
        config={mockConfig}
        value=""
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );

    const input = screen.getByPlaceholderText('Enter text');
    fireEvent.focus(input);

    expect(onFocus).toHaveBeenCalled();
  });

  it('renders as disabled when disabled prop is true', () => {
    const onChange = jest.fn();
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    renderWithTheme(
      <TextField
        config={mockConfig}
        value=""
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={true}
      />
    );

    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
