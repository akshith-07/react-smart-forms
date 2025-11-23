import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AutocompleteFieldConfig, FieldOption } from '../../types';

interface AutocompleteFieldProps {
  config: AutocompleteFieldConfig;
  value?: unknown;
  onChange: (value: string | number) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const AutocompleteWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input<{ disabled?: boolean; readonly?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme, readonly }) => (readonly ? theme.colors.disabled : '#ffffff')};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: ${({ disabled, readonly }) => (disabled || readonly ? 'not-allowed' : 'text')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.disabled};
  }
`;

const DropdownList = styled.ul<{ show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  max-height: 250px;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

const DropdownItem = styled.li<{ selected?: boolean; highlighted?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme, selected, highlighted }) =>
    selected || highlighted ? `${theme.colors.primary}22` : 'transparent'};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}33`};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}44;
  }
`;

const NoResults = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.disabled};
  text-align: center;
`;

const LoadingIndicator = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<FieldOption[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const minChars = config.minChars || 1;

  useEffect(() => {
    // Set initial input value from selected value
    if (value !== undefined && value !== null) {
      const selectedOption = config.options.find((opt) => opt.value === value);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    }
  }, [value, config.options]);

  useEffect(() => {
    // Filter options based on input
    const filterOptions = async () => {
      if (inputValue.length < minChars) {
        setFilteredOptions([]);
        setShowDropdown(false);
        return;
      }

      if (config.fetchOptions) {
        // Fetch options asynchronously
        setIsLoading(true);
        try {
          const options = await config.fetchOptions(inputValue);
          setFilteredOptions(options);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching autocomplete options:', error);
          setFilteredOptions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Filter static options
        const filtered = config.options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
        setShowDropdown(filtered.length > 0);
      }
    };

    const debounce = setTimeout(filterOptions, 300);
    return () => clearTimeout(debounce);
  }, [inputValue, config, minChars]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        onBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    onFocus();
    if (filteredOptions.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleOptionClick = (option: FieldOption) => {
    setInputValue(option.label);
    onChange(option.value);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <AutocompleteWrapper ref={wrapperRef}>
      <Input
        ref={inputRef}
        id={config.id}
        name={config.name}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={config.placeholder}
        disabled={disabled}
        readonly={readonly}
        aria-label={config.ariaLabel || config.label}
        aria-required={config.required}
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        autoComplete="off"
      />
      <DropdownList show={showDropdown} role="listbox">
        {isLoading ? (
          <LoadingIndicator>Loading...</LoadingIndicator>
        ) : filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <DropdownItem
              key={option.value}
              selected={value === option.value}
              highlighted={index === highlightedIndex}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.icon && <span style={{ marginRight: '8px' }}>{option.icon}</span>}
              {option.label}
            </DropdownItem>
          ))
        ) : (
          inputValue.length >= minChars && <NoResults>No results found</NoResults>
        )}
      </DropdownList>
    </AutocompleteWrapper>
  );
};
