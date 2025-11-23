import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { SelectFieldConfig, FieldOption } from '../../types';

interface MultiSelectFieldProps {
  config: SelectFieldConfig & { type: 'multi-select'; multiple: true };
  value?: unknown;
  onChange: (value: (string | number)[]) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const MultiSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectContainer = styled.div<{ disabled?: boolean; readonly?: boolean; focused?: boolean }>`
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, readonly }) => (readonly ? theme.colors.disabled : '#ffffff')};
  border: 1px solid ${({ theme, focused }) => (focused ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: ${({ disabled, readonly }) => (disabled || readonly ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  transition: border-color 0.2s, box-shadow 0.2s;

  ${({ focused, theme }) =>
    focused &&
    `
    box-shadow: 0 0 0 3px ${theme.colors.primary}33;
  `}
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary}22;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}44;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 1px;
  }
`;

const Placeholder = styled.span`
  color: ${({ theme }) => theme.colors.disabled};
  font-size: ${({ theme }) => theme.fontSize.md};
  padding: ${({ theme }) => theme.spacing.xs};
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

const DropdownItem = styled.li<{ selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme, selected }) => (selected ? `${theme.colors.primary}22` : 'transparent')};
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}33`};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border}44;
  }
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.md};

  &::placeholder {
    color: ${({ theme }) => theme.colors.disabled};
  }
`;

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedValues = Array.isArray(value) ? value : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
        onBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const handleContainerClick = () => {
    if (disabled || readonly) return;
    setShowDropdown(!showDropdown);
    setIsFocused(true);
    onFocus();
    searchInputRef.current?.focus();
  };

  const handleOptionToggle = (option: FieldOption) => {
    if (disabled || readonly) return;

    const isSelected = selectedValues.includes(option.value);
    let newValues: (string | number)[];

    if (isSelected) {
      newValues = selectedValues.filter((v) => v !== option.value);
    } else {
      newValues = [...selectedValues, option.value];
    }

    onChange(newValues);
  };

  const handleRemoveTag = (valueToRemove: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readonly) return;

    const newValues = selectedValues.filter((v) => v !== valueToRemove);
    onChange(newValues);
  };

  const getSelectedOptions = (): FieldOption[] => {
    return config.options.filter((opt) => selectedValues.includes(opt.value));
  };

  const getFilteredOptions = (): FieldOption[] => {
    if (!searchQuery) return config.options;

    return config.options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readonly) return;
    onChange([]);
  };

  const selectedOptions = getSelectedOptions();
  const filteredOptions = getFilteredOptions();

  return (
    <MultiSelectWrapper ref={wrapperRef}>
      <SelectContainer
        onClick={handleContainerClick}
        disabled={disabled}
        readonly={readonly}
        focused={isFocused}
        role="button"
        aria-label={config.ariaLabel || config.label}
        aria-required={config.required}
        aria-expanded={showDropdown}
        tabIndex={disabled || readonly ? -1 : 0}
      >
        {selectedOptions.map((option) => (
          <Tag key={option.value}>
            {option.icon && <span>{option.icon}</span>}
            {option.label}
            <RemoveButton
              type="button"
              onClick={(e) => handleRemoveTag(option.value, e)}
              aria-label={`Remove ${option.label}`}
              tabIndex={-1}
            >
              ×
            </RemoveButton>
          </Tag>
        ))}
        {config.searchable && showDropdown && (
          <SearchInput
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={selectedOptions.length === 0 ? config.placeholder || 'Search...' : ''}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {selectedOptions.length === 0 && !showDropdown && (
          <Placeholder>{config.placeholder || 'Select options...'}</Placeholder>
        )}
      </SelectContainer>

      <DropdownList show={showDropdown} role="listbox" aria-multiselectable="true">
        {config.clearable && selectedValues.length > 0 && (
          <DropdownItem onClick={handleClearAll}>
            <strong>Clear all ({selectedValues.length})</strong>
          </DropdownItem>
        )}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <DropdownItem
                key={option.value}
                selected={isSelected}
                onClick={() => handleOptionToggle(option)}
                role="option"
                aria-selected={isSelected}
              >
                <Checkbox
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  disabled={option.disabled}
                  tabIndex={-1}
                />
                {option.icon && <span>{option.icon}</span>}
                {option.label}
              </DropdownItem>
            );
          })
        ) : (
          <DropdownItem>
            <span style={{ color: '#999' }}>No options found</span>
          </DropdownItem>
        )}
      </DropdownList>
    </MultiSelectWrapper>
  );
};
