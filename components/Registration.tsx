
import React, { useState } from 'react';
import { Candidate } from '../types';

interface RegistrationProps {
  onRegister: (data: Candidate) => void;
  candidateData: Candidate;
}

const Registration: React.FC<RegistrationProps> = ({ onRegister, candidateData }) => {
  const [formData, setFormData] = useState<Candidate>(candidateData);
  // FIX: Changed type to allow string error messages for all candidate properties.
  const [errors, setErrors] = useState<Partial<Record<keyof Candidate, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validate = (): boolean => {
    // FIX: Changed type to allow string error messages for all candidate properties.
    const newErrors: Partial<Record<keyof Candidate, string>> = {};
    if (!formData.nama) newErrors.nama = "Nama Lengkap wajib diisi.";
    if (!formData.email) newErrors.email = "Email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format email tidak valid.";
    if (!formData.phone) newErrors.phone = "Nomor HP wajib diisi.";
    if (!formData.age) newErrors.age = "Usia wajib diisi.";
    else if (+formData.age < 17 || +formData.age > 65) newErrors.age = "Usia harus antara 17 dan 65.";
    if (!formData.gender) newErrors.gender = "Jenis Kelamin wajib dipilih.";
    if (!formData.education) newErrors.education = "Pendidikan Terakhir wajib dipilih.";
    if (!formData.experience) newErrors.experience = "Pengalaman Kerja wajib dipilih.";
    if (!formData.field) newErrors.field = "Bidang Pengalaman wajib diisi.";
    if (!formData.city) newErrors.city = "Kota Domisili wajib diisi.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onRegister({ ...formData, testDate: new Date().toISOString() });
    }
  };
  
  const InputField: React.FC<{id: keyof Candidate, placeholder: string, type?: string, required?: boolean, min?: number, max?: number, error?: string}> = ({id, placeholder, type="text", required=true, min, max, error}) => (
      <div className="w-full">
          <input
              type={type}
              id={id}
              placeholder={placeholder}
              value={formData[id] as string | number}
              onChange={handleChange}
              min={min}
              max={max}
              required={required}
              className={`w-full px-4 py-3 bg-gray-bg border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue ${error ? 'border-danger-red focus:ring-danger-red' : 'border-transparent'}`}
          />
          {error && <p className="text-danger-red text-sm mt-1">{error}</p>}
      </div>
  );

  const SelectField: React.FC<{id: keyof Candidate, children: React.ReactNode, error?: string}> = ({id, children, error}) => (
      <div className="w-full">
          <select
              id={id}
              value={formData[id]}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 bg-gray-bg border-2 rounded-lg appearance-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-blue ${error ? 'border-danger-red focus:ring-danger-red' : 'border-transparent'}`}
          >
              {children}
          </select>
          {error && <p className="text-danger-red text-sm mt-1">{error}</p>}
      </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-dark mb-2">Data Diri Kandidat</h2>
          <p className="text-center text-gray-medium mb-8">Mohon isi data diri Anda dengan lengkap dan benar sebelum memulai tes.</p>
          <form id="registrationForm" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <InputField id="nama" placeholder="Nama Lengkap" error={errors.nama} />
              <InputField id="email" placeholder="Email" type="email" error={errors.email} />
              <InputField id="phone" placeholder="Nomor HP" type="tel" error={errors.phone} />
              <InputField id="age" placeholder="Usia" type="number" min={17} max={65} error={errors.age} />

              <SelectField id="gender" error={errors.gender}>
                <option value="">Pilih Jenis Kelamin</option>
                <option value="pria">Pria</option>
                <option value="wanita">Wanita</option>
              </SelectField>

              <SelectField id="education" error={errors.education}>
                <option value="">Pendidikan Terakhir</option>
                <option value="sma">SMA/SMK</option><option value="d3">D3</option><option value="s1">S1</option><option value="s2">S2</option><option value="s3">S3</option>
              </SelectField>

              <div className="md:col-span-2">
                <SelectField id="experience" error={errors.experience}>
                  <option value="">Pengalaman Kerja</option>
                  <option value="0">Fresh Graduate</option><option value="1-2">1-2 tahun</option><option value="3-5">3-5 tahun</option><option value="6-10">6-10 tahun</option><option value="10+">Lebih dari 10 tahun</option>
                </SelectField>
              </div>

              <InputField id="field" placeholder="Bidang Pengalaman" error={errors.field} />
              <InputField id="city" placeholder="Kota Domisili" error={errors.city} />
            </div>

            <div className="mt-8 text-center">
              <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-primary-blue to-secondary-blue text-white font-bold py-3 px-12 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                LANJUT KE TES
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
