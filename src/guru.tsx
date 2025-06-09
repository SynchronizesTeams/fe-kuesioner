import React, { useState } from 'react';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

interface AntrianData {
  id: number;
  name: string;
  no_antrian: number;
}

const AntrianPerKelas: React.FC = () => {
  const [selectedKelas, setSelectedKelas] = useState('');
  const [antrianList, setAntrianList] = useState<AntrianData[]>([]);
  const [loading, setLoading] = useState(false);

  const kelasList = [
                'X-RPL-1', 'X-RPL-2', 'XI-RPL-1', 'XI-RPL-2', 'XI-RPL-3',  'XII-RPL-1', 'XII-RPL-2', 'XII-RPL-3', 'X-TJKT-1', 'X-TJKT-2', 'X-TJKT-3', 'XI-TKJ-1', 'XI-TKJ-2', 'XII-TKJ-1', 'XII-TKJ-2','X-DKV-1', 'X-DKV-2', 'X-DKV-3', 'X-DKV-4', 'XI-MM-1', 'XI-MM-2', 'XI-MM-3', 'XI-MM-4', 'XI-I-MM-1', 'XII-MM-2', 'XII-MM-3', 'XII-MM-4', 'X-LPB-1', 'X-LPB-2', 'XI-PKM-1', 'XI-PKM-2', 'XII-PKM-1', 'XII-PKM-2'
            ];

  const handleFetchAntrian = async () => {
    if (!selectedKelas) {
      Swal.fire('Peringatan', 'Silakan pilih kelas terlebih dahulu.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/antrian/kelas/${selectedKelas}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengambil data antrian');
      }

      const result = await response.json();
      setAntrianList(result.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', (error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-50 to-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-700 p-6 sm:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Lihat Antrian Per Kelas</h1>
          <p className="text-white text-sm sm:text-base mt-1">SMK Plus Pelita Nusantara</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">Pilih Kelas</option>
              {kelasList.map((kelas) => (
                <option key={kelas} value={kelas}>
                  {kelas}
                </option>
              ))}
            </select>
            <button
              onClick={handleFetchAntrian}
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-2 text-white font-semibold rounded-md transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-rose-700 hover:from-red-600 hover:to-rose-800'
              }`}
            >
              {loading ? 'Memuat...' : 'Lihat Antrian'}
            </button>
          </div>

          {antrianList.length > 0 && (
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-red-500 to-rose-700 text-white">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Nomor Antrian</th>
                  </tr>
                </thead>
                <tbody>
                  {antrianList.map((item, index) => (
                    <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-100">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4 font-semibold text-gray-700">{item.no_antrian}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && antrianList.length === 0 && selectedKelas && (
            <div className="text-center text-gray-500 mt-6">Belum ada antrian untuk kelas ini.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AntrianPerKelas;
