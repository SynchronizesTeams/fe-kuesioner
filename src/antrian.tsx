import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const NomorAntrian: React.FC = () => {
  const navigate = useNavigate();
  const [nomorAntrian, setNomorAntrian] = useState<string>('-');
  const [loading, setLoading] = useState<boolean>(true);

  const userToken = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userToken) {
      navigate('/');
      return;
    }

    const storedNomorAntrian = localStorage.getItem('nomorAntrian');
    if (storedNomorAntrian) {
      setNomorAntrian(storedNomorAntrian);
      setLoading(false);
    } else {
      const fetchAntrian = async () => {
        if (!userToken || !userId) {
          Swal.fire({
            title: 'Error!',
            text: 'User belum login atau ID tidak ditemukan.',
            icon: 'error',
          });
          setLoading(false);
          return;
        }

        try {
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
          localStorage.setItem('nomorAntrian', nomor);
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
      fetchAntrian();
    }
  }, [navigate, userToken, userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white via-rose-50 to-rose-100 px-4 py-12">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Memuat nomor antrian...</p>
        </div>
      </div>
    );
  }

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


        </div>
      </div>
    </div>
  );
};

export default NomorAntrian;
