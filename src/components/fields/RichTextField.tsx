import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { RichTextFieldConfig } from '../../types';

interface RichTextFieldProps {
  config: RichTextFieldConfig;
  value?: unknown;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}33;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
`;

const ToolButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme, active }) => (active ? theme.fontWeight.bold : theme.fontWeight.normal)};
  color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.text)};
  background-color: ${({ theme, active }) => (active ? `${theme.colors.primary}22` : 'transparent')};
  border: 1px solid ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s;
  min-width: 32px;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.border}44;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ContentEditable = styled.div<{ height?: number; disabled?: boolean; readonly?: boolean }>`
  min-height: ${({ height }) => (height ? `${height}px` : '200px')};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ readonly, theme }) => (readonly ? theme.colors.disabled : '#ffffff')};
  outline: none;
  overflow-y: auto;
  cursor: ${({ disabled, readonly }) => (disabled || readonly ? 'not-allowed' : 'text')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &[contenteditable='true']:empty:before {
    content: attr(data-placeholder);
    color: ${({ theme }) => theme.colors.disabled};
  }

  p {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.sm} 0;
  }

  ul, ol {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    padding-left: ${({ theme }) => theme.spacing.lg};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  code {
    background-color: ${({ theme }) => theme.colors.background};
    padding: 2px 4px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-family: monospace;
  }
`;

export const RichTextField: React.FC<RichTextFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const defaultToolbar = config.toolbar || [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'h1',
    'h2',
    'ul',
    'ol',
    'link',
    'code',
  ];

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateValue();
  };

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const renderToolbarButton = (tool: string) => {
    const isActive = isFocused && document.queryCommandState(tool);

    switch (tool) {
      case 'bold':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={() => execCommand('bold')}
            disabled={disabled || readonly}
            active={isActive}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolButton>
        );
      case 'italic':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={() => execCommand('italic')}
            disabled={disabled || readonly}
            active={isActive}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </ToolButton>
        );
      case 'underline':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={() => execCommand('underline')}
            disabled={disabled || readonly}
            active={isActive}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </ToolButton>
        );
      case 'strikethrough':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={() => execCommand('strikeThrough')}
            disabled={disabled || readonly}
            active={isActive}
            title="Strikethrough"
          >
            <s>S</s>
          </ToolButton>
        );
      case 'h1':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={() => execCommand('formatBlock', '<h1>')}
            disabled={disabled || readonly}
            title="Heading 1"
          >
            H1
          </ToolButton>
        );
      case 'h2':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={() => execCommand('formatBlock', '<h2>')}
            disabled={disabled || readonly}
            title="Heading 2"
          >
            H2
          </ToolButton>
        );
      case 'ul':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            disabled={disabled || readonly}
            title="Bullet List"
          >
            •
          </ToolButton>
        );
      case 'ol':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            disabled={disabled || readonly}
            title="Numbered List"
          >
            1.
          </ToolButton>
        );
      case 'link':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={insertLink}
            disabled={disabled || readonly}
            title="Insert Link"
          >
            🔗
          </ToolButton>
        );
      case 'code':
        return (
          <ToolButton
            key={tool}
            type="button"
            onClick={() => execCommand('formatBlock', '<pre>')}
            disabled={disabled || readonly}
            title="Code Block"
          >
            {'<>'}
          </ToolButton>
        );
      default:
        return null;
    }
  };

  return (
    <EditorWrapper>
      <Toolbar>{defaultToolbar.map(renderToolbarButton)}</Toolbar>
      <ContentEditable
        ref={editorRef}
        contentEditable={!disabled && !readonly}
        dangerouslySetInnerHTML={{ __html: typeof value === 'string' ? value : '' }}
        onInput={updateValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        height={config.height}
        disabled={disabled}
        readonly={readonly}
        data-placeholder={config.placeholder || 'Start typing...'}
        aria-label={config.ariaLabel || config.label}
        aria-required={config.required}
        role="textbox"
        aria-multiline="true"
      />
    </EditorWrapper>
  );
};
