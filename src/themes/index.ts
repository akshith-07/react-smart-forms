import { Theme, ThemeName } from '../types';

export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    background: '#ffffff',
    text: '#1f2937',
    border: '#d1d5db',
    disabled: '#9ca3af',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

export const bootstrapTheme: Theme = {
  name: 'bootstrap',
  colors: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    background: '#ffffff',
    text: '#212529',
    border: '#dee2e6',
    disabled: '#6c757d',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '3rem',
  },
  borderRadius: {
    sm: '0.2rem',
    md: '0.25rem',
    lg: '0.3rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    sm: '0 .125rem .25rem rgba(0,0,0,.075)',
    md: '0 .5rem 1rem rgba(0,0,0,.15)',
    lg: '0 1rem 3rem rgba(0,0,0,.175)',
  },
};

export const tailwindTheme: Theme = {
  name: 'tailwind',
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#06b6d4',
    background: '#ffffff',
    text: '#111827',
    border: '#e5e7eb',
    disabled: '#9ca3af',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
};

export const materialTheme: Theme = {
  name: 'material',
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    background: '#ffffff',
    text: '#000000de',
    border: '#00000042',
    disabled: '#00000061',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  shadows: {
    sm: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    md: '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    lg: '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  },
};

export const themes: Record<ThemeName, Theme> = {
  default: defaultTheme,
  bootstrap: bootstrapTheme,
  tailwind: tailwindTheme,
  material: materialTheme,
};

export const getTheme = (themeName: ThemeName = 'default'): Theme => {
  return themes[themeName] || defaultTheme;
};
