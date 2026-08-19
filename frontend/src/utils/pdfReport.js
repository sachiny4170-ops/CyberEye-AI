import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateSecurityReport = (result) => {
  if (!result) {
    alert("Please scan a website first.");
    return;
  }

  try {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const score = Number(result.security_score ?? 0);
    const grade = result.security_grade ?? "N/A";
    const risk = result.risk_level ?? "Unknown";

    const targetUrl = result.url ?? "Unknown";
    const scanDate = new Date().toLocaleString();

    // =========================================================
    // COLORS
    // =========================================================

    const dark = [15, 23, 42];
    const cyan = [6, 182, 212];
    const light = [241, 245, 249];
    const green = [22, 163, 74];
    const red = [220, 38, 38];
    const orange = [234, 88, 12];
    const gray = [100, 116, 139];
    const white = [255, 255, 255];

    // =========================================================
    // HEADER
    // =========================================================

    const drawHeader = () => {
      doc.setFillColor(...dark);
      doc.rect(0, 0, pageWidth, 18, "F");

      doc.setTextColor(...white);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);

      doc.text("CYBEREYE AI", 14, 11);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      doc.text(
        "Intelligent Security Assessment Platform",
        pageWidth - 14,
        11,
        {
          align: "right",
        }
      );
    };

    // =========================================================
    // FOOTER
    // =========================================================

    const drawFooter = () => {
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;

      doc.setDrawColor(226, 232, 240);

      doc.line(
        14,
        pageHeight - 14,
        pageWidth - 14,
        pageHeight - 14
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...gray);

      doc.text(
        "CyberEye AI • Security Assessment Report",
        14,
        pageHeight - 7
      );

      doc.text(
        `Page ${pageNumber}`,
        pageWidth - 14,
        pageHeight - 7,
        {
          align: "right",
        }
      );
    };

    // =========================================================
    // COVER PAGE
    // =========================================================

    doc.setFillColor(...dark);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setTextColor(...cyan);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);

    doc.text(
      "CYBEREYE AI",
      pageWidth / 2,
      55,
      {
        align: "center",
      }
    );

    doc.setTextColor(...white);
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Intelligent Website Security",
      pageWidth / 2,
      70,
      {
        align: "center",
      }
    );

    doc.text(
      "Assessment Platform",
      pageWidth / 2,
      79,
      {
        align: "center",
      }
    );

    // Shield
    doc.setDrawColor(...cyan);
    doc.setLineWidth(1.5);

    doc.circle(
      pageWidth / 2,
      105,
      18
    );

    doc.setTextColor(...cyan);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");

    doc.text(
      "✓",
      pageWidth / 2,
      112,
      {
        align: "center",
      }
    );

    // Target box
    doc.setFillColor(30, 41, 59);

    doc.roundedRect(
      20,
      140,
      pageWidth - 40,
      45,
      5,
      5,
      "F"
    );

    doc.setTextColor(...gray);
    doc.setFontSize(9);

    doc.text(
      "TARGET WEBSITE",
      pageWidth / 2,
      153,
      {
        align: "center",
      }
    );

    doc.setTextColor(...white);
    doc.setFontSize(11);

    const displayUrl =
      targetUrl.length > 65
        ? targetUrl.substring(0, 65) + "..."
        : targetUrl;

    doc.text(
      displayUrl,
      pageWidth / 2,
      166,
      {
        align: "center",
      }
    );

    // Score
    doc.setTextColor(...cyan);
    doc.setFontSize(42);
    doc.setFont("helvetica", "bold");

    doc.text(
      `${score}/100`,
      pageWidth / 2,
      225,
      {
        align: "center",
      }
    );

    doc.setTextColor(...white);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Security Score",
      pageWidth / 2,
      236,
      {
        align: "center",
      }
    );

    doc.setTextColor(...gray);
    doc.setFontSize(9);

    doc.text(
      `Grade: ${grade}   •   Risk: ${risk}`,
      pageWidth / 2,
      250,
      {
        align: "center",
      }
    );

    doc.setTextColor(...white);
    doc.setFontSize(10);

    doc.text(
      "Prepared for",
      pageWidth / 2,
      270,
      {
        align: "center",
      }
    );

    doc.setFont("helvetica", "bold");

    doc.text(
      "Sachin Yadav",
      pageWidth / 2,
      280,
      {
        align: "center",
      }
    );

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);

    doc.text(
      "Cyber Security Student",
      pageWidth / 2,
      289,
      {
        align: "center",
      }
    );

    doc.text(
      `Scan Date: ${scanDate}`,
      pageWidth / 2,
      305,
      {
        align: "center",
      }
    );

    doc.setTextColor(...cyan);
    doc.setFontSize(8);

    doc.text(
      "This report is generated automatically by CyberEye AI.",
      pageWidth / 2,
      325,
      {
        align: "center",
      }
    );

    // =========================================================
    // PAGE 2
    // =========================================================

    doc.addPage();
    drawHeader();

    let y = 30;

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text(
      "Security Assessment Summary",
      14,
      y
    );

    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray);

    doc.text(
      "Automated assessment of website security posture.",
      14,
      y
    );

    // =========================================================
    // SCORE CARDS
    // =========================================================

    y += 12;

    const cardWidth = 43;
    const cardHeight = 32;

    const cards = [
      ["Security Score", `${score}/100`],
      ["Grade", grade],
      ["Risk Level", risk],
      [
        "Response Time",
        `${result.response_time_ms ?? "N/A"} ms`,
      ],
    ];

    cards.forEach((card, index) => {
      const x = 14 + index * 47;

      doc.setFillColor(...light);

      doc.roundedRect(
        x,
        y,
        cardWidth,
        cardHeight,
        3,
        3,
        "F"
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...gray);

      doc.text(
        card[0],
        x + 4,
        y + 9
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);

      // Security Score
      if (index === 0) {
        doc.setTextColor(...cyan);

      // Risk Level
      } else if (index === 2) {
        if (risk === "Low") {
          doc.setTextColor(...green);
        } else if (risk === "Medium") {
          doc.setTextColor(...orange);
        } else {
          doc.setTextColor(...red);
        }

      // Grade / Response
      } else {
        doc.setTextColor(...dark);
      }

      doc.text(
        card[1],
        x + 4,
        y + 23
      );
    });

    y += 45;

    // =========================================================
    // WEBSITE INFORMATION
    // =========================================================

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
      "1. Website Information",
      14,
      y
    );

    y += 5;

    autoTable(doc, {
      startY: y,

      head: [
        ["Parameter", "Result"],
      ],

      body: [
        ["Target URL", targetUrl],

        [
          "Status Code",
          result.status_code ?? "N/A",
        ],

        [
          "HTTPS",
          result.https_enabled
            ? "Enabled"
            : "Disabled",
        ],

        [
          "Server",
          result.server ?? "Unknown",
        ],

        [
          "Content Type",
          result.content_type ?? "Unknown",
        ],

        [
          "Response Time",
          `${result.response_time_ms ?? "N/A"} ms`,
        ],
      ],

      theme: "grid",

      headStyles: {
        fillColor: dark,
        textColor: 255,
        fontStyle: "bold",
      },

      styles: {
        fontSize: 8,
        cellPadding: 4,
      },
    });

    y = doc.lastAutoTable.finalY + 12;

    // =========================================================
    // SSL / TLS
    // =========================================================

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
      "2. SSL/TLS Certificate Assessment",
      14,
      y
    );

    y += 5;

    const ssl = result.ssl_certificate || {};

    let issuer = "N/A";

    if (ssl.issuer) {
      issuer =
        ssl.issuer.commonName ||
        ssl.issuer.organizationName ||
        "Unknown";
    }

    autoTable(doc, {
      startY: y,

      head: [
        ["Parameter", "Result"],
      ],

      body: [
        [
          "Certificate Status",
          ssl.valid ? "Valid" : "Invalid",
        ],

        [
          "Issuer",
          issuer,
        ],

        [
          "Expiry Date",
          ssl.expiry_date ?? "N/A",
        ],

        [
          "Days Remaining",
          ssl.days_remaining ?? "N/A",
        ],
      ],

      theme: "grid",

      headStyles: {
        fillColor: dark,
        textColor: 255,
        fontStyle: "bold",
      },

      styles: {
        fontSize: 8,
        cellPadding: 4,
      },

      didParseCell: (data) => {
        if (
          data.section === "body" &&
          data.column.index === 1 &&
          data.row.index === 0
        ) {
          data.cell.styles.textColor =
            data.cell.raw === "Valid"
              ? green
              : red;
        }
      },
    });

    y = doc.lastAutoTable.finalY + 12;

    // =========================================================
    // SECURITY HEADERS
    // =========================================================

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
      "3. Security Headers",
      14,
      y
    );

    y += 5;

    const headers = result.security_headers || {};

    const headerRows = [
      [
        "Strict-Transport-Security",
        headers["Strict-Transport-Security"]
          ? "Present"
          : "Missing",
      ],

      [
        "Content-Security-Policy",
        headers["Content-Security-Policy"]
          ? "Present"
          : "Missing",
      ],

      [
        "X-Frame-Options",
        headers["X-Frame-Options"]
          ? "Present"
          : "Missing",
      ],

      [
        "X-Content-Type-Options",
        headers["X-Content-Type-Options"]
          ? "Present"
          : "Missing",
      ],
    ];

    autoTable(doc, {
      startY: y,

      head: [
        ["Security Header", "Status"],
      ],

      body: headerRows,

      theme: "grid",

      headStyles: {
        fillColor: dark,
        textColor: 255,
        fontStyle: "bold",
      },

      styles: {
        fontSize: 8,
        cellPadding: 4,
      },

      didParseCell: (data) => {
        if (
          data.section === "body" &&
          data.column.index === 1
        ) {
          data.cell.styles.textColor =
            data.cell.raw === "Present"
              ? green
              : red;
        }
      },
    });

    // =========================================================
    // PAGE 3
    // =========================================================

    doc.addPage();
    drawHeader();

    y = 30;

    // =========================================================
    // PORT ASSESSMENT
    // =========================================================

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);

    doc.text(
      "4. Common Port Assessment",
      14,
      y
    );

    y += 5;

    const ports = Array.isArray(result.open_ports)
      ? result.open_ports
      : [];

    const portRows = ports.map((item) => [
      item.port ?? "N/A",
      item.service ?? "Unknown",
      item.status ?? "Unknown",
    ]);

    if (portRows.length > 0) {
      autoTable(doc, {
        startY: y,

        head: [
          ["Port", "Service", "Status"],
        ],

        body: portRows,

        theme: "grid",

        headStyles: {
          fillColor: dark,
          textColor: 255,
          fontStyle: "bold",
        },

        styles: {
          fontSize: 8,
          cellPadding: 4,
        },

        didParseCell: (data) => {
          if (
            data.section === "body" &&
            data.column.index === 2
          ) {
            data.cell.styles.textColor =
              data.cell.raw === "Open"
                ? orange
                : green;
          }
        },
      });

      y = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...gray);

      doc.text(
        "No port assessment data available.",
        14,
        y + 8
      );

      y += 25;
    }

    // =========================================================
    // RECOMMENDATIONS
    // =========================================================

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);

    doc.text(
      "5. Security Recommendations",
      14,
      y
    );

    y += 7;

    const recommendations =
      Array.isArray(result.recommendations)
        ? result.recommendations
        : [];

    if (recommendations.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...green);

      doc.text(
        "No major security recommendations were identified.",
        14,
        y
      );

      y += 15;
    } else {
      recommendations.forEach(
        (recommendation, index) => {
          if (y > pageHeight - 40) {
            doc.addPage();
            drawHeader();
            y = 30;
          }

          doc.setFillColor(254, 242, 242);

          doc.roundedRect(
            14,
            y - 5,
            pageWidth - 28,
            14,
            2,
            2,
            "F"
          );

          doc.setTextColor(...red);
          doc.setFont(
            "helvetica",
            "bold"
          );
          doc.setFontSize(9);

          doc.text(
            `${index + 1}.`,
            18,
            y + 4
          );

          doc.setTextColor(...dark);
          doc.setFont(
            "helvetica",
            "normal"
          );

          const recLines =
            doc.splitTextToSize(
              String(recommendation),
              pageWidth - 48
            );

          doc.text(
            recLines,
            27,
            y + 4
          );

          y += Math.max(
            19,
            recLines.length * 5 + 10
          );
        }
      );
    }

    // =========================================================
    // DNS INFORMATION
    // =========================================================

    y += 8;

    if (y > pageHeight - 80) {
      doc.addPage();
      drawHeader();
      y = 30;
    }

    doc.setTextColor(...dark);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(16);

    doc.text(
      "6. DNS Assessment",
      14,
      y
    );

    y += 6;

    const dns = result.dns_records || {};

    const dnsRows = [];

    ["A", "AAAA", "MX", "NS"].forEach(
      (type) => {
        if (dns[type]) {
          dnsRows.push([
            type,
            Array.isArray(dns[type])
              ? dns[type].join(", ")
              : String(dns[type]),
          ]);
        }
      }
    );

    if (dnsRows.length > 0) {
      autoTable(doc, {
        startY: y,

        head: [
          ["Record Type", "Value"],
        ],

        body: dnsRows,

        theme: "grid",

        headStyles: {
          fillColor: dark,
          textColor: 255,
          fontStyle: "bold",
        },

        styles: {
          fontSize: 7,
          cellPadding: 3,
          overflow: "linebreak",
        },

        columnStyles: {
          0: {
            cellWidth: 28,
          },
          1: {
            cellWidth: "auto",
          },
        },
      });

      y = doc.lastAutoTable.finalY + 15;
    } else {
      doc.setFont(
        "helvetica",
        "normal"
      );
      doc.setFontSize(9);
      doc.setTextColor(...gray);

      doc.text(
        "No DNS records available.",
        14,
        y
      );

      y += 15;
    }

    // =========================================================
    // FINAL PAGE / CONCLUSION
    // =========================================================

    doc.addPage();
    drawHeader();

    y = 32;

    doc.setTextColor(...dark);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(18);

    doc.text(
      "7. Security Assessment Conclusion",
      14,
      y
    );

    y += 12;

    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    let conclusion = "";

    if (score >= 80) {
      conclusion =
        "The assessed website demonstrates a relatively strong security posture based on the automated checks performed by CyberEye AI.";
    } else if (score >= 60) {
      conclusion =
        "The assessed website demonstrates a moderate security posture. Several security controls should be reviewed and improved.";
    } else {
      conclusion =
        "The assessed website demonstrates a higher security risk based on the automated checks performed. Important security controls should be reviewed.";
    }

    const lines =
      doc.splitTextToSize(
        conclusion,
        pageWidth - 28
      );

    doc.text(
      lines,
      14,
      y
    );

    y +=
      lines.length * 6 + 15;

    doc.setFillColor(...light);

    doc.roundedRect(
      14,
      y,
      pageWidth - 28,
      50,
      4,
      4,
      "F"
    );

    doc.setTextColor(...dark);
    doc.setFont(
      "helvetica",
      "bold"
    );
    doc.setFontSize(11);

    doc.text(
      "Assessment Scope",
      20,
      y + 12
    );

    doc.setFont(
      "helvetica",
      "normal"
    );
    doc.setFontSize(9);
    doc.setTextColor(...gray);

    const scope =
      "This report summarizes automated checks for website availability, HTTPS, SSL/TLS certificate information, security headers, DNS records and selected common network ports.";

    const scopeLines =
      doc.splitTextToSize(
        scope,
        pageWidth - 40
      );

    doc.text(
      scopeLines,
      20,
      y + 22
    );

    // =========================================================
    // DISCLAIMER
    // =========================================================

    y += 68;

    doc.setTextColor(...gray);
    doc.setFontSize(8);

    const disclaimer =
      "Disclaimer: CyberEye AI provides an automated security assessment for educational and authorized security testing purposes. Results should not be considered a complete penetration test or a substitute for a professional security audit.";

    const disclaimerLines =
      doc.splitTextToSize(
        disclaimer,
        pageWidth - 28
      );

    doc.text(
      disclaimerLines,
      14,
      y
    );

    // =========================================================
    // FOOTERS ON ALL PAGES
    // =========================================================

    const totalPages =
      doc.internal.getNumberOfPages();

    for (
      let i = 1;
      i <= totalPages;
      i++
    ) {
      doc.setPage(i);
      drawFooter();
    }

    // =========================================================
    // DOWNLOAD
    // =========================================================

    let hostname = "website";

    try {
      hostname =
        new URL(targetUrl).hostname
          .replace(/[^a-zA-Z0-9.-]/g, "_");
    } catch {
      hostname = "website";
    }

    const filename =
      `CyberEye-AI-Security-Report-${hostname}.pdf`;

    doc.save(filename);

    console.log(
      `PDF generated successfully: ${filename}`
    );
  } catch (error) {
    console.error(
      "CyberEye AI PDF generation error:",
      error
    );

    alert(
      "PDF generation failed. Please check the browser console."
    );
  }
};