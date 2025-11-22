import React, { useState } from 'react';
import styled from 'styled-components';
import { RatingFieldConfig } from '../../types';

interface RatingFieldProps {
  config: RatingFieldConfig;
  value?: unknown;
  onChange: (value: number) => void;
  onBlur: () => void;
  onFocus: () => void;
  disabled?: boolean;
  readonly?: boolean;
}

const RatingWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`;

const Star = styled.button<{ filled?: boolean; color?: string; disabled?: boolean }>`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ filled, color, theme }) => (filled ? color || theme.colors.warning : theme.colors.border)};
  padding: 0;
  transition: color 0.2s, transform 0.2s;

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const RatingField: React.FC<RatingFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  readonly,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const maxRating = config.max || 5;
  const currentValue = (value as number) || 0;

  const handleClick = (rating: number) => {
    if (!disabled && !readonly) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled && !readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  return (
    <RatingWrapper
      role="radiogroup"
      aria-label={config.ariaLabel || config.label}
      onBlur={onBlur}
      onFocus={onFocus}
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const rating = index + 1;
        const isFilled = rating <= (hoverValue || currentValue);

        return (
          <Star
            key={rating}
            type="button"
            filled={isFilled}
            color={config.color}
            disabled={disabled || readonly}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            aria-label={`Rate ${rating} out of ${maxRating}`}
            aria-checked={rating === currentValue}
            role="radio"
          >
            {config.icon || '★'}
          </Star>
        );
      })}
    </RatingWrapper>
  );
};
