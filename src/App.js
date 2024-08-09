// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PDFList from './components/PDFList';
import Whiteboard from './components/Whiteboard';
import UploadForm from './components/UploadForm';
import Navbar from "./components/Navbar"
const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<PDFList />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
          <Route path="/upload" element={<UploadForm />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
