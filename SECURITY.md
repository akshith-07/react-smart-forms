# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues. This could put all users at risk.

### 2. Report Privately

Send an email to: **security@react-smart-forms.com** (or create a private security advisory on GitHub)

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - **Critical**: 1-7 days
  - **High**: 7-14 days
  - **Medium**: 14-30 days
  - **Low**: 30-90 days

## Security Best Practices

### For Package Users

#### 1. **API Key Security**

**Never** commit API keys to version control:

```tsx
// ❌ BAD - Hardcoded API key
<Form geminiApiKey="AIzaSy..." />

// ✅ GOOD - Use environment variables
<Form geminiApiKey={process.env.REACT_APP_GEMINI_API_KEY} />
```

**Recommended**: Use environment variables or secret management services.

#### 2. **File Upload Security**

Always configure file upload restrictions:

```tsx
{
  id: 'document',
  type: 'file',
  accept: '.pdf,.doc,.docx', // Restrict file types
  maxSize: 5 * 1024 * 1024,   // 5MB limit
  maxFiles: 3,                 // Limit number of files
}
```

**Important**:
- Set `accept` to restrict file types
- Set `maxSize` to prevent large file uploads
- Set `maxFiles` to limit the number of uploads
- Validate files on the server side as well

#### 3. **XSS Prevention**

The library sanitizes user input, but when using `rich-text` fields:

```tsx
// When displaying rich text content, use DOMPurify or similar
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(formData.content);
```

#### 4. **CSRF Protection**

When submitting forms, implement CSRF tokens:

```tsx
const handleSubmit = async (data) => {
  await fetch('/api/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken(), // Your CSRF token
    },
    body: JSON.stringify(data),
  });
};
```

#### 5. **AI Validation Security**

AI validation sends data to Google Gemini API:

- **Be aware**: Field values are sent to external API
- **Avoid**: Sending sensitive personal information (SSN, credit cards, etc.)
- **Use for**: Public-facing content validation only

```tsx
// ❌ Don't use AI validation for sensitive data
{
  id: 'ssn',
  type: 'text',
  aiValidation: { enabled: false }, // Keep disabled
}

// ✅ Use AI validation for public content
{
  id: 'comment',
  type: 'textarea',
  aiValidation: {
    enabled: true,
    checkAppropriate: true,
  },
}
```

#### 6. **Content Security Policy (CSP)**

Add appropriate CSP headers to your application:

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               connect-src 'self' https://generativelanguage.googleapis.com;">
```

### For Package Contributors

#### 1. **Dependency Security**

- Run `npm audit` regularly
- Update dependencies promptly
- Review dependency changes before merging

#### 2. **Code Review**

All changes must:
- Pass security review
- Include tests
- Follow secure coding practices

#### 3. **Input Validation**

Always validate and sanitize user input:

```tsx
// Validate file uploads
if (file.size > MAX_SIZE) throw new Error('File too large');

// Sanitize text input
const sanitized = DOMPurify.sanitize(userInput);
```

## Known Security Considerations

### 1. **Client-Side Validation Only**

This library provides client-side validation. **Always validate on the server side as well.**

Client-side validation can be bypassed. Never trust client-side validation alone for security.

### 2. **File Upload Handling**

The library validates:
- File size (client-side)
- File type/MIME type (client-side)
- File count

**Server-side validation required**:
- Virus/malware scanning
- Content verification
- Secure storage
- Access control

### 3. **AI-Powered Validation**

When using AI validation:
- Data is sent to Google Gemini API
- Follow Google's data usage policies
- Consider privacy implications
- Don't send PII or sensitive data

### 4. **Rich Text Editor**

The rich text editor uses `contentEditable`:
- XSS risk if content is displayed without sanitization
- Always sanitize before rendering
- Use DOMPurify or similar library

## Security Updates

Security updates will be:
1. Released as patch versions (1.0.x)
2. Announced in:
   - GitHub Security Advisories
   - CHANGELOG.md
   - NPM package updates
3. Include migration guide if needed

## Security Checklist for Production

- [ ] API keys stored in environment variables
- [ ] File upload limits configured
- [ ] Server-side validation implemented
- [ ] CSRF protection enabled
- [ ] Content Security Policy headers set
- [ ] Regular security audits scheduled
- [ ] Dependencies kept up to date
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS enforced
- [ ] Input sanitization implemented

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [Google Gemini API Security](https://ai.google.dev/docs/safety_guidance)

## Credits

We appreciate security researchers and users who report vulnerabilities responsibly.

---

**Last Updated**: 2024-11-23
