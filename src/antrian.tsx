import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const NomorAntrian: React.FC = () => {
  const navigate = useNavigate();
  const [nomorAntrian, setNomorAntrian] = useState<string>('-');
  const [loading, setLoading] = useState<boolean>(false);

  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userToken) {
      navigate('/');
    }
  }, [navigate, userToken]);

  const handleGetAntrian = async () => {
    if (!userToken || !userId) {
      Swal.fire({
        title: 'Error!',
        text: 'User belum login atau ID tidak ditemukan.',
        icon: 'error',
      });
      return;
    }

    setLoading(true);

    try {
      const generateResponse = await fetch(`${API_BASE_URL}/api/antrian`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.message || 'Gagal membuat antrian');
      }

      const getResponse = await fetch(`${API_BASE_URL}/api/antrian/show/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      });

      if (!getResponse.ok) {
        const errorData = await getResponse.json();
        throw new Error(errorData.message || 'Gagal mendapatkan antrian');
      }

      const responseData = await getResponse.json();

      let nomor = '';
      if ('no_antrian' in responseData) {
        nomor = responseData.no_antrian;
      } else if (responseData.data?.no_antrian) {
        nomor = responseData.data.no_antrian;
      } else if ('queue_number' in responseData) {
        nomor = responseData.queue_number;
      } else {
        console.error('Unexpected API response format:', responseData);
        throw new Error('Format response tidak dikenali');
      }

      setNomorAntrian(nomor);

      Swal.fire({
        title: 'Berhasil!',
        text: `Nomor antrian Anda: ${nomor}`,
        icon: 'success',
      });
    } catch (error) {
      console.error('Error details:', error);
      Swal.fire({
        title: 'Error!',
        text: (error as Error).message,
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-rose-50 to-rose-100 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-rose-500 to-red-600 py-8 px-6 text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow">Nomor Antrian</h1>
          <p className="text-md text-white mt-1 tracking-wide">SMK Plus Pelita Nusantara</p>
        </div>

        <div className="p-8 flex flex-col items-center justify-center gap-6">
          <div className="text-center mb-5">
            <p className="text-sm text-gray-600 mb-10">Nomor Anda:</p>
            <span className="text-6xl font-extrabold text-rose-600 bg-rose-100 px-8 py-4 rounded-2xl shadow-inner tracking-wider select-text">
              {nomorAntrian}
            </span>
          </div>

          <button
            onClick={handleGetAntrian}
            disabled={loading}
            className={`w-full py-3 px-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-md ${
              loading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700'
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Memproses...
              </div>
            ) : (
              'Dapatkan Nomor Antrian'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NomorAntrian;
