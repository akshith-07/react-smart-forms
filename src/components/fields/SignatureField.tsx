import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { BaseFieldConfig } from '../../types';

interface SignatureFieldProps {
  config: BaseFieldConfig & { type: 'signature' };
  value?: unknown;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const SignatureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Canvas = styled.canvas<{ disabled?: boolean; readonly?: boolean }>`
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: ${({ disabled, readonly }) => (disabled || readonly ? 'not-allowed' : 'crosshair')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  background-color: ${({ theme, readonly }) => (readonly ? theme.colors.disabled : '#ffffff')};
  touch-action: none;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.background : theme.colors.text};
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : 'transparent'};
  border: 1px solid ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
    background-color: ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.primary : theme.colors.border}22;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const SignatureField: React.FC<SignatureFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setContext(ctx);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    // Load existing signature if provided
    if (typeof value === 'string' && value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, [value]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || readonly || !context) return;

    setIsDrawing(true);
    onFocus();

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    // Save signature as base64 image
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onChange(dataUrl);
    }

    onBlur();
  };

  const clearSignature = () => {
    if (!context || !canvasRef.current) return;

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange('');
  };

  return (
    <SignatureWrapper>
      <Canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        disabled={disabled}
        readonly={readonly}
        aria-label={config.ariaLabel || config.label}
        aria-required={config.required}
        tabIndex={disabled || readonly ? -1 : 0}
      />
      <ButtonGroup>
        <Button
          type="button"
          variant="secondary"
          onClick={clearSignature}
          disabled={disabled || readonly}
        >
          Clear
        </Button>
      </ButtonGroup>
    </SignatureWrapper>
  );
};
