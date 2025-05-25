# Security Policy

## 🔒 Supported Versions

We actively maintain and provide security updates for the following versions of Enhanced Claude Export:

| Version | Supported          |
| ------- | ------------------ |
| 2.1.x   | ✅ Yes             |
| 2.0.x   | ✅ Yes             |
| < 2.0   | ❌ No              |

## 🛡️ Security Considerations

### Browser Environment
Enhanced Claude Export runs in your browser as a userscript and:

- **✅ Stays Local**: All conversation data remains in your browser
- **✅ No External Servers**: Does not send data to any external services
- **✅ No Data Collection**: Does not collect or transmit personal information
- **✅ Client-Side Only**: All processing happens locally on your device

### Data Handling
- **Conversation Export**: Exports are saved directly to your local device
- **No Cloud Storage**: Script does not automatically upload to cloud services
- **User Control**: You decide where and how to store exported conversations
- **Privacy First**: Your conversations remain private and under your control

## 🚨 Reporting Security Vulnerabilities

We take security seriously. If you discover a security vulnerability in Enhanced Claude Export, please help us maintain the security of the project and its users.

### How to Report

**For security vulnerabilities, please DO NOT use public GitHub issues.**

Instead, please report security issues via:

1. **Email**: [Create a secure contact method or use GitHub Security Advisory]
2. **GitHub Security Advisory**: Go to the Security tab → Report a vulnerability
3. **Private Message**: Contact @iikoshteruu directly

### What to Include

Please include the following information in your security report:

- **Vulnerability Type**: [e.g., XSS, code injection, data exposure]
- **Affected Versions**: Which versions are impacted
- **Impact Assessment**: Potential security implications
- **Reproduction Steps**: How to reproduce the vulnerability
- **Proof of Concept**: Code or screenshots demonstrating the issue
- **Suggested Fix**: If you have ideas for remediation

### Example Security Report

```
**Vulnerability Type:** Cross-Site Scripting (XSS)
**Affected Versions:** 2.1.0 and earlier
**Impact:** Potential execution of malicious scripts
**Reproduction Steps:**
1. Navigate to Claude.ai
2. Create conversation with malicious content: <script>alert('XSS')</script>
3. Export conversation
4. Open exported file
**Proof of Concept:** [Screenshot or code sample]
**Suggested Fix:** Implement proper HTML escaping in export functions
```

## ⚡ Response Timeline

We aim to respond to security reports according to the following timeline:

- **Initial Response**: Within 48 hours of report
- **Triage & Assessment**: Within 1 week
- **Fix Development**: Within 2 weeks for high-severity issues
- **Release & Disclosure**: Coordinated disclosure after fix is available

## 🛠️ Security Best Practices for Users

### Installation Security
- **Trusted Sources**: Only install from official repository or verified userscript sites
- **Code Review**: Review the script code before installation if you have technical knowledge
- **Update Regularly**: Keep the script updated to latest version
- **Userscript Manager**: Use reputable userscript managers (Tampermonkey, Greasemonkey)

### Usage Security
- **Browser Updates**: Keep your browser updated to latest version
- **Export Handling**: Be cautious when sharing exported conversations
- **Local Storage**: Store sensitive conversations securely on your device
- **Network Awareness**: Use secure networks when accessing Claude.ai

## 🔍 Security Features

### Built-in Protections
- **Input Sanitization**: Cleans conversation content during export
- **No Remote Execution**: Script does not execute remote code
- **Minimal Permissions**: Requires only necessary browser permissions
- **Isolated Operation**: Runs independently without affecting Claude.ai functionality

### Privacy Protections
- **No Tracking**: Script does not track user behavior
- **No Analytics**: No usage data collection or transmission
- **Local Processing**: All data processing happens locally
- **User Consent**: Exports only occur when explicitly requested by user

## 📋 Security Checklist for Contributors

If you're contributing code, please ensure:

- [ ] No hardcoded credentials or sensitive data
- [ ] Input validation for all user data
- [ ] Proper error handling without information disclosure
- [ ] No execution of untrusted code
- [ ] Minimal required permissions
- [ ] Code follows secure coding practices
- [ ] Dependencies are from trusted sources
- [ ] No introduction of new attack vectors

## 🔗 Related Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Browser Extension Security](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Userscript Security Guidelines](https://wiki.greasespot.net/Security)
- [Responsible Disclosure Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html)

## 🏆 Security Hall of Fame

We recognize and thank security researchers who help improve our security:

*No security issues reported yet - help us keep it that way!*

---

**Last Updated**: May 26, 2025  
**Next Review**: August 26, 2025

Thank you for helping keep Enhanced Claude Export secure! 🛡️
