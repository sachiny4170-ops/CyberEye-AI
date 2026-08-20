import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { generateSecurityReport } from "../utils/pdfReport";

function Dashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const scanWebsite = async () => {
    if (!url.trim()) {
      alert("Please enter a website URL.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.get(
        `/scan?url=${encodeURIComponent(url.trim())}`
      );

      if (res.data?.error) {
        alert(`Scan Failed: ${res.data.error}`);
        return;
      }

      setResult(res.data);

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);

    } catch (error) {
      console.error("Scan error:", error);

      alert(
        "Scan Failed. Please make sure the CyberEye AI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      scanWebsite();
    }
  };

  const getRiskClass = (risk) => {
    if (risk === "Low") {
      return "text-green-400";
    }

    if (risk === "Medium") {
      return "text-orange-400";
    }

    return "text-red-400";
  };

  const getHeaderStatus = (value) => {
    return value ? "Present" : "Missing";
  };

  const getHeaderClass = (value) => {
    return value
      ? "text-green-400"
      : "text-red-400";
  };

  return (
    <div
      id="top"
      className="min-h-screen bg-slate-950 text-white"
    >
      <Navbar />

      {/* =====================================================
          HERO / SCANNER
      ===================================================== */}

      <main
        id="scanner"
        className="max-w-7xl mx-auto px-6 py-12"
      >

        <div className="text-center max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Security Scanner Online
          </div>

          <h1 className="text-4xl md:text-6xl font-bold">
            CyberEye{" "}
            <span className="text-cyan-400">
              AI
            </span>
          </h1>

          <p className="text-gray-400 text-lg mt-5">
            Intelligent Website Security Assessment Platform
          </p>

          <p className="text-gray-500 mt-3">
            Analyze website security, SSL/TLS, DNS,
            security headers and common ports.
          </p>

        </div>

        {/* =====================================================
            SCANNER CARD
        ===================================================== */}

        <section className="max-w-5xl mx-auto mt-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl">
                🔍
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Website Security Scanner
                </h2>

                <p className="text-sm text-gray-500">
                  Enter a website to start the security assessment.
                </p>
              </div>

            </div>

            <div className="flex flex-col md:flex-row gap-4">

              <input
                type="text"
                placeholder="google.com"
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                onKeyDown={handleKeyDown}
                className="flex-1 p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-cyan-500 transition text-white placeholder-gray-500"
              />

              <button
                onClick={scanWebsite}
                disabled={loading}
                className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
              >
                {loading
                  ? "Scanning..."
                  : "🔍 Scan Website"}
              </button>

            </div>

            <p className="text-xs text-gray-600 mt-4">
              Use this scanner only on websites you own or
              have authorization to assess.
            </p>

          </div>

        </section>

        {/* =====================================================
            RESULTS
        ===================================================== */}

        {result && (
          <section
            id="results"
            className="mt-12"
          >

            {/* Result Heading */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

              <div>
                <p className="text-cyan-400 text-sm font-semibold">
                  SECURITY ASSESSMENT
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  Scan Results
                </h2>

                <p className="text-gray-500 mt-1 break-all">
                  {result.url}
                </p>
              </div>

              <button
                onClick={() =>
                  generateSecurityReport(result)
                }
                className="px-6 py-3 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition font-semibold"
              >
                📄 Export PDF
              </button>

            </div>

            {/* =================================================
                SCORE CARDS
            ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-gray-500 text-sm">
                  Security Score
                </p>

                <h3 className="text-4xl font-bold text-cyan-400 mt-3">
                  {result.security_score ?? "N/A"}
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  out of 100
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-gray-500 text-sm">
                  Security Grade
                </p>

                <h3 className="text-4xl font-bold text-cyan-400 mt-3">
                  {result.security_grade ?? "N/A"}
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  Overall rating
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-gray-500 text-sm">
                  Risk Level
                </p>

                <h3
                  className={`text-3xl font-bold mt-4 ${getRiskClass(
                    result.risk_level
                  )}`}
                >
                  {result.risk_level ?? "Unknown"}
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  Security risk
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <p className="text-gray-500 text-sm">
                  Response Time
                </p>

                <h3 className="text-3xl font-bold mt-4">
                  {result.response_time_ms ?? "N/A"}
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  milliseconds
                </p>
              </div>

            </div>

            {/* =================================================
                WEBSITE INFORMATION
            ================================================= */}

            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-5">
                🌐 Website Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <InfoCard
                  title="Status Code"
                  value={result.status_code ?? "N/A"}
                />

                <InfoCard
                  title="HTTPS"
                  value={
                    result.https_enabled
                      ? "Enabled"
                      : "Disabled"
                  }
                  valueClass={
                    result.https_enabled
                      ? "text-green-400"
                      : "text-red-400"
                  }
                />

                <InfoCard
                  title="Server"
                  value={result.server ?? "Unknown"}
                />

                <InfoCard
                  title="Content Type"
                  value={
                    result.content_type ?? "Unknown"
                  }
                />

              </div>

            </div>

            {/* =================================================
                SSL/TLS
            ================================================= */}

            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-5">
                🔐 SSL/TLS Certificate
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <InfoCard
                  title="Status"
                  value={
                    result.ssl_certificate?.valid
                      ? "Valid"
                      : "Invalid"
                  }
                  valueClass={
                    result.ssl_certificate?.valid
                      ? "text-green-400"
                      : "text-red-400"
                  }
                />

                <InfoCard
                  title="Issuer"
                  value={
                    result.ssl_certificate?.issuer
                      ?.organizationName ??
                    result.ssl_certificate?.issuer
                      ?.commonName ??
                    "Unknown"
                  }
                />

                <InfoCard
                  title="Expiry"
                  value={
                    result.ssl_certificate
                      ?.expiry_date ?? "N/A"
                  }
                />

                <InfoCard
                  title="Days Remaining"
                  value={
                    result.ssl_certificate
                      ?.days_remaining ?? "N/A"
                  }
                />

              </div>

            </div>

            {/* =================================================
                SECURITY HEADERS
            ================================================= */}

            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-5">
                🛡️ Security Headers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <HeaderCard
                  title="Strict-Transport-Security"
                  value={
                    result.security_headers?.[
                      "Strict-Transport-Security"
                    ]
                  }
                  getStatus={getHeaderStatus}
                  getClass={getHeaderClass}
                />

                <HeaderCard
                  title="Content-Security-Policy"
                  value={
                    result.security_headers?.[
                      "Content-Security-Policy"
                    ]
                  }
                  getStatus={getHeaderStatus}
                  getClass={getHeaderClass}
                />

                <HeaderCard
                  title="X-Frame-Options"
                  value={
                    result.security_headers?.[
                      "X-Frame-Options"
                    ]
                  }
                  getStatus={getHeaderStatus}
                  getClass={getHeaderClass}
                />

                <HeaderCard
                  title="X-Content-Type-Options"
                  value={
                    result.security_headers?.[
                      "X-Content-Type-Options"
                    ]
                  }
                  getStatus={getHeaderStatus}
                  getClass={getHeaderClass}
                />

              </div>

            </div>

            {/* =================================================
                RECOMMENDATIONS
            ================================================= */}

            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-5">
                💡 Security Recommendations
              </h2>

              {result.recommendations?.length > 0 ? (
                <div className="space-y-3">

                  {result.recommendations.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-start p-4 rounded-xl bg-red-500/5 border border-red-500/10"
                      >
                        <span className="text-orange-400">
                          ⚠️
                        </span>

                        <p className="text-gray-300">
                          {item}
                        </p>
                      </div>
                    )
                  )}

                </div>
              ) : (
                <p className="text-green-400">
                  ✓ No major recommendations found.
                </p>
              )}

            </div>

            {/* =================================================
                PORT ASSESSMENT
            ================================================= */}

            <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">

              <h2 className="text-xl font-bold mb-5">
                🔌 Common Port Assessment
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">

                {result.open_ports?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="bg-slate-800 rounded-xl p-4"
                    >

                      <div className="flex justify-between items-center">

                        <span className="text-lg font-bold">
                          {item.port}
                        </span>

                        <span
                          className={
                            item.status === "Open"
                              ? "text-orange-400 text-xs"
                              : "text-green-400 text-xs"
                          }
                        >
                          {item.status}
                        </span>

                      </div>

                      <p className="text-gray-500 text-sm mt-2">
                        {item.service}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

          </section>
        )}

        {/* =====================================================
            ABOUT SECTION
        ===================================================== */}

        <section
          id="about"
          className="mt-20 bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-10"
        >

          <div className="max-w-5xl mx-auto">

            <div className="text-center">

              <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                About the Project
              </span>

              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                About CyberEye AI
              </h2>

              <p className="text-gray-400 mt-4 max-w-3xl mx-auto leading-7">
                CyberEye AI is an intelligent website security
                assessment platform designed to perform automated
                security checks and present the results in a simple,
                professional dashboard.
              </p>

            </div>

            {/* Project Description */}

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700">

                <h3 className="text-xl font-bold text-cyan-400">
                  🎯 What CyberEye AI Does
                </h3>

                <p className="text-gray-400 mt-4 leading-7">
                  The platform analyzes a target website and
                  provides information about HTTPS, SSL/TLS
                  certificates, security headers, DNS records,
                  response time and selected common network ports.
                </p>

                <p className="text-gray-400 mt-4 leading-7">
                  It converts the technical scan results into a
                  security score, grade, risk level and practical
                  security recommendations.
                </p>

              </div>

              <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700">

                <h3 className="text-xl font-bold text-cyan-400">
                  🛠️ Technology Stack
                </h3>

                <div className="flex flex-wrap gap-3 mt-5">

                  {[
                    "React",
                    "Vite",
                    "Tailwind CSS",
                    "Axios",
                    "FastAPI",
                    "Python",
                    "DNS Analysis",
                    "SSL/TLS",
                    "Network Scanning",
                    "jsPDF",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}

                </div>

              </div>

            </div>

            {/* Features */}

            <div className="mt-6">

              <h3 className="text-2xl font-bold mb-5">
                Key Features
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                <FeatureCard
                  icon="🔍"
                  title="Website Security Scanner"
                  text="Performs automated website security checks."
                />

                <FeatureCard
                  icon="🔐"
                  title="SSL/TLS Analysis"
                  text="Checks certificate validity, issuer and expiry information."
                />

                <FeatureCard
                  icon="🛡️"
                  title="Security Headers"
                  text="Checks important HTTP security headers."
                />

                <FeatureCard
                  icon="🌐"
                  title="DNS Analysis"
                  text="Retrieves common DNS records for the target domain."
                />

                <FeatureCard
                  icon="🔌"
                  title="Port Assessment"
                  text="Checks selected common network ports and services."
                />

                <FeatureCard
                  icon="📄"
                  title="PDF Reporting"
                  text="Generates a professional security assessment report."
                />

              </div>

            </div>

            {/* Developer */}

            <div className="mt-10 pt-8 border-t border-slate-700 text-center">

              <div className="text-4xl mb-3">
                🛡️
              </div>

              <h3 className="text-xl font-bold">
                Developed by Sachin Yadav
              </h3>

              <p className="text-cyan-400 mt-1">
                Cyber Security Student
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-6">

  <a
    href="https://www.linkedin.com/in/sachinyadav-cse"
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-blue-400 hover:border-blue-400 transition"
  >
    🔗 LinkedIn
  </a>

  <a
    href="https://github.com/sachiny4170-ops"
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-gray-300 hover:border-gray-400 transition"
  >
    💻 GitHub
  </a>

  <a
    href="https://www.instagram.com/sachin_yadav_5125"
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-pink-400 hover:border-pink-400 transition"
  >
    📸 Instagram
  </a>

  <a
    href="mailto:sachiny4170@gmail.com"
    className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-cyan-400 hover:border-cyan-400 transition"
  >
    📧 Email
  </a>

</div>

              <p className="text-gray-500 text-sm mt-3">
                CyberEye AI • Intelligent Security Assessment Platform
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="mt-16 py-8 border-t border-slate-800 text-center">

          <p className="text-gray-500 text-sm">
            CyberEye AI • Intelligent Security Assessment Platform
          </p>

          <p className="text-gray-600 text-xs mt-2">
            Developed by Sachin Yadav • Cyber Security Student
          </p>

        </footer>

      </main>
    </div>
  );
}

/* ============================================================
   INFO CARD
============================================================ */

function InfoCard({
  title,
  value,
  valueClass = "text-white",
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">

      <p className="text-gray-500 text-xs">
        {title}
      </p>

      <p
        className={`font-semibold mt-2 break-words ${valueClass}`}
      >
        {value}
      </p>

    </div>
  );
}

/* ============================================================
   HEADER CARD
============================================================ */

function HeaderCard({
  title,
  value,
  getStatus,
  getClass,
}) {
  const present = Boolean(value);

  return (
    <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">

      <div>
        <p className="text-gray-300 text-sm font-medium">
          {title}
        </p>

        <p className="text-gray-600 text-xs mt-1">
          HTTP Security Header
        </p>
      </div>

      <div
        className={`font-semibold text-sm whitespace-nowrap ${getClass(
          value
        )}`}
      >
        {present ? "✓ Present" : "✕ Missing"}
      </div>

    </div>
  );
}

/* ============================================================
   FEATURE CARD
============================================================ */

function FeatureCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 hover:border-cyan-500/30 transition">

      <div className="text-2xl">
        {icon}
      </div>

      <h4 className="font-bold text-lg mt-3">
        {title}
      </h4>

      <p className="text-gray-500 text-sm mt-2 leading-6">
        {text}
      </p>

    </div>
  );
}

export default Dashboard;
