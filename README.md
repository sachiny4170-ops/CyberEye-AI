\# 🛡️ CyberEye AI



\## Intelligent Website Security Assessment Platform



CyberEye AI is a web-based security assessment platform designed to analyze website security and provide a clear security assessment based on multiple security checks.



It helps users analyze \*\*SSL/TLS, DNS records, security headers, common ports, security score, risk level, and security recommendations\*\* from a single dashboard.



\---



\## 🚀 Key Features



\### 🔍 Website Security Scanner

Analyze a target website and collect important security information.



\### 🔐 SSL/TLS Certificate Analysis

Check:



\- SSL/TLS certificate validity

\- Certificate issuer

\- Expiry date

\- Remaining certificate days



\### 🛡️ Security Header Analysis

Check important HTTP security headers:



\- Strict-Transport-Security

\- Content-Security-Policy

\- X-Frame-Options

\- X-Content-Type-Options



\### 🌐 DNS Analysis

Retrieve available DNS records associated with the target domain.



\### 🔌 Common Port Assessment

Check commonly used ports such as:



\- FTP — 21

\- SSH — 22

\- SMTP — 25

\- DNS — 53

\- HTTP — 80

\- POP3 — 110

\- IMAP — 143

\- HTTPS — 443

\- MySQL — 3306

\- RDP — 3389



\### 📊 Security Score \& Risk Assessment



CyberEye AI generates:



\- Security Score

\- Security Grade

\- Risk Level

\- Response Time



\### 🤖 AI Security Advisor



The AI Security Advisor analyzes security findings and provides:



\- Identified security problems

\- Severity

\- Potential impact

\- Recommended solution

\- Example security configuration

\- Priority



\### 📄 Professional PDF Security Report



Generate a professional security assessment report containing:



\- Target information

\- Security score

\- Risk assessment

\- SSL/TLS information

\- Security headers

\- Port assessment

\- Security recommendations

\- Security findings



\---



\## 🖥️ Dashboard



The CyberEye AI dashboard provides a simple interface where users can enter a website and perform a security assessment.



\---



\## 📸 Screenshots



\### 🏠 CyberEye AI Dashboard



!\[CyberEye AI Dashboard](./screenshots/dashboard.png)



\### ℹ️ About CyberEye AI



!\[About CyberEye AI](./screenshots/about.png)



\### ⚙️ CyberEye AI Features



!\[CyberEye AI Features](./screenshots/features.png)



\### 👨‍💻 Project Information



!\[Project Information](./screenshots/footer.png)



\---



\## 🏗️ Project Architecture



```text

CyberEye-AI

│

├── backend

│   └── app

│       ├── database

│       ├── models

│       ├── services

│       │   ├── dns\_service.py

│       │   ├── port\_scanner.py

│       │   ├── security\_advisor.py

│       │   └── history\_service.py

│       │

│       └── main.py

│

├── frontend

│   ├── public

│   └── src

│       ├── components

│       ├── pages

│       ├── services

│       └── utils

│

├── screenshots

│

├── .gitignore

├── package.json

├── start-cybereye.bat

└── README.md

