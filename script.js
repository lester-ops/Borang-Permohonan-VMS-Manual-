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
    const t = translations[currentLang];

      // -- Jadikan 'Nama Penuh' dan 'No. Pasport' huruf besar (uppercase) --
  const namaInput = document.getElementById("nama_penuh");
  const passportInput = document.getElementById("nombor_passport");

  if (namaInput) {
    namaInput.value = namaInput.value.toUpperCase();
  }

  if (passportInput) {
    passportInput.value = passportInput.value.toUpperCase();
  }

    const alamatMalaysia = document.getElementById("alamat_malaysia");
if (alamatMalaysia) {
  alamatMalaysia.value = alamatMalaysia.value.toUpperCase();
}


    if (!confirmCheckbox.checked) {
      alert(t.alert_confirm);
      confirmCheckbox.focus();
      return;
    }

    const requiredFields = form.querySelectorAll('[required]');
    for (const field of requiredFields) {
      if (field.closest('.hidden-fields') && field.closest('.hidden-fields').style.display === 'none') {
        continue;
      }

      if (!field.value.trim()) {
        const label = form.querySelector(`label[for="${field.id}"]`);
        let fieldName = field.name;
        if (label) {
          const key = label.getAttribute('data-key');
          fieldName = t[key] || field.name;
        }
        alert(`${t.alert_required}${fieldName}`);
        field.focus();
        return;
      }
    }

    const emailInput = document.getElementById('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      alert(t.alert_invalid_email);
      emailInput.focus();
      return;
    }

    const tahunInput = document.getElementById('tahun_dibentuk');
    const tahunValue = parseInt(tahunInput.value, 10);
    const currentYear = new Date().getFullYear();
    if (tahunInput.value && (isNaN(tahunValue) || tahunValue < 1900 || tahunValue > currentYear)) {
      alert(t.alert_invalid_year(currentYear));
      tahunInput.focus();
      return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbxUBb3-H5ZOn596HMpAQTEMi-0jgaD7JG2-GkAwzgcFfhim_25cUM1VFXdY4dQxAItKbw/exec";

    const formData = new FormData(form);

    if (formData.get("Warganegara") === "OTHER") {
      const other = document.getElementById("other_nationality_input").value;
      formData.set("WarganegaraLain", other);
    }

    try {
  const token = grecaptcha.getResponse();

  if (!token) {
    alert("⚠️ Sila sahkan bahawa anda bukan robot (reCAPTCHA).");
    return;
  }

  formData.append('g-recaptcha-response', token);

  const response = await fetch(scriptURL, {
    method: "POST",
    body: formData
  });


      if (response.ok) {
        alert(t.alert_success);
      await generatePDF();
        form.reset();
        hideAllOptionalFields();
        submitBtn.disabled = true;
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
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 45; // Start below the logo

  const lineHeight = 7;

  const bold = (text, size = 12) => {
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(size);
    doc.text(text, margin, y);
    y += lineHeight;
  };

  const normal = (label, value, size = 11) => {
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(size);
    doc.text(`${label}: ${value}`, margin + 5, y);
    y += lineHeight;
  };

  const drawSectionBox = (title, contentCallback) => {
    const boxStartY = y;
    bold(title);
    contentCallback();
    const boxEndY = y;
    doc.rect(margin - 5, boxStartY - lineHeight + 2, 180, boxEndY - boxStartY + lineHeight, 'S');
    y += 4;
  };

  const getValue = (id) => document.getElementById(id)?.value || "-";

  // 🖼️ Masukkan logo di atas
  const logo = new Image();
  logo.src = 'header.png';

  await new Promise((resolve) => {
    logo.onload = () => {
      const logoWidth = 60;
      const logoHeight = (logo.height / logo.width) * logoWidth;
      const x = (pageWidth - logoWidth) / 2;
      doc.addImage(logo, 'PNG', x, 10, logoWidth, logoHeight);
      resolve();
    };
  });

  // 🗓️ Tarikh cetakan di kanan atas
  const today = new Date();
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const tarikhCetakan = today.toLocaleDateString('ms-MY', options); // contoh: 6 Ogos 2025
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Tarikh Cetakan: ${tarikhCetakan}`, pageWidth - margin - 50, 18);

  // --------- MAKLUMAT PEMOHON ------------
  drawSectionBox("Maklumat Pemohon", () => {
    normal("Nama Penuh", getValue("nama_penuh"));
    normal("Jantina", getValue("jantina"));
    normal("Nombor Pasport", getValue("no_pasport"));
    normal("Warganegara", getValue("warganegara") === "OTHER" ? getValue("other_nationality_input") : getValue("warganegara"));
    normal("No PR / Pas Kerja", getValue("no_pr"));
    normal("Tarikh Mansuh PR / Pas Kerja", getValue("tarikh_mansuh_pr"));
    normal("E-mel", getValue("email"));
  });

  // --------- MAKLUMAT KENDERAAN ------------
  drawSectionBox("Maklumat Kenderaan", () => {
    normal("Jenama / Model", getValue("jenama_model"));
    normal("Nombor Enjin", getValue("no_enjin"));
    normal("Nombor Rangka", getValue("no_rangka"));
    normal("Tahun Dibentuk", getValue("tahun_dibentuk"));
    normal("Jenis Badan", getValue("jenis_badan"));
    normal("Nombor Insuran", getValue("no_insuran"));
    normal("Tarikh Luput Insuran", getValue("tarikh_luput_insuran"));
  });

  // --------- MAKLUMAT PERJALANAN ------------
  drawSectionBox("Maklumat Perjalanan", () => {
    normal("Alamat Lengkap di Malaysia", getValue("alamat_malaysia"));
    normal("Tarikh Jangka Tiba", getValue("tarikh_tiba"));
  });

  // --------- PENGESAHAN ------------
  y += 5;
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Saya dengan ini mengesahkan bahawa butir-butir yang diberikan adalah betul dan akan mematuhi syarat-syarat yang ditetapkan.", margin, y, { maxWidth: 180 });

  // 💾 Simpan PDF
  const nama = getValue("nama_penuh").replace(/\s+/g, "_") || "borang";
  doc.save(`Borang_${nama}.pdf`);
}


