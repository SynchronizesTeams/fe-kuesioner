import React, { useState } from "react";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const PekanItKuesioner: React.FC = () => {
  const [nama, setNama] = useState("");
  const [instansi, setInstansi] = useState("");
  const [tampilanProduk, setTampilanProduk] = useState("");
  const [tampilanStand, setTampilanStand] = useState("");
  const [penjelasanProduk, setPenjelasanProduk] = useState("");
  const [hiburan, setHiburan] = useState("");
  const [kritikSaran, setKritikSaran] = useState("");
  const [loading, setLoading] = useState(false);

  const options = ["Baik", "Cukup", "Kurang", "Buruk"] as const;
  type Option = typeof options[number];
  const colorClasses: Record<Option, string> = {
    Baik: "peer-checked:bg-emerald-500",
    Cukup: "peer-checked:bg-yellow-400",
    Kurang: "peer-checked:bg-orange-400",
    Buruk: "peer-checked:bg-red-500",
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      nama,
      instansi,
      tampilan_produk: tampilanProduk,
      tampilan_stand: tampilanStand,
      penjelasan_produk: penjelasanProduk,
      hiburan,
      kritik_saran: kritikSaran,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/tamu/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal mengirim data");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Terima kasih telah mengisi kuesioner!",
        showConfirmButton: false,
        timer: 2000,
      });

      setNama("");
      setInstansi("");
      setTampilanProduk("");
      setTampilanStand("");
      setPenjelasanProduk("");
      setHiburan("");
      setKritikSaran("");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat mengirim data.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-lg font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 sm:px-8">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-rose-600 to-pink-500 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">📝 Kuesioner Tamu</h1>
          <p className="text-white text-sm mt-1">Isi dengan jujur dan bijak ya!</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Nama */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Nama <span className="text-rose-600">*</span></label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:ring-rose-400 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Instansi */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Instansi <span className="text-rose-600">*</span></label>
            <input
              type="text"
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              required
              className="w-full mt-1 p-3 border rounded-lg shadow-sm focus:ring-rose-400 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Penilaian */}
          {[
            {
              name: "tampilan_produk",
              label: "🎨 Bagaimana tampilan produk kami?",
              value: tampilanProduk,
              setter: setTampilanProduk,
            },
            {
              name: "tampilan_stand",
              label: "🏕️ Bagaimana tampilan stand?",
              value: tampilanStand,
              setter: setTampilanStand,
            },
            {
              name: "penjelasan_produk",
              label: "🗣️ Penjelasan produk oleh siswa?",
              value: penjelasanProduk,
              setter: setPenjelasanProduk,
            },
            {
              name: "hiburan",
              label: "🎉 Kualitas hiburan acara?",
              value: hiburan,
              setter: setHiburan,
            },
          ].map(({ name, label, value, setter }) => (
            <div key={name}>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                {label}
              </label>
              <div className="flex flex-wrap gap-3">
                {options.map((option) => (
                  <label key={option} className="cursor-pointer">
                    <input
                      type="radio"
                      name={name}
                      value={option}
                      checked={value === option}
                      onChange={() => setter(option)}
                      required
                      className="peer hidden"
                    />
                    <div
                      className={`px-5 py-2 rounded-full border border-gray-300 shadow-sm text-sm font-medium transition-all hover:scale-105 duration-150 ${colorClasses[option]} peer-checked:text-white`}
                    >
                      {option}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Kritik dan Saran */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              💬 Kritik & Saran
            </label>
            <textarea
              rows={4}
              value={kritikSaran}
              onChange={(e) => setKritikSaran(e.target.value)}
              placeholder="Tulis masukan kamu di sini..."
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-rose-400 focus:border-rose-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all"
            >
              Kirim Jawaban
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default PekanItKuesioner;
