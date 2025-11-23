import React, { useRef } from 'react';
import styled from 'styled-components';
import { FileFieldConfig } from '../../types';

interface FileFieldProps {
  config: FileFieldConfig;
  value?: unknown;
  onChange: (value: FileList | null) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FileInput = styled.input`
  display: none;
`;

const FileButton = styled.button<{ disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme, disabled }) => (disabled ? theme.colors.disabled : theme.colors.primary)};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const FileInfo = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const FileField: React.FC<FileFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      onChange(null);
      return;
    }

    // Validate file count
    if (config.maxFiles && files.length > config.maxFiles) {
      alert(`Maximum ${config.maxFiles} file(s) allowed`);
      e.target.value = '';
      return;
    }

    // Validate file sizes and types
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size
      if (config.maxSize && file.size > config.maxSize) {
        alert(
          `File "${file.name}" exceeds maximum size of ${(config.maxSize / 1024 / 1024).toFixed(2)} MB`
        );
        e.target.value = '';
        return;
      }

      // Check MIME type if accept is specified
      if (config.accept) {
        const acceptedTypes = config.accept.split(',').map((t) => t.trim());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const mimeType = file.type;

        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith('.')) {
            return fileExtension === type.toLowerCase();
          }
          if (type.endsWith('/*')) {
            const category = type.split('/')[0];
            return mimeType.startsWith(category + '/');
          }
          return mimeType === type;
        });

        if (!isAccepted) {
          alert(`File "${file.name}" is not an accepted file type. Accepted: ${config.accept}`);
          e.target.value = '';
          return;
        }
      }
    }

    onChange(e.target.files);
  };

  const getFileNames = () => {
    if (value instanceof FileList) {
      return Array.from(value).map(f => f.name).join(', ');
    }
    return 'No file selected';
  };

  return (
    <FileInputWrapper>
      <FileInput
        ref={inputRef}
        id={config.id}
        name={config.name}
        type="file"
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled || readonly}
        accept={config.accept}
        multiple={config.multiple}
        aria-label={config.ariaLabel || config.label}
        aria-required={config.required}
      />
      <FileButton
        type="button"
        onClick={handleClick}
        disabled={disabled || readonly}
      >
        Choose {config.multiple ? 'Files' : 'File'}
      </FileButton>
      <FileInfo>{getFileNames()}</FileInfo>
      {config.maxSize && (
        <FileInfo>Max file size: {(config.maxSize / 1024 / 1024).toFixed(2)} MB</FileInfo>
      )}
    </FileInputWrapper>
  );
};
