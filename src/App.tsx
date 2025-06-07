import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Kuesioner from "./kuesioner";
import Antrian from "./antrian";
import LoginPage from "./login";
import KuesionerTamu from "./kuesioner-tamu";
import AntrianPerKelas from "./guru";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/antrian" element={<Antrian />} />
        <Route path="/kuesioner" element={<Kuesioner />} />
        <Route path="/kuesioner-tamu" element={<KuesionerTamu />} />
        <Route path="/guru" element={<AntrianPerKelas />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
