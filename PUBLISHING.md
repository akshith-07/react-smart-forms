# Publishing Guide for react-smart-forms

This guide will help you publish the react-smart-forms package to NPM.

## Prerequisites

Before publishing, ensure you have:

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **NPM CLI**: Install npm (comes with Node.js)
3. **Repository Access**: Push access to the GitHub repository

## Pre-Publishing Checklist

- [ ] All tests pass (`npm test`)
- [ ] Code lints without errors (`npm run lint`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Package version is updated in `package.json`
- [ ] CHANGELOG.md is updated
- [ ] README.md is complete and accurate
- [ ] All examples work correctly

## Step-by-Step Publishing Process

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
npm test
npm run test:coverage
```

Ensure all tests pass with good coverage (>70%).

### 3. Lint Code

```bash
npm run lint
npm run lint:fix
```

Fix any linting errors.

### 4. Type Check

```bash
npm run typecheck
```

Ensure TypeScript compiles without errors.

### 5. Build the Package

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Generate type definitions
- Bundle the package
- Create distribution files in `dist/`

### 6. Test the Build Locally

Before publishing, test the package locally:

```bash
# Create a tarball
npm pack

# In a test project
npm install /path/to/react-smart-forms-1.0.0.tgz
```

Test the package in a real project to ensure it works.

### 7. Update Version

Update the version in `package.json`:

```bash
# For patch release (1.0.0 -> 1.0.1)
npm version patch

# For minor release (1.0.0 -> 1.1.0)
npm version minor

# For major release (1.0.0 -> 2.0.0)
npm version major
```

This will:
- Update `package.json`
- Create a git tag
- Commit the changes

### 8. Update CHANGELOG

Update `CHANGELOG.md` with:
- New features
- Bug fixes
- Breaking changes
- Migration guide (if needed)

### 9. Login to NPM

```bash
npm login
```

Enter your NPM credentials.

### 10. Publish to NPM

For the first release:

```bash
npm publish --access public
```

For subsequent releases:

```bash
npm publish
```

### 11. Push to GitHub

```bash
git push origin main
git push --tags
```

### 12. Create GitHub Release

1. Go to your GitHub repository
2. Click on "Releases"
3. Click "Create a new release"
4. Select the version tag
5. Add release notes from CHANGELOG
6. Publish the release

## Post-Publishing

### Verify the Package

1. Check on NPM: `https://www.npmjs.com/package/react-smart-forms`
2. Install in a test project:
   ```bash
   npm install react-smart-forms
   ```
3. Test the installation

### Update Documentation

- Update website/documentation if applicable
- Announce the release on social media
- Update any demo applications

## NPM Scripts Reference

```json
{
  "build": "rollup -c",
  "dev": "rollup -c -w",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "lint": "eslint src --ext .ts,.tsx",
  "lint:fix": "eslint src --ext .ts,.tsx --fix",
  "typecheck": "tsc --noEmit",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build",
  "prepublishOnly": "npm run build && npm run test"
}
```

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes
- **MINOR** (1.0.0 -> 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 -> 1.0.1): Bug fixes, backwards compatible

## Common Issues

### Build Failures

If the build fails:
1. Clear `dist/` directory: `rm -rf dist`
2. Clear `node_modules/`: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

### TypeScript Errors

If TypeScript errors occur:
1. Check `tsconfig.json` configuration
2. Ensure all types are properly exported
3. Run `npm run typecheck` to see all errors

### Test Failures

If tests fail:
1. Run tests in watch mode: `npm run test:watch`
2. Debug individual test files
3. Check for environment-specific issues

### NPM Publish Errors

Common errors:

- **"You do not have permission to publish"**: Login with `npm login`
- **"Package name taken"**: Choose a different package name
- **"Version already published"**: Update version number
- **"402 Payment Required"**: Package name may be reserved

## Beta/Alpha Releases

For pre-release versions:

```bash
# Beta release
npm version prerelease --preid=beta
npm publish --tag beta

# Alpha release
npm version prerelease --preid=alpha
npm publish --tag alpha

# Install beta version
npm install react-smart-forms@beta
```

## Deprecating Versions

If you need to deprecate a version:

```bash
npm deprecate react-smart-forms@1.0.0 "Critical bug, please upgrade to 1.0.1"
```

## Unpublishing

⚠️ Only unpublish within 72 hours of publishing:

```bash
npm unpublish react-smart-forms@1.0.0
```

## CI/CD Setup (Optional)

For automated publishing with GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Security

- Never commit `.env` files
- Keep API keys secure
- Use `.npmignore` to exclude sensitive files
- Enable 2FA on NPM account

## Support

For issues during publishing:
- NPM Support: https://www.npmjs.com/support
- GitHub Issues: https://github.com/your-username/react-smart-forms/issues

---

Happy Publishing! 🚀
