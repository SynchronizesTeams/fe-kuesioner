import { useEffect, useState } from "react";
import { FaDownload, FaUsers, FaUserGraduate } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

type SiswaKuesioner = {
  id: number;
  nama_wali_siswa: string;
  nama_siswa: string;
  kelas: string;
  tampilan_produk: string;
  tampilan_stand: string;
  penjelasan_produk: string;
  hiburan: string;
  kritik_saran: string;
  created_at: string;
};

type TamuKuesioner = {
  id: number;
  nama: string;
  instansi: string;
  tampilan_produk: string;
  tampilan_stand: string;
  penjelasan_produk: string;
  hiburan: string;
  kritik_saran: string;
  created_at: string;
};

const ITEMS_PER_PAGE = 10;

const KuesionerPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<"siswa" | "tamu">("siswa");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [siswaData, setSiswaData] = useState<SiswaKuesioner[]>([]);
  const [tamuData, setTamuData] = useState<TamuKuesioner[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setError(null);
    setLoading(true);
    setCurrentPage(1);

    const url =
      selectedType === "siswa"
        ? `${API_BASE_URL}/api/show/siswa`
        : `${API_BASE_URL}/api/show/tamu`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data");
        return res.json();
      })
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          if (selectedType === "siswa") {
            setSiswaData(json.data);
          } else {
            setTamuData(json.data);
          }
        } else {
          throw new Error("Format data tidak valid");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedType]);

  const handleDownloadTamu = () => {
    const downloadUrl = `${API_BASE_URL}/api/export-kuesioner-tamu`;

    fetch(downloadUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal download file");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "kuesioner-tamu-pekanIt.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => alert(err.message));
  };

  const handleDownloadSiswa = () => {
    const downloadUrl = `${API_BASE_URL}/api/export-kuesioner`;

    fetch(downloadUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal download file");
        return res.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "kuesioner-siswa-pekanIt.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => alert(err.message));
  };

  const dataToShow = selectedType === "siswa" ? siswaData : tamuData;
  const totalPages = Math.ceil(dataToShow.length / ITEMS_PER_PAGE);

  const pagedData = dataToShow.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-8 pb-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium text-gray-700"
        >
          ← Prev
        </button>

        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  page === currentPage
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg scale-105"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:shadow-md transition-all duration-200 font-medium text-gray-700"
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-rose-50 to-rose-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
          <div className="bg-gradient-to-r from-rose-600 to-pink-500 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">
              📊 Daftar Responden Kuesioner
            </h1>
            <p className="text-pink-100 text-sm sm:text-base mt-1">
              SMK Plus Pelita Nusantara - Pekan IT
            </p>
          </div>

          {/* Controls Section */}
          <div className="p-6 bg-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <label
                  htmlFor="kuesioner-select"
                  className="font-semibold text-gray-700 whitespace-nowrap flex items-center gap-2"
                >
                  <span className="text-lg">👥</span>
                  Pilih jenis kuesioner:
                </label>
                <div className="relative">
                  <select
                    id="kuesioner-select"
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-sm font-medium text-gray-700"
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(e.target.value === "siswa" ? "siswa" : "tamu")
                    }
                  >
                    <option value="siswa">
                      {selectedType === "siswa" ? "👨‍🎓 " : ""}Siswa
                    </option>
                    <option value="tamu">
                      {selectedType === "tamu" ? "👔 " : ""}Tamu
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleDownloadTamu}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  <FaDownload className="text-sm" />
                  Download Excel Tamu
                </button>
                <button
                  onClick={handleDownloadSiswa}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  <FaDownload className="text-sm" />
                  Download Excel Siswa
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {loading && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3 text-gray-500 text-lg">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500"></div>
                <span className="font-medium">Memuat data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="text-red-600 font-semibold text-lg mb-1">⚠️ Terjadi Kesalahan</div>
                <div className="text-red-500 text-sm">{error}</div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {selectedType === "siswa" ? (
                    <>
                      <FaUserGraduate className="text-rose-500 text-xl" />
                      <h3 className="text-lg font-semibold text-gray-700">
                        Data Kuesioner Siswa ({siswaData.length} responden)
                      </h3>
                    </>
                  ) : (
                    <>
                      <FaUsers className="text-rose-500 text-xl" />
                      <h3 className="text-lg font-semibold text-gray-700">
                        Data Kuesioner Tamu ({tamuData.length} responden)
                      </h3>
                    </>
                  )}
                </div>
              </div>

              {/* Table Content */}
              <div className="overflow-x-auto">
                {selectedType === "siswa" ? (
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                      <tr>
                        {[
                          "Nama Siswa",
                          "Nama Wali",
                          "Kelas",
                          "Tampilan Produk",
                          "Tampilan Stand",
                          "Penjelasan Produk",
                          "Hiburan",
                          "Kritik & Saran"
                        ].map((header) => (
                          <th key={header} className="px-6 py-4 text-left text-sm font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(pagedData as SiswaKuesioner[]).map((item, index) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-rose-50 transition-colors duration-150 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 text-gray-800 font-medium">{item.nama_siswa}</td>
                          <td className="px-6 py-4 text-gray-700">{item.nama_wali_siswa}</td>
                          <td className="px-6 py-4">
                            <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded-full text-xs font-semibold">
                              {item.kelas}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.tampilan_produk === "Baik" ? "bg-emerald-100 text-emerald-800" :
                              item.tampilan_produk === "Cukup" ? "bg-green-100 text-green-800" :
                              item.tampilan_produk === "Kurang" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {item.tampilan_produk}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.tampilan_stand === "Baik" ? "bg-emerald-100 text-emerald-800" :
                              item.tampilan_stand === "Cukup" ? "bg-green-100 text-green-800" :
                              item.tampilan_stand === "Kurang" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {item.tampilan_stand}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.penjelasan_produk === "Baik" ? "bg-emerald-100 text-emerald-800" :
                              item.penjelasan_produk === "Cukup" ? "bg-green-100 text-green-800" :
                              item.penjelasan_produk === "Kurang" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {item.penjelasan_produk}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.hiburan === "Baik" ? "bg-emerald-100 text-emerald-800" :
                              item.hiburan === "Cukup" ? "bg-green-100 text-green-800" :
                              item.hiburan === "Kurang" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {item.hiburan}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700 max-w-xs">
                            <div className="truncate" title={item.kritik_saran}>
                              {item.kritik_saran || "Tidak ada"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                      <tr>
                        {[
                          "Nama",
                          "Instansi",
                          "Tampilan Produk",
                          "Tampilan Stand",
                          "Penjelasan Produk",
                          "Hiburan",
                          "Kritik & Saran"
                        ].map((header) => (
                          <th key={header} className="px-6 py-4 text-left text-sm font-semibold">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(pagedData as TamuKuesioner[]).map((item, index) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-rose-50 transition-colors duration-150 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="px-6 py-4 text-gray-800 font-medium">{item.nama}</td>
                          <td className="px-6 py-4 text-gray-700">{item.instansi}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.tampilan_produk === "Baik" ? "bg-emerald-100 text-emerald-800" :
                              item.tampilan_produk === "Cukup" ? "bg-green-100 text-green-800" :
                              item.tampilan_produk === "Kurang" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {item.tampilan_produk}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.tampilan_stand === "Baik" ? "bg-emerald-100 text-emerald-800" :
                              item.tampilan_stand === "Cukup" ? "bg-green-100 text-green-800" :
                              item.tampilan_stand === "Kurang" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {item.tampilan_stand}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.penjelasan_produk === "Baik" ? "bg-emerald-100 text-emerald-800" :
                              item.penjelasan_produk === "Cukup" ? "bg-green-100 text-green-800" :
                              item.penjelasan_produk === "Kurang" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {item.penjelasan_produk}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.hiburan === "Baik" ? "bg-emerald-100 text-emerald-800" :
                              item.hiburan === "Cukup" ? "bg-green-100 text-green-800" :
                              item.hiburan === "Kurang" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {item.hiburan}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-700 max-w-xs">
                            <div className="truncate" title={item.kritik_saran}>
                              {item.kritik_saran || "Tidak ada"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Empty State */}
              {pagedData.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Belum ada data kuesioner
                  </h3>
                  <p className="text-gray-500">
                    Data kuesioner {selectedType} akan muncul di sini setelah ada responden.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default KuesionerPage;
