import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';

import '@react-pdf-viewer/core/lib/styles/index.css';
import 'tailwindcss/tailwind.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFList = () => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const indexOfLastPdf = currentPage * itemsPerPage;
  const indexOfFirstPdf = indexOfLastPdf - itemsPerPage;
  const currentPdfs = pdfs.slice(indexOfFirstPdf, indexOfLastPdf);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setLoading(true);
    axios.get('https://noteboard-backend.onrender.com/pdfs')
      .then(response => {
        setPdfs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching PDFs:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedPdf) {
      axios.get(`https://noteboard-backend.onrender.com/notes/${selectedPdf._id}`)
        .then(response => setNotes(response.data))
        .catch(error => console.error('Error fetching notes:', error));
    }
  }, [selectedPdf]);

  const filteredPdfs = pdfs.filter(pdf =>
    pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pdf.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (filePath) => {
    const link = document.createElement('a');
    link.href = `https://noteboard-backend.onrender.com/${filePath}`;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddNote = () => {
    if (selectedPdf && newNote) {
      axios.post('https://noteboard-backend.onrender.com/notes', {
        pdfId: selectedPdf._id,
        content: newNote,
      })
        .then(response => {
          setNotes([...notes, response.data]);
          setNewNote('');
        })
        .catch(error => console.error('Error adding note:', error));
    }
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">PDF Library</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search PDFs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform hover:scale-105"
        />
      </div>

      {loading ? (
        <div className="text-center py-6 text-lg font-semibold text-gray-700">Loading...</div>
      ) : (
        <>
          <ul className="space-y-4">
            {filteredPdfs.length === 0 ? (
              <li className="text-center py-6 text-lg font-semibold text-gray-700">No PDFs found</li>
            ) : (
              currentPdfs.map((pdf) => (
                <li key={pdf._id} className="border border-gray-300 p-5 rounded-lg shadow-lg bg-white">
                  <h2 className="text-xl font-semibold mb-2">{pdf.title}</h2>
                  <p className="text-gray-700 mb-2">{pdf.description}</p>
                  <p className="text-gray-600 mb-2">Size: {pdf.size ? (pdf.size / 1024).toFixed(2) : 'Unknown'} KB</p>
                  <p className="text-gray-600 mb-2">Uploaded on: {new Date(pdf.uploadDate).toLocaleDateString()}</p>
                  <p className="text-gray-600 mb-4">Author: {pdf.author}</p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => setSelectedPdf(pdf)}
                      className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                      View PDF
                    </button>
                    <button
                      onClick={() => handleDownload(pdf.filePath)}
                      className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
                    >
                      Download PDF
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-gray-700 transition disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= pdfs.length}
              className="bg-gray-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-gray-700 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedPdf && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">PDF Viewer</h2>
          <div className="border border-gray-300 p-4 rounded-lg shadow-lg" style={{ height: '750px' }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={`https://noteboard-backend.onrender.com/${selectedPdf.filePath}`}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Notes</h3>
            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows="4"
                placeholder="Add a note..."
                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform hover:scale-105"
              />
              <button
                onClick={handleAddNote}
                className="mt-2 bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                Add Note
              </button>
            </div>
            <ul>
              {notes.map((note) => (
                <li key={note._id} className="border border-gray-300 p-3 mb-2 rounded-lg shadow-sm bg-white">
                  {note.content}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFList;
