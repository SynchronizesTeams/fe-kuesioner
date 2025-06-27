import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
console.log(API_BASE_URL);

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  data?: {
    user_id: string;
    name: string;
    kelas: string;
  };
}

interface LoginResult {
  success: boolean;
  message?: string;
}

const LoginPage: React.FC = () => {
  const [nis, setNis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const isNgisi = localStorage.getItem('is_ngisi');
    if (token) {
      if (isNgisi === 'true') {
        navigate('/antrian');
      } else {
        navigate('/kuesioner');
      }
    }
  }, [navigate]);

  const handleLogin = async (nis: string): Promise<LoginResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nis }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      if (data.success && data.token && data.data) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data.data.user_id);
        localStorage.setItem('userName', data.data.name);
        localStorage.setItem('userClass', data.data.kelas);
        localStorage.setItem('is_ngisi', 'false');
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      return { success: false, message: errorMessage };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!nis.trim()) {
      setError('NIS wajib diisi');
      return;
    }

    setIsLoading(true);
    const result = await handleLogin(nis.trim());
    setIsLoading(false);

    if (result.success) {
      navigate('/kuesioner');
    } else {
      setError(result.message || 'Login gagal. Silakan periksa NIS Anda.');
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-rose-50 to-rose-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-700 p-6 sm:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">
            Login Pekan IT
          </h1>
          <h2 className="text-base sm:text-lg text-white mt-1">
            SMK Plus Pelita Nusantara
          </h2>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="nis" className="block text-base font-medium text-gray-700 mb-1">
              Nomor Induk Siswa (NIS)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaUser className="text-lg" />
              </span>
              <input
                type="text"
                id="nis"
                name="nis"
                value={nis}
                onChange={(e) => setNis(e.target.value)}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-3 text-base text-black rounded-lg shadow-sm outline-none transition-all duration-200 border ${
                  error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-rose-500'
                } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2'}`}
                placeholder="Contoh: 20220045"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200 shadow-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center text-white text-base font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-2" />
                Sedang masuk...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
