# Contributing to react-smart-forms

Thank you for your interest in contributing to react-smart-forms! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x
- Git

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/react-smart-forms.git
   cd react-smart-forms
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Linting

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors automatically
```

### Type Checking

```bash
npm run typecheck     # Run TypeScript type checking
```

### Building

```bash
npm run build         # Build the package
npm run dev          # Build in watch mode
```

### Storybook

```bash
npm run storybook           # Start Storybook dev server
npm run build-storybook     # Build Storybook for production
```

## Making Changes

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body

footer
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

Examples:
```
feat(form): add autocomplete field type
fix(validation): resolve email validation issue
docs(readme): update installation instructions
test(form): add tests for conditional logic
```

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing Requirements

- Write tests for all new features
- Ensure existing tests pass
- Maintain code coverage above 70%
- Include both unit and integration tests

### Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Create Storybook stories for new components
- Update CHANGELOG.md

## Pull Request Process

1. **Update your fork:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure quality:**
   - All tests pass
   - No linting errors
   - TypeScript compiles
   - Code coverage maintained

3. **Create pull request:**
   - Use a clear title and description
   - Reference related issues
   - Include screenshots for UI changes
   - List breaking changes (if any)

4. **Review process:**
   - Address reviewer feedback
   - Keep PR focused and atomic
   - Rebase if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
- [ ] Added tests
- [ ] All tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added
- [ ] All tests pass
```

## Adding New Features

### New Field Type

1. Create field component in `src/components/fields/`
2. Add type definition in `src/types/index.ts`
3. Update `FormField.tsx` to include new type
4. Add tests in `__tests__/`
5. Create Storybook story
6. Update documentation

Example:
```tsx
// src/components/fields/CustomField.tsx
import React from 'react';
import styled from 'styled-components';
import { CustomFieldConfig } from '../../types';

export const CustomField: React.FC<CustomFieldProps> = ({
  config,
  value,
  onChange,
  onBlur,
  onFocus,
}) => {
  // Implementation
};
```

### New Validation Rule

1. Add validation type in `src/types/index.ts`
2. Implement validator in `src/validators/`
3. Add tests
4. Update documentation

### New Theme

1. Create theme in `src/themes/index.ts`
2. Add to themes export
3. Update documentation

## Reporting Bugs

### Before Submitting

- Check existing issues
- Try latest version
- Collect debug information

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- react-smart-forms version:
- React version:
- Browser:
- OS:

## Additional Context
Screenshots, error messages, etc.
```

## Feature Requests

### Feature Request Template

```markdown
## Problem
What problem does this solve?

## Proposed Solution
Describe your solution

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other relevant information
```

## Style Guide

### TypeScript

```typescript
// Use explicit types
interface Props {
  name: string;
  age: number;
}

// Use meaningful names
const getUserData = async (userId: string): Promise<User> => {
  // Implementation
};

// Avoid 'any' type
const data: unknown = getApiData();
```

### React Components

```tsx
// Use functional components
export const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  // Implementation
};

// Use styled-components for styling
const StyledDiv = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;
```

### Tests

```tsx
describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange
    const props = { ... };

    // Act
    render(<Component {...props} />);

    // Assert
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

## Questions?

- 📧 Email: dev@react-smart-forms.com
- 💬 Discord: [Join our community](https://discord.gg/react-smart-forms)
- 📖 Documentation: [docs.react-smart-forms.com](https://docs.react-smart-forms.com)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to react-smart-forms! 🎉
