import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const API_BASE_URL = 'https://be-kuesioner.synchronizeteams.my.id';

const LoginPage: React.FC = () => {
  const [nis, setNis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      // User sudah login, redirect langsung ke /kuesioner
      navigate('/kuesioner');
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
        // Ambil error message dari response JSON bila ada
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      if (data.success && data.token && data.data) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data.data.user_id);
        localStorage.setItem('userName', data.data.name);
        localStorage.setItem('userClass', data.data.kelas);
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
      setError('NIS is required');
      return;
    }

    setIsLoading(true);

    const result = await handleLogin(nis.trim());

    setIsLoading(false);

    if (result.success) {
      // Navigate ke /kuesioner setelah login berhasil
      navigate('/kuesioner');
    } else {
      setError(result.message || 'Login failed. Please check your NIS and try again.');
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-50 to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-700 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">Login Pekan IT</h1>
          <h2 className="text-lg sm:text-xl font-semibold text-white text-center mt-1">SMK Plus Pelita Nusantara</h2>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nis" className="block text-lg font-semibold text-gray-700 mb-1">
              NIS
            </label>
            <input
              type="text"
              id="nis"
              name="nis"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
              disabled={isLoading}
              className={`w-full text-lg text-black rounded-md shadow-sm p-3 outline-none transition-all duration-100 border ${
                error ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-red-400'
              } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'focus:ring-2'}`}
              placeholder="Enter your NIS"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e as any);
                }
              }}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-md border border-red-200">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white text-lg font-semibold py-3 px-4 rounded-md transition-all duration-200 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-600 hover:to-rose-800'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
