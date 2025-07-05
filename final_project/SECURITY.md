# Security Features

This application implements comprehensive security measures to protect against common web vulnerabilities and ensure data integrity.

## Security Enhancements Implemented

### 1. Password Security with bcrypt

- **Plain-text passwords replaced with bcrypt hashing**
  - Uses bcrypt with configurable salt rounds (default: 12)
  - Passwords are hashed before storage
  - Secure password comparison during authentication
  - Default user password is automatically hashed on startup

### 2. Environment Variables for Secrets

- **JWT and session secrets moved to environment variables**
  - Strong random defaults generated if not provided
  - Production warnings for default secrets
  - Configurable JWT expiration
  - Session security settings based on environment

### 3. Security Middleware

#### Helmet
- **Content Security Policy (CSP)** to prevent XSS attacks
- **HTTP Strict Transport Security (HSTS)** for HTTPS enforcement
- **X-Content-Type-Options** to prevent MIME sniffing
- **X-Frame-Options** to prevent clickjacking
- **X-XSS-Protection** for legacy browser protection

#### CORS
- **Cross-Origin Resource Sharing** with configurable origins
- Development mode allows all origins
- Production mode restricts to configured origins
- Supports credentials and preflight requests

#### Rate Limiting
- **General rate limiting**: 100 requests per 15 minutes
- **Authentication rate limiting**: 5 attempts per 15 minutes per IP+username
- **Registration rate limiting**: 3 registrations per hour per IP
- **Book operations rate limiting**: 30 requests per minute

### 4. Input Validation and Sanitization

#### express-validator Implementation
- **Registration validation**:
  - Username: 3-30 characters, alphanumeric only
  - Password: Minimum 8 characters with uppercase, lowercase, and number
- **Login validation**:
  - Required username and password fields
- **Book operations validation**:
  - Title, author validation with length limits
  - ISBN format validation
  - Review rating validation (1-5)
- **Input sanitization**: Trim and escape HTML entities

### 5. Session Security

- **httpOnly cookies** to prevent XSS access
- **secure cookies** in production
- **sameSite: 'strict'** for CSRF protection
- **Custom session name** (not default)
- **Configurable session expiration**

### 6. Additional Security Headers

- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts geolocation, microphone, camera
- **Server header removal**: Hides server information
- **X-Powered-By removal**: Hides framework information

## Environment Configuration

### Required Environment Variables for Production

```bash
# Essential Security Variables
NODE_ENV=production
JWT_SECRET=<64-character-random-string>
SESSION_SECRET=<64-character-random-string>
SESSION_SECURE=true

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting (optional, has defaults)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
BCRYPT_SALT_ROUNDS=12
```

### Generating Secure Secrets

```bash
# Generate a 64-character random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Security Best Practices

### 1. Password Policy
- Minimum 8 characters
- Must contain uppercase, lowercase, and number
- Hashed with bcrypt (12 salt rounds)

### 2. Rate Limiting Strategy
- Progressive rate limiting based on endpoint sensitivity
- IP-based and user-based limiting for authentication
- Health check endpoints excluded from rate limiting

### 3. Session Management
- Secure session configuration
- Automatic session cleanup
- CSRF protection via sameSite cookies

### 4. Input Validation
- Server-side validation for all inputs
- Sanitization to prevent XSS
- Type checking and format validation

### 5. Error Handling
- No sensitive information in error messages
- Consistent error responses
- Proper HTTP status codes

## Vulnerability Mitigation

### Cross-Site Scripting (XSS)
- ✅ Content Security Policy
- ✅ Input sanitization
- ✅ Output encoding
- ✅ httpOnly cookies

### Cross-Site Request Forgery (CSRF)
- ✅ sameSite cookies
- ✅ CORS configuration
- ✅ Secure session handling

### SQL Injection
- ✅ Input validation (applicable for future DB integration)
- ✅ Parameterized queries preparation

### Brute Force Attacks
- ✅ Authentication rate limiting
- ✅ Account lockout mechanisms via rate limiting
- ✅ Strong password requirements

### Denial of Service (DoS)
- ✅ Request rate limiting
- ✅ Payload size limits
- ✅ Connection limits

### Information Disclosure
- ✅ Error message sanitization
- ✅ Server header removal
- ✅ Secure defaults

## Monitoring and Logging

### Security Events Logged
- Failed authentication attempts
- Rate limit violations
- Invalid input attempts
- Session manipulation attempts

### Health Monitoring
- `/health` endpoint for monitoring
- No rate limiting on health checks
- Status and timestamp reporting

## Future Security Enhancements

### Recommended Additions
1. **Database Security**: Connection encryption, user permissions
2. **API Authentication**: API key management, OAuth2 integration
3. **Audit Logging**: Comprehensive security event logging
4. **Intrusion Detection**: Real-time threat monitoring
5. **Security Scanning**: Automated vulnerability assessments
6. **Backup Security**: Encrypted backups, secure storage

### Compliance Considerations
- GDPR: Data protection and privacy
- OWASP Top 10: Security vulnerability mitigation
- SOC 2: Security controls and monitoring
- PCI DSS: Payment card data protection (if applicable)

## Security Testing

### Recommended Tests
- Penetration testing
- Vulnerability scanning
- Authentication bypass testing
- Rate limiting validation
- Input validation testing
- Session security testing

## Incident Response

### Security Incident Handling
1. Immediate threat containment
2. Impact assessment
3. Root cause analysis
4. Security patch deployment
5. Post-incident monitoring

For security questions or to report vulnerabilities, please follow responsible disclosure practices.
