import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { FormSchema, FieldConfig, DraggableField, FormBuilderConfig, FieldType } from '../types';
import { ThemeProvider } from '../themes/ThemeProvider';
import { downloadSchema, uploadSchema } from '../utils/schemaExport';

const ItemTypes = {
  FIELD: 'field',
  FORM_FIELD: 'form_field',
};

const BuilderContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  min-height: 600px;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
`;

const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding-right: ${({ theme }) => theme.spacing.lg};
`;

const SidebarTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const FieldLibrary = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DraggableFieldItem = styled.div<{ isDragging?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: move;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const Canvas = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CanvasHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CanvasTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: opacity 0.2s;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
    background-color: ${theme.colors.primary};
    color: ${theme.colors.background};
  `
      : `
    background-color: transparent;
    color: ${theme.colors.secondary};
    border: 1px solid ${theme.colors.border};
  `}

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const DropZone = styled.div<{ isOver?: boolean; isEmpty?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px dashed
    ${({ theme, isOver }) => (isOver ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, isOver }) =>
    isOver ? `${theme.colors.primary}10` : theme.colors.background};
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s;

  ${({ isEmpty }) =>
    isEmpty &&
    `
    justify-content: center;
    align-items: center;
  `}
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const FormFieldItem = styled.div<{ isDragging?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  cursor: move;
  transition: all 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FieldLabel = styled.div`
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const FieldType = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize.lg};

  &:hover {
    opacity: 0.7;
  }
`;

const defaultAvailableFields: DraggableField[] = [
  { id: 'text', type: 'text', label: 'Text Input' },
  { id: 'email', type: 'email', label: 'Email' },
  { id: 'password', type: 'password', label: 'Password' },
  { id: 'number', type: 'number', label: 'Number' },
  { id: 'tel', type: 'tel', label: 'Phone' },
  { id: 'url', type: 'url', label: 'URL' },
  { id: 'textarea', type: 'textarea', label: 'Text Area' },
  { id: 'select', type: 'select', label: 'Select Dropdown' },
  { id: 'radio', type: 'radio', label: 'Radio Buttons' },
  { id: 'checkbox', type: 'checkbox', label: 'Checkbox' },
  { id: 'checkboxGroup', type: 'checkboxGroup', label: 'Checkbox Group' },
  { id: 'switch', type: 'switch', label: 'Switch' },
  { id: 'file', type: 'file', label: 'File Upload' },
  { id: 'date', type: 'date', label: 'Date' },
  { id: 'datetime', type: 'datetime', label: 'Date Time' },
  { id: 'time', type: 'time', label: 'Time' },
  { id: 'range', type: 'range', label: 'Range Slider' },
  { id: 'rating', type: 'rating', label: 'Rating' },
  { id: 'color', type: 'color', label: 'Color Picker' },
];

interface DraggableFieldComponentProps {
  field: DraggableField;
}

const DraggableFieldComponent: React.FC<DraggableFieldComponentProps> = ({ field }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FIELD,
    item: { field },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <DraggableFieldItem ref={drag} isDragging={isDragging}>
      {field.icon} {field.label}
    </DraggableFieldItem>
  );
};

interface FormFieldComponentProps {
  field: FieldConfig;
  index: number;
  onRemove: (index: number) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

const FormFieldComponent: React.FC<FormFieldComponentProps> = ({ field, index, onRemove, onMove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FORM_FIELD,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.FORM_FIELD,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  }));

  return (
    <FormFieldItem ref={(node) => drag(drop(node))} isDragging={isDragging}>
      <FieldHeader>
        <div>
          <FieldLabel>{field.label}</FieldLabel>
          <FieldType>{field.type}</FieldType>
        </div>
        <DeleteButton onClick={() => onRemove(index)}>×</DeleteButton>
      </FieldHeader>
    </FormFieldItem>
  );
};

export interface FormBuilderProps extends FormBuilderConfig {
  theme?: 'default' | 'bootstrap' | 'tailwind' | 'material';
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  availableFields = defaultAvailableFields,
  showFieldLibrary = true,
  showPreview = true,
  allowExport = true,
  allowImport = true,
  onSchemaChange,
  initialSchema,
  theme = 'default',
}) => {
  const [schema, setSchema] = useState<FormSchema>(
    initialSchema || {
      id: 'new-form',
      title: 'New Form',
      fields: [],
    }
  );

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.FIELD,
    drop: (item: { field: DraggableField }) => {
      addField(item.field);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const addField = useCallback((draggableField: DraggableField) => {
    const newField: FieldConfig = {
      id: `field-${Date.now()}`,
      type: draggableField.type,
      label: draggableField.label,
      name: `field_${Date.now()}`,
      ...draggableField.config,
    };

    const updatedSchema = {
      ...schema,
      fields: [...(schema.fields || []), newField],
    };

    setSchema(updatedSchema);
    if (onSchemaChange) {
      onSchemaChange(updatedSchema);
    }
  }, [schema, onSchemaChange]);

  const removeField = useCallback((index: number) => {
    const updatedFields = [...(schema.fields || [])];
    updatedFields.splice(index, 1);

    const updatedSchema = {
      ...schema,
      fields: updatedFields,
    };

    setSchema(updatedSchema);
    if (onSchemaChange) {
      onSchemaChange(updatedSchema);
    }
  }, [schema, onSchemaChange]);

  const moveField = useCallback((dragIndex: number, hoverIndex: number) => {
    const updatedFields = [...(schema.fields || [])];
    const [draggedField] = updatedFields.splice(dragIndex, 1);
    updatedFields.splice(hoverIndex, 0, draggedField);

    const updatedSchema = {
      ...schema,
      fields: updatedFields,
    };

    setSchema(updatedSchema);
    if (onSchemaChange) {
      onSchemaChange(updatedSchema);
    }
  }, [schema, onSchemaChange]);

  const handleExport = () => {
    downloadSchema(schema);
  };

  const handleImport = () => {
    uploadSchema((importedSchema) => {
      setSchema(importedSchema);
      if (onSchemaChange) {
        onSchemaChange(importedSchema);
      }
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <BuilderContainer>
          {showFieldLibrary && (
            <Sidebar>
              <SidebarTitle>Field Types</SidebarTitle>
              <FieldLibrary>
                {availableFields.map((field) => (
                  <DraggableFieldComponent key={field.id} field={field} />
                ))}
              </FieldLibrary>
            </Sidebar>
          )}

          <Canvas>
            <CanvasHeader>
              <CanvasTitle>{schema.title}</CanvasTitle>
              <ButtonGroup>
                {allowImport && (
                  <Button variant="secondary" onClick={handleImport}>
                    Import
                  </Button>
                )}
                {allowExport && (
                  <Button variant="secondary" onClick={handleExport}>
                    Export
                  </Button>
                )}
              </ButtonGroup>
            </CanvasHeader>

            <DropZone ref={drop} isOver={isOver} isEmpty={!schema.fields || schema.fields.length === 0}>
              {!schema.fields || schema.fields.length === 0 ? (
                <EmptyState>Drag and drop fields here to build your form</EmptyState>
              ) : (
                schema.fields.map((field, index) => (
                  <FormFieldComponent
                    key={field.id}
                    field={field}
                    index={index}
                    onRemove={removeField}
                    onMove={moveField}
                  />
                ))
              )}
            </DropZone>
          </Canvas>
        </BuilderContainer>
      </ThemeProvider>
    </DndProvider>
  );
};
