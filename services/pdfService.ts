
import { Candidate, TestResults } from '../types';

// This function assumes jsPDF is loaded globally from index.html
declare const jspdf: any;

const getPersonalityInterpretation = (score: number) => {
  if (score >= 80) return 'Sangat Tinggi';
  if (score >= 60) return 'Tinggi';
  if (score >= 40) return 'Sedang';
  if (score >= 20) return 'Rendah';
  return 'Sangat Rendah';
};

const generateRecommendations = (results: TestResults) => {
  let recommendations = 'Berdasarkan hasil tes, kandidat menunjukkan: ';
  const strengths: string[] = [];
  // FIX: 'analytical' is a competency score, not a cognitive one.
  if (results.competencies.analytical >= 70) strengths.push('kemampuan analisis yang kuat');
  if (results.personality.conscientiousness >= 70) strengths.push('sifat kehati-hatian dan kedisiplinan yang baik');
  if (results.competencies.leadership >= 70) strengths.push('potensi kepemimpinan yang menonjol');
  if (strengths.length > 0) recommendations += strengths.join(', ') + '. ';

  const developments: string[] = [];
  if (results.cognitive.verbal < 60) developments.push('kemampuan komunikasi verbal');
  if (results.personality.neuroticism > 60) developments.push('manajemen stres dan stabilitas emosi');
  if (results.competencies.teamwork < 60) developments.push('kolaborasi dan kerja sama tim');
  if (developments.length > 0) recommendations += 'Area yang perlu diperhatikan untuk pengembangan: ' + developments.join(', ') + '.';
  
  if (strengths.length === 0 && developments.length === 0) {
    return 'Kandidat menunjukkan profil yang seimbang di berbagai area. Pertimbangkan kesesuaian dengan budaya perusahaan dan persyaratan spesifik peran.'
  }
  return recommendations;
};

export const generatePDFReport = (candidateData: Candidate, results: TestResults) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  let yPos = 20;

  const addHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('LAPORAN PSIKOTES REKRUTMEN', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('PsikoTest Pro - Sistem Psikotes Digital', doc.internal.pageSize.getWidth() / 2, yPos, { align: 'center' });
    yPos += 8;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, 190, yPos);
    yPos += 15;
  };

  const addSectionTitle = (title: string) => {
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text(title, 20, yPos);
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 2, 60, yPos + 2);
    yPos += 12;
  };

  const addField = (label: string, value: string) => {
     if (yPos > 270) {
        doc.addPage();
        yPos = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(label, 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), 60, yPos);
    yPos += 7;
  };

  addHeader();

  addSectionTitle('DATA KANDIDAT');
  addField('Nama:', candidateData.nama);
  addField('Email:', candidateData.email);
  addField('Usia:', `${candidateData.age} tahun`);
  addField('Pendidikan:', candidateData.education.toUpperCase());
  addField('Pengalaman:', candidateData.experience);
  addField('Tanggal Tes:', new Date(candidateData.testDate || results.timestamp).toLocaleDateString('id-ID'));
  yPos += 10;
  
  addSectionTitle('RINGKASAN EKSEKUTIF');
  const summary = generateRecommendations(results);
  const splitSummary = doc.splitTextToSize(summary, 170);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(splitSummary, 20, yPos);
  yPos += splitSummary.length * 5 + 10;

  addSectionTitle('HASIL TES KEPRIBADIAN (BIG FIVE)');
  const personalityLabels = { openness: 'Keterbukaan', conscientiousness: 'Kehati-hatian', extraversion: 'Ekstraversi', agreeableness: 'Keramahan', neuroticism: 'Neurotisisme' };
  Object.entries(results.personality).forEach(([key, value]) => {
    const label = personalityLabels[key as keyof typeof personalityLabels];
    const interpretation = getPersonalityInterpretation(value);
    const text = `${label}: ${value}/100 - ${interpretation}`;
    addField(label, `: ${value}/100 - ${interpretation}`);
  });
  yPos += 10;

  addSectionTitle('KEMAMPUAN KOGNITIF');
  const cognitiveLabels = { logic: 'Logika & Penalaran', numeric: 'Kemampuan Numerik', verbal: 'Kemampuan Verbal', visual: 'Pola Visual', overall: 'Rata-rata Kognitif' };
   Object.entries(results.cognitive).forEach(([key, value]) => {
    const label = cognitiveLabels[key as keyof typeof cognitiveLabels];
    addField(label, `: ${value}/100`);
  });

  doc.save(`Laporan_Psikotes_${candidateData.nama.replace(/\s+/g, '_')}.pdf`);
};
