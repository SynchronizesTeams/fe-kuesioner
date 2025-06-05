import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PekanItKuesioner: React.FC = () => {
  const navigate = useNavigate();

  const [namaWaliSiswa, setNamaWaliSiswa] = useState("");
  const [tampilanProduk, setTampilanProduk] = useState("");
  const [tampilanStand, setTampilanStand] = useState("");
  const [penjelasanProduk, setPenjelasanProduk] = useState("");
  const [hiburan, setHiburan] = useState("");

  const options = ["Baik", "Cukup", "Kurang", "Buruk"] as const;
  type Option = typeof options[number];
  const colorClasses: Record<Option, string> = {
    Baik: "peer-checked:bg-emerald-500",
    Cukup: "peer-checked:bg-green-400",
    Kurang: "peer-checked:bg-yellow-400",
    Buruk: "peer-checked:bg-red-400",
  };

  const [loading] = useState(false);

  if (loading) {
    return (
      <div
        role="status"
        id="loading"
        className="w-screen h-screen flex justify-center items-center"
      >
        {/* Spinner omitted for brevity */}
        Loading...
      </div>
    );
  }

  return (
    <main
      id="main"
      className="min-h-screen min-w-screen bg-gradient-to-br from-slate-50 to-gray-50 p-6 sm:p-10 space-y-8"
    >
      <form
        id="dataForm"
        method="POST"
        encType="application/json"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Data berhasil dikirim");
          navigate("/antrian");
        }}
        className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header Form */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-700">
            Kuesioner Penilaian
          </h1>
          <p className="text-sm text-gray-500 mt-1">Isi dengan jujur ya!</p>
        </div>

        {/* Nama Wali Siswa */}
        <div className="p-6">
          <label
            htmlFor="nama_wali_siswa"
            className="block text-lg font-semibold text-gray-700"
          >
            Nama Wali Siswa
          </label>
          <input
            type="text"
            id="nama_wali_siswa"
            name="nama_wali_siswa"
            value={namaWaliSiswa}
            onChange={(e) => setNamaWaliSiswa(e.target.value)}
            className="mt-1 text-lg text-black block w-full rounded-md shadow-sm p-2 outline-none transition-all duration-100 focus:ring-2 focus:ring-rose-400 border border-gray-300"
            required
          />
        </div>

        {/* Pertanyaan dengan radio options */}
        {[
          {
            name: "tampilan_produk",
            label: "Tampilan Produk",
            value: tampilanProduk,
            setter: setTampilanProduk,
          },
          {
            name: "tampilan_stand",
            label: "Tampilan Stand",
            value: tampilanStand,
            setter: setTampilanStand,
          },
          {
            name: "penjelasan_produk",
            label: "Penjelasan Produk",
            value: penjelasanProduk,
            setter: setPenjelasanProduk,
          },
          {
            name: "hiburan",
            label: "Hiburan",
            value: hiburan,
            setter: setHiburan,
          },
        ].map(({ name, label, value, setter }) => (
          <div className="py-4 px-6" key={name}>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              {label}
            </label>
            <div className="flex space-x-4 overflow-auto max-md:pb-2">
              {options.map((option) => (
                <label className="block cursor-pointer" key={option}>
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
                    className={`inline-block px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 select-none ${colorClasses[option]}`}
                  >
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Submit button */}
        <div className="p-6 flex justify-center">
          <button
            type="submit"
            className="rounded-lg px-8 py-3 bg-rose-600 text-white font-semibold hover:bg-rose-700 transition"
          >
            Kirim
          </button>
        </div>
      </form>
    </main>
  );
};

export default PekanItKuesioner;
