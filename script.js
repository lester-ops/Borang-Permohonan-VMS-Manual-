// ✅ Terjemahan GLOBAL — boleh diakses dari mana-mana fungsi
const translations = {
  ms: {
    section_applicant: "Maklumat Pemohon",
    full_name: "Nama Penuh",
    gender: "Jantina",
    passport_no: "No Pasport",
    nationality: "Warganegara",
    pr_number: "No PR / Pas Kerja",
    pr_expiry: "Tarikh Mansuh PR",
    email: "E-mel",
    vehicle_info: "Maklumat Kenderaan",
    brand_model: "Jenama / Model",
    engine_no: "No Enjin",
    chassis_no: "No Rangka",
    year_made: "Tahun Dibentuk",
    body_type: "Jenis Badan",
    insurance_no: "No Insuran",
    insurance_expiry: "Tarikh Luput",
    travel_info: "Maklumat Perjalanan",
    malaysia_address: "Alamat di Malaysia",
    arrival_date: "Tarikh Tiba",
    declaration: "Saya mengesahkan maklumat ini adalah betul dan sah.",
    disclaimer: "Kerajaan Malaysia tidak bertanggungjawab atas kehilangan atau kerosakan.",
    submit: "Hantar Permohonan"
  },
  en: {
    section_applicant: "Applicant Information",
    full_name: "Full Name",
    gender: "Gender",
    passport_no: "Passport No",
    nationality: "Nationality",
    pr_number: "PR / Work Pass No",
    pr_expiry: "PR Expiry Date",
    email: "Email",
    vehicle_info: "Vehicle Information",
    brand_model: "Brand / Model",
    engine_no: "Engine No",
    chassis_no: "Chassis No",
    year_made: "Year Made",
    body_type: "Body Type",
    insurance_no: "Insurance No",
    insurance_expiry: "Insurance Expiry",
    travel_info: "Travel Information",
    malaysia_address: "Address in Malaysia",
    arrival_date: "Arrival Date",
    declaration: "I confirm that the information provided is accurate.",
    disclaimer: "The Malaysian Government shall not be liable for any loss or damage.",
    submit: "Submit Application"
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('vehicleForm');
  const warganegaraSelect = document.getElementById('warganegara');
  const malaysianFields = document.getElementById('malaysian-fields');
  const otherNationalityField = document.getElementById('other-nationality-field');
  const confirmCheckbox = document.getElementById('confirm-checkbox');
  const submitBtn = document.getElementById('submitBtn');
  const langToggle = document.getElementById('language-select');

  let currentLang = 'ms';

  function applyTranslation(lang) {
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      const translation = translations[lang]?.[key];
      if (!translation) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.placeholder !== undefined) el.placeholder = translation;
      } else {
        el.textContent = translation;
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

    const namaInput = document.getElementById("nama_penuh");
    const passportInput = document.getElementById("no_pasport");
    const alamatMalaysia = document.getElementById("alamat_malaysia");

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
        alert("Sila isi maklumat di ruangan: " + (label?.textContent || field.name));
        field.focus();
        return;
      }
    }

    const emailInput = document.getElementById('email');
    if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      alert("Sila masukkan alamat e-mel yang sah.");
      emailInput.focus();
      return;
    }

    const tahunInput = document.getElementById('tahun_dibentuk');
    const tahunValue = parseInt(tahunInput?.value || '', 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(tahunValue) || tahunValue < 1900 || tahunValue > currentYear) {
      alert(`Sila masukkan tahun yang sah antara 1900 dan ${currentYear}.`);
      tahunInput.focus();
      return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbxUBb3-H5ZOn596HMpAQTEMi-0jgaD7JG2-GkAwzgcFfhim_25cUM1VFXdY4dQxAItKbw/exec"; // ← Ganti ini
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
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        alert("Permohonan berjaya dihantar.");
        await generatePDF(); // ✅ Aktifkan PDF selepas submit berjaya
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

  function populateCountryList() {
    const countries = ["AFGHANISTAN", "ALBANIA", "ALGERIA", "ANDORRA", "ANGOLA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA",
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
"ZIMBABWE", "OTHER"];
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country;
      option.textContent = country;
      warganegaraSelect.appendChild(option);
    });
  }

  langToggle.addEventListener('change', function () {
    currentLang = this.value;
    applyTranslation(currentLang);
  });

  warganegaraSelect.addEventListener('change', function () {
    hideAllOptionalFields();
    if (this.value === 'MALAYSIA') malaysianFields.style.display = 'block';
    else if (this.value === 'OTHER') otherNationalityField.style.display = 'block';
  });

  confirmCheckbox.addEventListener('change', function () {
    submitBtn.disabled = !this.checked;
  });

  form.addEventListener('submit', validateForm);

  function initializePage() {
    populateCountryList();
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

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'ms';
  const t = translations[lang];

  const marginLeft = 25;
  const valueX = pageWidth / 2 + 20;
  let y = 60;
  const lineHeight = 8;

  const row = (labelKey, value) => {
    const label = t[labelKey] || labelKey;
    doc.setFontSize(11);
    doc.text(`${label}:`, marginLeft, y);
    doc.text(value || '-', valueX, y);
    y += lineHeight;
  };

  const getValue = (id) => document.getElementById(id)?.value?.toUpperCase() || "-";

  const headerImg = new Image();
  headerImg.src = 'header.png'; // pastikan fail ini wujud

  await new Promise(resolve => {
    headerImg.onload = () => {
      const headerWidth = pageWidth - 2 * marginLeft;
      const headerHeight = (headerImg.height / headerImg.width) * headerWidth;
      doc.addImage(headerImg, 'PNG', marginLeft, 10, headerWidth, headerHeight);
      resolve();
    };
  });

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t.section_applicant, marginLeft, y); y += lineHeight;

  row("full_name", getValue("nama_penuh"));
  row("gender", getValue("jantina"));
  row("passport_no", getValue("no_pasport"));
  row("nationality", getValue("warganegara") === "OTHER" ? getValue("other_nationality_input") : getValue("warganegara"));
  row("pr_number", getValue("no_pr"));
  row("pr_expiry", getValue("tarikh_mansuh_pr"));
  row("email", getValue("email"));

  y += 5;
  doc.setFont("Helvetica", "bold");
  doc.text(t.vehicle_info, marginLeft, y); y += lineHeight;

  row("brand_model", getValue("jenama_model"));
  row("engine_no", getValue("no_enjin"));
  row("chassis_no", getValue("no_rangka"));
  row("year_made", getValue("tahun_dibentuk"));
  row("body_type", getValue("jenis_badan"));
  row("insurance_no", getValue("no_insuran"));
  row("insurance_expiry", getValue("tarikh_luput_insuran"));

  y += 5;
  doc.setFont("Helvetica", "bold");
  doc.text(t.travel_info, marginLeft, y); y += lineHeight;

  row("malaysia_address", getValue("alamat_malaysia"));
  row("arrival_date", getValue("tarikh_tiba"));

  y += 12;
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
