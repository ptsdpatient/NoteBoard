import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filePreview, setFilePreview] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file || !title || !description) {
      setError('Please fill in all fields and select a file.');
      return;
    }

    setError(''); // Clear any previous errors
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      await axios.post('https://noteboard-backend.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully!');
      setFile(null);
      setTitle('');
      setDescription('');
      setFilePreview(''); // Clear file preview
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-purple-100 to-blue-100 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Upload PDF</h1>
      {error && <p className="text-red-600 mb-4 bg-red-200 p-2 rounded shadow-md">{error}</p>}
      <input
        type="file"
        onChange={handleFileChange}
        className="border border-gray-300 p-3 rounded-lg w-full mb-4 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 p-3 rounded-lg w-full mb-4 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
        className="border border-gray-300 p-3 w-full rounded-lg mb-4 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleUpload}
        className={`bg-gradient-to-r from-teal-400 to-teal-600 text-white px-6 py-3 rounded-lg shadow-md transition-transform ${loading ? 'cursor-not-allowed' : 'hover:bg-teal-700'}`}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {filePreview && (
        <iframe
          src={filePreview}
          title="File Preview"
          className="w-full h-screen mt-6 rounded-lg border border-gray-300 shadow-md"
        />
      )}
    </div>
  );
};

export default UploadForm;
