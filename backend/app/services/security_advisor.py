def generate_security_advice(result: dict):
    findings = []

    headers = result.get("security_headers", {})

    # HSTS
    if not headers.get("Strict-Transport-Security"):
        findings.append({
            "title": "Strict-Transport-Security (HSTS) Missing",
            "severity": "Medium",
            "problem": "The HSTS security header is missing.",
            "impact": "Browsers may not be instructed to always use HTTPS.",
            "solution": "Enable HSTS after confirming that the website works correctly over HTTPS.",
            "example": "Strict-Transport-Security: max-age=31536000; includeSubDomains",
            "priority": "Medium"
        })

    # CSP
    if not headers.get("Content-Security-Policy"):
        findings.append({
            "title": "Content-Security-Policy (CSP) Missing",
            "severity": "Medium",
            "problem": "The Content-Security-Policy header is missing.",
            "impact": "A suitable CSP can reduce the impact of certain XSS and unwanted content injection attacks.",
            "solution": "Configure a CSP policy based on the application's trusted resources.",
            "example": "Content-Security-Policy: default-src 'self'",
            "priority": "Medium"
        })

    # X-Frame-Options
    if not headers.get("X-Frame-Options"):
        findings.append({
            "title": "X-Frame-Options Missing",
            "severity": "Medium",
            "problem": "The X-Frame-Options header is missing.",
            "impact": "The application may have reduced protection against clickjacking.",
            "solution": "Configure X-Frame-Options or an appropriate CSP frame-ancestors policy.",
            "example": "X-Frame-Options: SAMEORIGIN",
            "priority": "Medium"
        })

    # X-Content-Type-Options
    if not headers.get("X-Content-Type-Options"):
        findings.append({
            "title": "X-Content-Type-Options Missing",
            "severity": "Low",
            "problem": "The X-Content-Type-Options header is missing.",
            "impact": "Browsers may perform MIME-type sniffing.",
            "solution": "Add the nosniff directive to the response header.",
            "example": "X-Content-Type-Options: nosniff",
            "priority": "Low"
        })

    score = result.get("security_score", 0)

    if score >= 80:
        summary = "The website has a relatively strong security posture based on the checks performed."
    elif score >= 50:
        summary = "The website has a moderate security posture and several security improvements are recommended."
    else:
        summary = "The website has significant security weaknesses that should be reviewed and remediated."

    return {
        "target": result.get("url"),
        "security_score": score,
        "security_grade": result.get("security_grade"),
        "risk_level": result.get("risk_level"),
        "summary": summary,
        "total_findings": len(findings),
        "findings": findings
    }