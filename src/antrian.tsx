import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const API_BASE_URL = 'https://be-kuesioner.synchronizeteams.my.id';

const NomorAntrian: React.FC = () => {
  const [nomorAntrian, setNomorAntrian] = useState<string>('-');
  const [loading, setLoading] = useState<boolean>(false);

  // Ambil user token & user id dari localStorage
  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Jika token tidak ada, redirect ke login
    if (!userToken) {
      window.location.href = '/login';
    }
  }, [userToken]);

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
      // 1. Generate nomor antrian
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

      // 2. Ambil nomor antrian terbaru
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

      // Parsing nomor antrian dari berbagai kemungkinan response
      let nomor = '';
      if ('no_antrian' in responseData) {
        nomor = responseData.no_antrian;
      } else if (responseData.data && 'no_antrian' in responseData.data) {
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
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-50 to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-700 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">Nomor Antrian</h1>
          <h2 className="text-lg sm:text-xl font-semibold text-white text-center">
            SMK Plus Pelita Nusantara
          </h2>
        </div>
        <div className="p-6 text-center">
          <div className="text-7xl font-bold my-8 text-gray-800 select-text">{nomorAntrian}</div>
          <button
            disabled={loading}
            onClick={handleGetAntrian}
            className={`w-full text-white text-lg font-semibold py-3 px-4 rounded-md transition-all duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-600 hover:to-rose-800'
            }`}
          >
            {loading ? 'Loading...' : 'Dapatkan Nomor Antrian'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NomorAntrian;
