document.addEventListener('DOMContentLoaded', function () {
  // --- KUMPULAN ELEMEN DOM ---
  const form = document.getElementById('vehicleForm');
  const warganegaraSelect = document.getElementById('warganegara');
  const malaysianFields = document.getElementById('malaysian-fields');
  const otherNationalityField = document.getElementById('other-nationality-field');
  const confirmCheckbox = document.getElementById('confirm-checkbox');
  const submitBtn = document.getElementById('submitBtn');
  const langToggle = document.getElementById('language-select');

  // --- OBJEK TERJEMAHAN ---
  const translations = {
    ms: {
      language_prompt: "Pilih Bahasa / Select Language:",
      section_applicant: "Maklumat Pemohon",
      full_name: "Nama Penuh (Seperti dalam Pasport)",
      gender: "Jantina",
      select_prompt: "-- Sila Pilih --",
      male: "Lelaki",
      female: "Perempuan",
      passport_no: "Nombor Pasport",
      nationality: "Warganegara",
      other: "Lain-lain",
      specify_nationality: "Sila Nyatakan Warganegara",
      pr_number: "No PR / Pas Kerja",
      pr_expiry: "Tarikh Mansuh PR / Pas Kerja",
      email: "E-mel (Untuk Pas Perjalanan)",
      vehicle_info: "Maklumat Kenderaan",
      brand_model: "Jenama / Model",
      engine_no: "Nombor Enjin",
      chassis_no: "Nombor Rangka",
      year_made: "Tahun Dibentuk",
      body_type: "Jenis Badan",
      insurance_no: "Nombor Insuran",
      insurance_expiry: "Tarikh Luput Insuran",
      travel_info: "Maklumat Perjalanan",
      malaysia_address: "Alamat Lengkap Berada di Malaysia",
      arrival_date: "Tarikh Jangka Tiba di Malaysia",
      declaration: "Saya dengan ini mengesahkan bahawa butir-butir yang diberikan adalah betul dan akan mematuhi syarat-syarat yang ditetapkan.",
      disclaimer: "Kerajaan Malaysia dan Jabatan Kastam Diraja Malaysia (\"JKDM\", \"kami\") adalah tidak bertanggungjawab bagi apa-apa kehilangan atau kerugian yang disebabkan oleh penggunaan maklumat dari laman web ini.",
      submit: "Hantar Permohonan",
      alert_confirm: "Sila tandakan pengesahan sebelum menghantar permohonan.",
      alert_required: "Sila isi maklumat di ruangan: ",
      alert_invalid_email: "Sila masukkan alamat e-mel yang sah.",
      alert_invalid_year: (tahun) => `Sila masukkan tahun yang sah antara 1900 dan ${tahun}.`,
      alert_success: "Permohonan berjaya dihantar.",
    },
    en: {
      language_prompt: "Select Language:",
      section_applicant: "Applicant Information",
      full_name: "Full Name (As in Passport)",
      gender: "Gender",
      select_prompt: "-- Please Select --",
      male: "Male",
      female: "Female",
      passport_no: "Passport Number",
      nationality: "Nationality",
      other: "Other",
      specify_nationality: "Please Specify Nationality",
      pr_number: "PR No / Work Pass",
      pr_expiry: "PR or Work Pass Expiry Date",
      email: "Email (For Travel Pass)",
      vehicle_info: "Vehicle Information",
      brand_model: "Brand / Model",
      engine_no: "Engine Number",
      chassis_no: "Chassis Number",
      year_made: "Year Manufactured",
      body_type: "Body Type",
      insurance_no: "Insurance Number",
      insurance_expiry: "Insurance Expiry Date",
      travel_info: "Travel Information",
      malaysia_address: "Full Address in Malaysia",
      arrival_date: "Expected Arrival Date in Malaysia",
      declaration: "I hereby confirm that the information provided is accurate and I will comply with the specified conditions.",
      disclaimer: "The Government of Malaysia and the Royal Malaysian Customs Department (\"RMCD\", \"we\") shall not be held liable for any loss or damage caused by the use of any information obtained from this website.",
      submit: "Submit Application",
      alert_confirm: "Please check the confirmation box before submitting.",
      alert_required: "Please fill in the following field: ",
      alert_invalid_email: "Please enter a valid email address.",
      alert_invalid_year: (year) => `Please enter a valid year between 1900 and ${year}.`,
      alert_success: "Application successfully submitted.",
    }
  };

  let currentLang = 'ms'; // Bahasa lalai

  function applyTranslation(lang) {
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (translations[lang] && translations[lang][key]) {
        const translation = translations[lang][key];
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.hasAttribute('placeholder')) {
            el.placeholder = translation;
          }
        } else {
          el.textContent = translation;
        }
      }
    });
    document.title = translations[lang].submit;
  }

  function hideAllOptionalFields() {
    malaysianFields.style.display = 'none';
    otherNationalityField.style.display = 'none';
  }

  async function validateForm(e) {
    e.preventDefault();

    const namaInput = document.getElementById("NamaPenuh");
    const passportInput = document.getElementById("no_pasport");
    const alamatMalaysia = document.getElementById("AlamatMalaysia");

    if (namaInput) namaInput.value = namaInput.value.toUpperCase();
    if (passportInput) passportInput.value = passportInput.value.toUpperCase();
    if (alamatMalaysia) alamatMalaysia.value = alamatMalaysia.value.toUpperCase();

    if (!confirmCheckbox.checked) {
      alert("Sila tandakan pengesahan sebelum menghantar.");
      confirmCheckbox.focus();
      return;
    }

    const requiredFields = form.querySelectorAll('[required]');
    for (const field of requiredFields) {
      if (field.closest('.hidden-fields')?.style.display === 'none') continue;
      if (!field.value.trim()) {
        const label = form.querySelector(`label[for="${field.id}"]`);
        let fieldName = label?.textContent || field.name;
        alert("Sila isi maklumat di ruangan: " + fieldName);
        field.focus();
        return;
      }
    }

    const emailInput = document.getElementById('Email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      alert("Sila masukkan alamat e-mel yang sah.");
      emailInput.focus();
      return;
    }

    const tahunInput = document.getElementById('TahunDibentuk');
    const tahunValue = parseInt(tahunInput.value, 10);
    const currentYear = new Date().getFullYear();
    if (tahunInput.value && (isNaN(tahunValue) || tahunValue < 1900 || tahunValue > currentYear)) {
      alert(`Sila masukkan tahun yang sah antara 1900 dan ${currentYear}.`);
      tahunInput.focus();
      return;
    }

    const scriptURL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
    const formData = new FormData(form);

    const otherValue = document.getElementById("other_nationality_input")?.value || "";
    formData.set("WarganegaraLain", otherValue);

    const token = grecaptcha.getResponse();
    if (!token) {
      alert("⚠️ Sila sahkan bahawa anda bukan robot (reCAPTCHA).");
      return;
    }
    formData.append('g-recaptcha-response', token);

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        alert("Permohonan berjaya dihantar.");
        // generatePDF(); // Aktifkan jika perlu
        form.reset();
        submitBtn.disabled = true;
        grecaptcha.reset();
      } else {
        alert("⚠️ Ralat semasa menghantar borang.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("⚠️ Ralat sambungan atau sistem.");
    }
  }

  // ✅ TAMBAHAN: Fungsi populateCountryList
  function populateCountryList() {
    const countries = [
      "AFGHANISTAN", "ALBANIA", "ALGERIA", "ANDORRA", "ANGOLA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA",
"AUSTRALIA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM",
"BELIZE", "BENIN", "BHUTAN", "BOLIVIA", "BOSNIA AND HERZEGOVINA", "BOTSWANA", "BRAZIL", "BRUNEI", "BULGARIA",
"BURKINA FASO", "BURUNDI", "CABO VERDE", "CAMBODIA", "CAMEROON", "CANADA", "CENTRAL AFRICAN REPUBLIC", "CHAD",
"CHILE", "CHINA", "COLOMBIA", "COMOROS", "CONGO (CONGO-BRAZZAVILLE)", "COSTA RICA", "CROATIA", "CUBA", "CYPRUS",
"CZECHIA", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR",
"EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ESWATINI", "ETHIOPIA", "FIJI", "FINLAND", "FRANCE", "GABON", "GAMBIA",
"GEORGIA", "GERMANY", "GHANA", "GREECE", "GRENADA", "GUATEMALA", "GUINEA", "GUINEA-BISSAU", "GUYANA", "HAITI",
"HONDURAS", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN", "IRAQ", "IRELAND", "ISRAEL", "ITALY", "JAMAICA",
"JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "KUWAIT", "KYRGYZSTAN", "LAOS", "LATVIA", "LEBANON",
"LESOTHO", "LIBERIA", "LIBYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MADAGASCAR", "MALAWI", "MALAYSIA",
"MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MAURITANIA", "MAURITIUS", "MEXICO", "MICRONESIA", "MOLDOVA",
"MONACO", "MONGOLIA", "MONTENEGRO", "MOROCCO", "MOZAMBIQUE", "MYANMAR (BURMA)", "NAMIBIA", "NAURU", "NEPAL",
"NETHERLANDS", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NORTH KOREA", "NORTH MACEDONIA", "NORWAY", "OMAN",
"PAKISTAN", "PALAU", "PALESTINE STATE", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "POLAND",
"PORTUGAL", "QATAR", "ROMANIA", "RUSSIA", "RWANDA", "SAINT KITTS AND NEVIS", "SAINT LUCIA",
"SAINT VINCENT AND THE GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL",
"SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA",
"SOUTH AFRICA", "SOUTH KOREA", "SOUTH SUDAN", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SWEDEN", "SWITZERLAND",
"SYRIA", "TAIWAN", "TAJIKISTAN", "TANZANIA", "THAILAND", "TIMOR-LESTE", "TOGO", "TONGA", "TRINIDAD AND TOBAGO",
"TUNISIA", "TURKEY", "TURKMENISTAN", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM",
"UNITED STATES", "URUGUAY", "UZBEKISTAN", "VANUATU", "VATICAN CITY", "VENEZUELA", "VIETNAM", "YEMEN", "ZAMBIA",
"ZIMBABWE", "OTHER"

    ];

    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      warganegaraSelect.appendChild(option);
    });
  }

  // --- Event Listener ---
  langToggle.addEventListener('change', function () {
    currentLang = this.value;
    applyTranslation(currentLang);
  });

  warganegaraSelect.addEventListener('change', function () {
    hideAllOptionalFields();
    if (this.value === 'MALAYSIA') {
      malaysianFields.style.display = 'block';
    } else if (this.value === 'OTHER') {
      otherNationalityField.style.display = 'block';
    }
  });

  confirmCheckbox.addEventListener('change', function () {
    submitBtn.disabled = !this.checked;
  });

  form.addEventListener('submit', validateForm);

  function initializePage() {
    populateCountryList(); // ✅ DIPANGGIL DI SINI
    hideAllOptionalFields();
    submitBtn.disabled = true;
    applyTranslation(currentLang);
    langToggle.value = currentLang;
  }

  
  initializePage();
});



async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');

  // ⚙️ Tetapan asas halaman PDF
  const pageWidth = doc.internal.pageSize.getWidth();   // Lebar A4 = 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // Tinggi A4 = 297mm

  // 🌐 Dapatkan bahasa semasa dan terjemahan (BM/EN)
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ms';
  const t = translations[lang];

  // ✅ Posisi dan gaya
  const marginLeft = 25; // 🟡 Label kriteria (labelX) — gerakkan ke kanan jika mahu selari dengan logo
  const valueX = pageWidth / 2 + 20; // 🟡 Posisi jawapan — selarikan ke kanan
  let y = 60; // 🟡 Posisi permulaan selepas logo — naik/turun jika mahu tambah ruang
  const lineHeight = 8; // 🟡 Jarak antara setiap baris maklumat

  // 🔠 Tajuk seksyen tengah + garis bawah
  const boldCenterTitle = (text) => {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(text);
    const centerX = (pageWidth - textWidth) / 2; // 🟡 Letakkan tajuk di tengah halaman
    doc.text(text, centerX, y);
    y += 2;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, y, pageWidth - marginLeft, y); // 🟡 Garisan bawah tajuk
    y += lineHeight;
  };

  // 🏷️ Satu baris maklumat: label kiri + jawapan kanan
  const row = (labelKey, value) => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    const label = t[labelKey] || labelKey; // 🔄 Dapatkan terjemahan berdasarkan kunci
    doc.text(label + ":", marginLeft, y);  // 🟡 Label di margin kiri
    doc.text(value || "-", valueX, y);     // 🟡 Jawapan di tengah kanan
    y += lineHeight;
  };

  // 🧾 Fungsi ambil nilai dari input borang
  const getValue = (id) => document.getElementById(id)?.value?.toUpperCase() || "-";

  // 🖼️ Tambah gambar header/logo penuh
  const headerImg = new Image();
  headerImg.src = 'header.png';

  await new Promise((resolve) => {
    headerImg.onload = () => {
      const headerWidth = pageWidth - 2 * marginLeft; // 🟡 Saiz lebar gambar
      const headerHeight = (headerImg.height / headerImg.width) * headerWidth;
      doc.addImage(headerImg, 'PNG', marginLeft, 10, headerWidth, headerHeight); // 🟡 '10' = jarak dari atas
      resolve();
    };
  });

  // ✏️ Maklumat Pemohon
  boldCenterTitle(t.section_applicant); // Tajuk seksyen ikut bahasa
  row("full_name", getValue("nama_penuh"));
  row("gender", getValue("jantina"));
  row("passport_no", getValue("no_pasport"));
  row("nationality", getValue("warganegara") === "OTHER" ? getValue("other_nationality_input") : getValue("warganegara"));
  row("pr_number", getValue("no_pr"));
  row("pr_expiry", getValue("tarikh_mansuh_pr"));
  row("email", getValue("email"));

  // ✏️ Maklumat Kenderaan
  y += 5; // 🟡 Jarak antara seksyen
  boldCenterTitle(t.vehicle_info);
  row("brand_model", getValue("jenama_model"));
  row("engine_no", getValue("no_enjin"));
  row("chassis_no", getValue("no_rangka"));
  row("year_made", getValue("tahun_dibentuk"));
  row("body_type", getValue("jenis_badan"));
  row("insurance_no", getValue("no_insuran"));
  row("insurance_expiry", getValue("tarikh_luput_insuran"));

  // ✏️ Maklumat Perjalanan
  y += 5;
  boldCenterTitle(t.travel_info);
  row("malaysia_address", getValue("alamat_malaysia"));
  row("arrival_date", getValue("tarikh_tiba"));

  // ✅ Ayat pengesahan — diturunkan sedikit supaya ada jarak
  y += 12;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text(t.declaration, marginLeft, y, {
    maxWidth: pageWidth - 2 * marginLeft
  });

  // 🕒 Tarikh Cetakan (footer kanan bawah) ikut bahasa
  const today = new Date();
  const dateString = today.toLocaleDateString(lang === "ms" ? "ms-MY" : "en-GB", {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${lang === "ms" ? "Tarikh Cetakan" : "Date Printed"}: ${dateString}`, pageWidth - marginLeft, pageHeight - 10, {
    align: "right"
  });

  // 💾 Simpan fail PDF berdasarkan nama pemohon
  const nama = getValue("nama_penuh").replace(/\s+/g, "_") || "borang";
  doc.save(`Borang_${nama}.pdf`);
}