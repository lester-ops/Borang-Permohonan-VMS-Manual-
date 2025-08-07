
// ✅ Fungsi untuk jana tajuk seksyen dengan garisan bawah
function sectionTitle(title) {
  y += 6; // 🠕 Naikkan seksyen lebih dekat dengan tajuk sebelumnya
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(12);

  const centerX = pageWidth / 2;
  doc.text(title, centerX, y, { align: "center" });

  y += 2; // 🠕 Jarak sedikit antara tajuk dan garis
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  const headerWidth = pageWidth - 2 * marginLeft;
  doc.line(marginLeft, y, marginLeft + headerWidth, y); // 🔧 Garis penuh ikut panjang header
  y += 6; // 🠕 Jarak dari garis ke kandungan (label pertama)
}

// ✅ Fungsi untuk papar satu baris label dan jawapan
function row(labelKey, value) {
  const label = t[labelKey] || labelKey;
  const labelX = marginLeft + 5; // ✅ Selarikan label ke kanan sedikit ikut logo
  const labelY = y;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`${label}:`, labelX, labelY);

  // ✅ Jawapan disejajarkan lebih ke kanan agar ruang lebih tersusun
  const valueX = pageWidth / 2 + 25; // ← Tambah jarak ke kanan untuk jawapan
  doc.text(value || '-', valueX, labelY);

  y += lineHeight - 1; // 🠗 Rapatkan label dan jawapan antara satu sama lain
}

// ✅ Fungsi utama jana PDF
async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const lang = document.getElementById('language-select')?.value || 'ms';
  const t = translations[lang];

  const marginLeft = 20;
  const lineHeight = 8;
  let y = 60;

  const getValue = (id) => document.getElementById(id)?.value?.trim() || "-";

  // ✅ Papar header
  const headerImg = new Image();
  headerImg.src = 'header.png';

  await new Promise(resolve => {
    headerImg.onload = () => {
      const headerWidth = pageWidth - 2 * marginLeft;
      const headerHeight = (headerImg.height / headerImg.width) * headerWidth;
      doc.addImage(headerImg, 'PNG', marginLeft, 10, headerWidth, headerHeight);
      resolve();
    };
  });

  // ✅ Seksyen 1: Maklumat Pemohon
  sectionTitle(t.section_applicant);
  row("full_name", getValue("nama_penuh"));
  row("gender", getValue("jantina"));
  row("passport_no", getValue("no_pasport"));
  row("nationality", getValue("warganegara") === "OTHER" ? getValue("other_nationality_input") : getValue("warganegara"));
  row("pr_number", getValue("no_pr"));
  row("pr_expiry", getValue("tarikh_mansuh_pr"));
  row("email", getValue("email"));

  // ✅ Seksyen 2: Maklumat Kenderaan
  sectionTitle(t.vehicle_info);
  row("brand_model", getValue("jenama_model"));
  row("engine_no", getValue("no_enjin"));
  row("chassis_no", getValue("no_rangka"));
  row("year_made", getValue("tahun_dibentuk"));
  row("body_type", getValue("jenis_badan"));
  row("insurance_no", getValue("no_insuran"));
  row("insurance_expiry", getValue("tarikh_luput_insuran"));

  // ✅ Seksyen 3: Maklumat Perjalanan
  sectionTitle(t.travel_info);

  // Kriteria alamat: 3 baris panjang, selari dengan label lain
  const alamatLabel = t["malaysia_address"] + ":";
  const alamatValue = getValue("alamat_malaysia");
  const labelX = marginLeft + 5;
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.text(alamatLabel, labelX, y);

  const alamatWrapped = doc.splitTextToSize(alamatValue || '-', pageWidth - labelX - 25);
  doc.text(alamatWrapped, pageWidth / 2 + 25, y);
  y += (alamatWrapped.length * (lineHeight - 2));

  row("arrival_date", getValue("tarikh_tiba")); // Diletakkan lebih rapat dengan alamat

  // ✅ Perakuan & Tarikh
  y += 10;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text(t.declaration, marginLeft, y, { maxWidth: pageWidth - 2 * marginLeft });

  const today = new Date();
  const dateString = today.toLocaleDateString(lang === "ms" ? "ms-MY" : "en-GB", {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Tarikh Cetakan: ${dateString}`, pageWidth - marginLeft, pageHeight - 10, { align: "right" });

  const nama = getValue("nama_penuh").replace(/\s+/g, "_") || "borang";
  doc.save(`Borang_${nama}.pdf`);
}
