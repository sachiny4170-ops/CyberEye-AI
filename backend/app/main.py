from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import requests
import ssl
import socket

from urllib.parse import urlparse
from datetime import datetime, timezone

from app.services.dns_service import get_dns_records
from app.services.port_scanner import scan_ports
from app.services.security_advisor import generate_security_advice


# ============================================================
# APP CONFIGURATION
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CyberEye AI",
    version="1.0.0",
    description="Intelligent Website Security Assessment Platform"
)



# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://cybereye-ai-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# USER MODEL
# ============================================================

class User(BaseModel):
    name: str
    email: str
    password: str


# ============================================================
# HOME API
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to CyberEye AI",
        "status": "online",
        "version": "1.0.0"
    }


# ============================================================
# HEALTH API
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "OK",
        "project": "CyberEye AI",
        "version": "1.0.0"
    }


# ============================================================
# REGISTER API
# ============================================================

@app.post("/register")
def register(user: User):
    return {
        "message": "Registration Successful",
        "user": {
            "name": user.name,
            "email": user.email
        }
    }


# ============================================================
# LOGIN API
# ============================================================

@app.post("/login")
def login(email: str, password: str):
    return {
        "message": "Login Successful",
        "email": email
    }


# ============================================================
# SSL CERTIFICATE SCANNER
# ============================================================

def get_ssl_certificate(hostname):

    try:

        context = ssl.create_default_context()

        with socket.create_connection(
            (hostname, 443),
            timeout=5
        ) as sock:

            with context.wrap_socket(
                sock,
                server_hostname=hostname
            ) as ssock:

                cert = ssock.getpeercert()

        issuer = {}

        for item in cert.get("issuer", []):
            for key, value in item:
                issuer[key] = value

        expiry = datetime.strptime(
            cert["notAfter"],
            "%b %d %H:%M:%S %Y %Z"
        ).replace(tzinfo=timezone.utc)

        now = datetime.now(timezone.utc)

        days_remaining = (expiry - now).days

        return {
            "valid": True,
            "issuer": issuer,
            "expiry_date": expiry.strftime("%Y-%m-%d"),
            "days_remaining": days_remaining
        }

    except Exception as error:

        return {
            "valid": False,
            "error": str(error)
        }


# ============================================================
# SECURITY SCORE
# ============================================================

def calculate_security_score(
    https_enabled,
    hsts,
    csp,
    xfo,
    xcto
):

    score = 0
    recommendations = []

    # HTTPS
    if https_enabled:
        score += 20
    else:
        recommendations.append(
            "Enable HTTPS"
        )

    # HSTS
    if hsts:
        score += 20
    else:
        recommendations.append(
            "Enable HSTS"
        )

    # CSP
    if csp:
        score += 20
    else:
        recommendations.append(
            "Add Content Security Policy"
        )

    # X-Frame-Options
    if xfo:
        score += 20
    else:
        recommendations.append(
            "Add X-Frame-Options"
        )

    # X-Content-Type-Options
    if xcto:
        score += 20
    else:
        recommendations.append(
            "Add X-Content-Type-Options"
        )

    # Risk
    if score >= 80:
        risk = "Low"
    elif score >= 50:
        risk = "Medium"
    else:
        risk = "High"

    # Grade
    if score >= 90:
        grade = "A"
    elif score >= 80:
        grade = "B"
    elif score >= 70:
        grade = "C"
    elif score >= 60:
        grade = "D"
    else:
        grade = "F"

    return score, grade, risk, recommendations


# ============================================================
# WEBSITE SECURITY SCANNER
# ============================================================

@app.get("/scan")
def scan(url: str):

    try:

        # ----------------------------------------------------
        # CLEAN URL
        # ----------------------------------------------------

        url = url.strip()

        if not url:
            return {
                "error": "Website URL is required"
            }

        # Add HTTPS automatically
        if not url.startswith(
            ("http://", "https://")
        ):
            url = "https://" + url

        # Validate URL
        parsed_url = urlparse(url)

        hostname = parsed_url.hostname

        if not hostname:
            return {
                "error": "Invalid website URL"
            }

        # ----------------------------------------------------
        # WEBSITE REQUEST
        # ----------------------------------------------------

        response = requests.get(
            url,
            timeout=15,
            allow_redirects=True,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 "
                    "(Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 "
                    "Chrome/120 Safari/537.36"
                )
            }
        )

        # ----------------------------------------------------
        # RESPONSE TIME
        # ----------------------------------------------------

        response_time = round(
            response.elapsed.total_seconds() * 1000,
            2
        )

        # ----------------------------------------------------
        # FINAL URL
        # ----------------------------------------------------

        final_url = response.url

        final_hostname = (
            urlparse(final_url).hostname
            or hostname
        )

        # ----------------------------------------------------
        # HTTPS
        # ----------------------------------------------------

        https_enabled = final_url.startswith(
            "https://"
        )

        # ----------------------------------------------------
        # SECURITY HEADERS
        # ----------------------------------------------------

        hsts = response.headers.get(
            "Strict-Transport-Security"
        )

        csp = response.headers.get(
            "Content-Security-Policy"
        )

        xfo = response.headers.get(
            "X-Frame-Options"
        )

        xcto = response.headers.get(
            "X-Content-Type-Options"
        )

        # ----------------------------------------------------
        # SECURITY SCORE
        # ----------------------------------------------------

        (
            score,
            grade,
            risk,
            recommendations
        ) = calculate_security_score(
            https_enabled,
            hsts,
            csp,
            xfo,
            xcto
        )

        # ----------------------------------------------------
        # SSL CERTIFICATE
        # ----------------------------------------------------

        ssl_info = get_ssl_certificate(
            final_hostname
        )

        # ----------------------------------------------------
        # DNS RECORDS
        # ----------------------------------------------------

        try:

            dns_records = get_dns_records(
                final_hostname
            )

        except Exception as error:

            dns_records = {
                "error": str(error)
            }

        # ----------------------------------------------------
        # PORT SCAN
        # ----------------------------------------------------

        try:

            open_ports = scan_ports(
                final_hostname
            )

        except Exception as error:

            open_ports = [
                {
                    "port": 0,
                    "service": "Scanner",
                    "status": "Error",
                    "error": str(error)
                }
            ]

        # ----------------------------------------------------
        # RESPONSE
        # ----------------------------------------------------

        return {

            "url": final_url,

            "status_code": response.status_code,

            "response_time_ms": response_time,

            "https_enabled": https_enabled,

            "server": response.headers.get(
                "Server",
                "Unknown"
            ),

            "content_type": response.headers.get(
                "Content-Type",
                "Unknown"
            ),

            "security_score": score,

            "security_grade": grade,

            "risk_level": risk,

            "security_headers": {

                "Strict-Transport-Security": hsts,

                "Content-Security-Policy": csp,

                "X-Frame-Options": xfo,

                "X-Content-Type-Options": xcto
            },

            "ssl_certificate": ssl_info,

            "dns_records": dns_records,

            "open_ports": open_ports,

            "recommendations": recommendations

        }

    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except requests.exceptions.Timeout:

        return {
            "error": "Website request timed out"
        }

    except requests.exceptions.ConnectionError:

        return {
            "error": "Unable to connect to the website"
        }

    except requests.exceptions.RequestException as error:

        return {
            "error": f"Request failed: {str(error)}"
        }

    except Exception as error:

        return {
            "error": f"Scan failed: {str(error)}"
        }
        # ============================================================
# AI SECURITY ADVISOR
# ============================================================

@app.post("/ai-advisor")
def ai_security_advisor(result: dict):
    return generate_security_advice(result)
