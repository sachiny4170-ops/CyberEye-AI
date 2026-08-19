import socket

COMMON_PORTS = {
    21: "FTP",
    22: "SSH",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL",
    3389: "RDP"
}


def scan_ports(hostname):
    results = []

    try:
        ip = socket.gethostbyname(hostname)
    except Exception:
        return [
            {
                "error": f"Unable to resolve hostname: {hostname}"
            }
        ]

    for port, service in COMMON_PORTS.items():
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)

        try:
            result = sock.connect_ex((ip, port))

            if result == 0:
                status = "Open"
            else:
                status = "Closed"

            results.append({
                "port": port,
                "service": service,
                "status": status
            })

        except Exception:
            results.append({
                "port": port,
                "service": service,
                "status": "Error"
            })

        finally:
            sock.close()

    return results