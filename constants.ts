
import { Candidate, Question, InterestQuestion, TestAnswers } from './types';

export const DEFAULT_CANDIDATE: Candidate = {
  nama: '',
  email: '',
  phone: '',
  age: '',
  gender: '',
  education: '',
  experience: '',
  field: '',
  city: '',
};

export const DEFAULT_ANSWERS: TestAnswers = {};
export const DEFAULT_RESULTS = null;

export const PERSONALITY_QUESTIONS: string[] = [
  // Openness (Keterbukaan)
  "Saya senang mencoba hal-hal baru dan berbeda", "Saya memiliki imajinasi yang aktif", "Saya tertarik dengan ide-ide abstrak", "Saya suka berpetualang dan mengeksplorasi", "Saya terbuka terhadap cara berpikir yang berbeda", "Saya menikmati keindahan seni dan alam", "Saya tidak suka rutinitas yang monoton", "Saya sering merenungkan hal-hal yang mendalam", "Saya penasaran tentang banyak hal", "Saya kreatif dan suka menciptakan sesuatu yang baru",
  // Conscientiousness (Kehati-hatian)
  "Saya selalu menyelesaikan tugas tepat waktu", "Saya bekerja dengan sistematis dan teratur", "Saya sangat memperhatikan detail", "Saya dapat diandalkan dalam menepati janji", "Saya merencanakan aktivitas dengan matang", "Saya orang yang disiplin", "Saya suka lingkungan yang bersih dan rapi", "Saya mempersiapkan diri dengan baik untuk segala sesuatu", "Saya tidak suka menunda-nunda pekerjaan", "Saya bekerja keras untuk mencapai tujuan saya",
  // Extraversion (Ekstraversi)
  "Saya merasa nyaman berada di keramaian", "Saya mudah memulai percakapan dengan orang baru", "Saya menikmati menjadi pusat perhatian", "Saya energik dan antusias", "Saya suka bekerja dalam tim", "Saya banyak bicara dan ekspresif", "Saya merasa bersemangat setelah berinteraksi sosial", "Saya memiliki banyak teman dan kenalan", "Saya optimis dalam memandang masa depan", "Saya suka menghadiri pesta atau acara sosial",
  // Agreeableness (Keramahan)
  "Saya mudah mempercayai orang lain", "Saya senang membantu orang yang membutuhkan", "Saya cenderung memaafkan kesalahan orang lain", "Saya menghindari konflik dan perdebatan", "Saya kooperatif dalam bekerja sama", "Saya peduli dengan perasaan orang lain", "Saya sabar dan tidak mudah marah", "Saya bersikap hangat dan ramah kepada semua orang", "Saya bersimpati pada orang yang kurang beruntung", "Saya percaya pada kebaikan sifat manusia",
  // Neuroticism (Stabilitas Emosi - Dibalik)
  "Saya mudah merasa cemas atau khawatir", "Saya sering merasa stres dengan pekerjaan", "Saya mudah tersinggung atau marah", "Saya sering merasa sedih tanpa alasan jelas", "Saya sulit mengendalikan emosi", "Suasana hati saya sering berubah-ubah", "Saya sering memikirkan hal-hal yang membuat saya cemas", "Saya pesimis tentang masa depan", "Saya merasa tidak aman", "Saya sering merasa kesepian"
];

export const LOGIC_QUESTIONS: Question[] = Array(25).fill(0).map((_, i) => {
    const questions = [
        { question: "Jika A > B dan B > C, maka:", options: ["A = C", "A < C", "A > C", "A ≤ C"], correct: 2 },
        { question: "Semua kucing adalah mamalia. Felix adalah kucing. Maka:", options: ["Felix bukan mamalia", "Felix adalah mamalia", "Felix mungkin mamalia", "Tidak dapat disimpulkan"], correct: 1 },
        { question: "Lanjutkan deret: 2, 4, 8, 16, ...", options: ["20", "24", "32", "64"], correct: 2 },
        { question: "Jika kemarin adalah hari Jumat, lusa adalah hari...", options: ["Sabtu", "Minggu", "Senin", "Selasa"], correct: 2 },
        { question: "Mana yang tidak termasuk dalam kelompok: Apel, Jeruk, Pisang, Mawar", options: ["Apel", "Jeruk", "Pisang", "Mawar"], correct: 3 },
    ];
    return questions[i % questions.length];
});

export const NUMERIC_QUESTIONS: Question[] = Array(20).fill(0).map((_, i) => {
    const questions = [
        { question: "Berapa 15% dari 240?", options: ["24", "36", "48", "54"], correct: 1 },
        { question: "Jika harga naik 20% kemudian turun 20%, maka harga akhir adalah:", options: ["Sama seperti awal", "Lebih tinggi 4%", "Lebih rendah 4%", "Lebih rendah 2%"], correct: 2 },
        { question: "Hasil dari 12 x (15 + 5) adalah:", options: ["240", "185", "300", "200"], correct: 0 },
        { question: "Sebuah mobil menempuh 120 km dalam 2 jam. Berapa kecepatannya?", options: ["40 km/jam", "50 km/jam", "60 km/jam", "80 km/jam"], correct: 2 },
    ];
    return questions[i % questions.length];
});

export const VERBAL_QUESTIONS: Question[] = Array(25).fill(0).map((_, i) => {
    const questions = [
        { question: "Sinonim dari kata 'INOVASI' adalah:", options: ["Pembaruan", "Pengulangan", "Peniruan", "Penghapusan"], correct: 0 },
        { question: "Antonim dari kata 'OPTIMIS' adalah:", options: ["Realistis", "Pesimis", "Praktis", "Idealis"], correct: 1 },
        { question: "Pilih kata yang paling sesuai: Rumah : Atap :: Buku : ...", options: ["Halaman", "Penulis", "Sampul", "Cerita"], correct: 2 },
        { question: "Manakah yang merupakan peribahasa?", options: ["Makan hati", "Besar kepala", "Air beriak tanda tak dalam", "Kambing hitam"], correct: 2 },
    ];
    return questions[i % questions.length];
});

export const VISUAL_QUESTIONS: Question[] = Array(15).fill(0).map((_, i) => {
    const questions = [
        { question: "Gambar mana yang melengkapi pola berikut?", pattern: "○ △ ○ △ ○ ?", options: ["○", "△", "□", "◇"], correct: 1 },
        { question: "Pola: → ↑ ← ↓ → ?", options: ["↑", "↓", "→", "←"], correct: 0 },
        { question: "Pola: 1, 4, 9, 16, ?", options: ["20", "24", "25", "36"], correct: 2 },
    ];
    return questions[i % questions.length];
});

export const INTEREST_QUESTIONS: InterestQuestion[] = Array(30).fill(0).map((_, i) => {
    const questions = [
        { question: "Saya lebih suka:", optionA: "Bekerja dengan mesin atau alat (Realistic)", optionB: "Menganalisis data atau masalah (Investigative)" },
        { question: "Saya lebih suka:", optionA: "Membuat karya seni atau desain (Artistic)", optionB: "Membantu dan mengajar orang (Social)" },
        { question: "Saya lebih suka:", optionA: "Mempengaruhi atau memimpin orang (Enterprising)", optionB: "Bekerja dengan data yang terorganisir (Conventional)" },
        { question: "Saya lebih suka:", optionA: "Meneliti teori-teori ilmiah (Investigative)", optionB: "Menulis cerita atau puisi (Artistic)" },
        { question: "Saya lebih suka:", optionA: "Memberi konseling kepada orang lain (Social)", optionB: "Menjual produk atau ide (Enterprising)" },
        { question: "Saya lebih suka:", optionA: "Mengelola anggaran atau catatan keuangan (Conventional)", optionB: "Memperbaiki peralatan elektronik (Realistic)" },
    ];
    return questions[i % questions.length];
});

export const INTEREST_MAPPING = [
    ['realistic', 'investigative'], ['artistic', 'social'], ['enterprising', 'conventional'],
    ['investigative', 'artistic'], ['social', 'enterprising'], ['conventional', 'realistic'],
    ['realistic', 'social'], ['investigative', 'enterprising'], ['artistic', 'conventional'],
    ['social', 'realistic'], ['enterprising', 'investigative'], ['conventional', 'artistic'],
    ['realistic', 'artistic'], ['investigative', 'social'], ['artistic', 'enterprising'],
];

export const TEST_MODULES = [
    { key: 'personality', name: 'Tes Kepribadian', time: null, questionCount: 50 },
    { key: 'logic', name: 'Tes Logika & Penalaran', time: 30, questionCount: 25 },
    { key: 'numeric', name: 'Tes Kemampuan Numerik', time: 25, questionCount: 20 },
    { key: 'verbal', name: 'Tes Kemampuan Verbal', time: 20, questionCount: 25 },
    { key: 'visual', name: 'Tes Pola Visual', time: 15, questionCount: 15 },
    { key: 'interest', name: 'Tes Minat & Bakat', time: null, questionCount: 30 },
];
