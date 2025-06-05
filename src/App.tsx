import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Kuesioner from "./kuesioner";
import Antrian from "./antrian";
import LoginPage from "./login";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/antrian" element={<Antrian />} />
        <Route path="/kuesioner" element={<Kuesioner />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
