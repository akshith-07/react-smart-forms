import React from 'react';
import styled from 'styled-components';
import { RangeFieldConfig } from '../../types';

interface RangeFieldProps {
  config: RangeFieldConfig;
  value?: unknown;
  onChange: (value: number) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const RangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RangeInput = styled.input`
  width: 100%;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.border};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border: none;

    &:hover {
      transform: scale(1.1);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const RangeValue = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const RangeField: React.FC<RangeFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const currentValue = (value as number) || config.min;

  return (
    <RangeWrapper>
      <RangeInput
        id={config.id}
        name={config.name}
        type="range"
        value={currentValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled || readonly}
        min={config.min}
        max={config.max}
        step={config.step || 1}
        aria-label={config.ariaLabel || config.label}
        aria-valuemin={config.min}
        aria-valuemax={config.max}
        aria-valuenow={currentValue}
        aria-required={config.required}
      />
      {config.showValue && <RangeValue>{currentValue}</RangeValue>}
      <RangeLabels>
        <span>{config.min}</span>
        <span>{config.max}</span>
      </RangeLabels>
    </RangeWrapper>
  );
};
