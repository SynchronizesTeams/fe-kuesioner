import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_BASE_URL

const PekanItKuesioner: React.FC = () => {
  const navigate = useNavigate();

  const [namaWaliSiswa, setNamaWaliSiswa] = useState("");
  const [tampilanProduk, setTampilanProduk] = useState("");
  const [tampilanStand, setTampilanStand] = useState("");
  const [penjelasanProduk, setPenjelasanProduk] = useState("");
  const [hiburan, setHiburan] = useState("");
  const [kritikSaran, setKritikSaran] = useState("");
  const [loading, setLoading] = useState(true);

  const options = ["Baik", "Cukup", "Kurang", "Buruk"] as const;
  type Option = typeof options[number];
  const colorClasses: Record<Option, string> = {
    Baik: "peer-checked:bg-emerald-500",
    Cukup: "peer-checked:bg-green-400",
    Kurang: "peer-checked:bg-yellow-400",
    Buruk: "peer-checked:bg-red-400",
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = {
      nama_wali_siswa: namaWaliSiswa,
      tampilan_produk: tampilanProduk,
      tampilan_stand: tampilanStand,
      penjelasan_produk: penjelasanProduk,
      hiburan,
      kritik_saran: kritikSaran,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/kuesioner/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengirim data");
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID tidak ditemukan.');
      }

      const generateResponse = await fetch(`${API_BASE_URL}/api/antrian`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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

      localStorage.setItem('nomorAntrian', nomor);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Terima kasih telah mengisi kuesioner! Nomor antrian Anda: ${nomor}. Anda akan dialihkan ke halaman antrian.`,
        showConfirmButton: false,
        timer: 3000
      }).then(() => {
        navigate("/antrian");
      });
    } catch (error) {
      console.error("Error:", error);
      console.error("Error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: (error as Error).message || 'Terjadi kesalahan saat mengirim data atau mendapatkan antrian.',
      }).then(() => {
        navigate("/antrian");
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        id="loading"
        className="w-screen h-screen flex justify-center items-center"
      >
        Loading...
      </div>
    );
  }

  return (

  <main className="min-h-screen min-w-screen bg-gradient-to-br from-rose-50 to-rose-100 p-6 sm:p-10">
    <form
      id="dataForm"
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-rose-600 to-pink-500 border-b border-gray-200">
        <h1 className="text-xl font-bold text-white">📝 Kuesioner PekanIT</h1>
        <p className="text-xs text-pink-100 mt-1">Silakan isi dengan jujur ya!</p>
      </div>

      {/* Nama Wali Siswa */}
      <div className="p-6 space-y-2">
        <label
          htmlFor="nama_wali_siswa"
          className="block text-lg font-semibold text-gray-700"
        >
          Nama Wali Siswa <span className="text-rose-600">*</span>
        </label>
        <input
          type="text"
          id="nama_wali_siswa"
          value={namaWaliSiswa}
          onChange={(e) => setNamaWaliSiswa(e.target.value)}
          className="text-base text-gray-800 block w-full rounded-md shadow-sm p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          placeholder="Masukkan nama Anda"
          required
        />
      </div>

      {/* Penilaian */}
      {[
        {
          name: "tampilan_produk",
          label: "🎨 Tampilan Produk",
          value: tampilanProduk,
          setter: setTampilanProduk,
        },
        {
          name: "tampilan_stand",
          label: "🏕️ Tampilan Stand",
          value: tampilanStand,
          setter: setTampilanStand,
        },
        {
          name: "penjelasan_produk",
          label: "🗣️ Penjelasan Produk",
          value: penjelasanProduk,
          setter: setPenjelasanProduk,
        },
        {
          name: "hiburan",
          label: "🎉 Hiburan",
          value: hiburan,
          setter: setHiburan,
        },
      ].map(({ name, label, value, setter }) => (
        <div className="px-6 py-4" key={name}>
          <label className="block text-base font-semibold text-gray-700 mb-2">
            {label}
          </label>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2">
            {options.map((option) => (
              <label className="cursor-pointer" key={option}>
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={() => setter(option)}
                  className="peer hidden"
                  required
                />
                <span
                  className={`inline-block px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 select-none ${colorClasses[option]}`}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Kritik dan Saran */}
      <div className="p-6">
        <label
          htmlFor="kritik_saran"
          className="block text-lg font-semibold text-gray-700"
        >
          💬 Kritik & Saran
        </label>
        <textarea
          id="kritik_saran"
          value={kritikSaran}
          onChange={(e) => setKritikSaran(e.target.value)}
          rows={4}
          className="mt-2 block w-full text-gray-800 rounded-md p-3 border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:outline-none resize-none"
          placeholder="Tuliskan kritik dan saran Anda di sini..."
        />
      </div>

      {/* Submit Button */}
      <div className="p-6 flex justify-center">
        <button
          type="submit"
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition transform duration-150"
        >
          🚀 Kirim Kuesioner
        </button>
      </div>
    </form>
  </main>
  );
};

export default PekanItKuesioner;
