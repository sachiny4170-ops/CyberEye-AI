import dns.resolver

def get_dns_records(domain):
    records = {}

    # www हटाकर Root Domain लो
    if domain.startswith("www."):
        domain = domain[4:]

    for record_type in ["A", "AAAA", "MX", "NS"]:
        try:
            answers = dns.resolver.resolve(domain, record_type)
            records[record_type] = [str(answer) for answer in answers]
        except Exception:
            records[record_type] = []

    return records