import React, { useState, useRef, useEffect } from 'react';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';

const Whiteboard = () => {
    const [canvas, setCanvas] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [tool, setTool] = useState('brush');
    const [brushColor, setBrushColor] = useState('#000000'); // Default color set to black
    const [editingImage, setEditingImage] = useState(null);
    const canvasRef = useRef(null);

    const fetchImages = async () => {
        try {
            const response = await axios.get('https://noteboard-backend.onrender.com/drawings');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
            setError('Failed to fetch images.');
        }
    };

    const handleSave = async () => {
        if (!canvas) return;

        const dataURL = canvas.getDataURL({
            backgroundColor: '#FFFFFF', // Ensure white background
        });
        setIsSaving(true);
        setError(null);

        try {
            const filename = editingImage ? editingImage.split('/').pop() : `drawing-${Date.now()}.png`;
            const url = editingImage ? `https://noteboard-backend.onrender.com/edit-drawing/${filename}` : 'https://noteboard-backend.onrender.com/save-drawing';

            const response = await axios({
                method: editingImage ? 'put' : 'post',
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    dataURL,
                },
            });

            setEditingImage(null);
            fetchImages();
        } catch (error) {
            console.error('Error saving drawing:', error.response ? error.response.data : error.message);
            setError('Failed to save drawing. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (filename) => {
        try {
            await axios.delete(`https://noteboard-backend.onrender.com/drawings/${filename}`);
            fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            setError('Failed to delete image.');
        }
    };

    const handleDownload = () => {
        if (canvas) {
            const dataURL = canvas.getDataURL({
                backgroundColor: '#fff', // Ensure white background
            });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'drawing.png';
            link.click();
        }
    };

    const handleClear = () => {
        if (canvas) {
            canvas.clear();
        }
    };

    const handleCanvasRef = (canvasInstance) => {
        setCanvas(canvasInstance);
        canvasRef.current = canvasInstance;
    };

    const handleToolChange = (newTool) => {
        setTool(newTool);
        setBrushColor(newTool === 'eraser' ? '#FFFFFF' : brushColor);
    };

    const handleColorChange = (color) => {
        if (tool !== 'eraser') {
            setBrushColor(color);
        }
    };

    const loadImageToCanvas = async (imagePath) => {
        if (!canvasRef.current) return;

        try {
            const response = await axios.get(`https://noteboard-backend.onrender.com${imagePath}`, { responseType: 'blob' });
            const imageBlob = new Blob([response.data], { type: 'image/png' });
            const imageURL = URL.createObjectURL(imageBlob);

            const img = new Image();
            img.src = imageURL;

            img.onload = () => {
                const context = canvasRef.current.canvas.drawingContext;
                if (context) {
                    canvasRef.current.clear();
                    context.drawImage(img, 0, 0, canvasRef.current.canvas.width, canvasRef.current.canvas.height);
                }
            };

            img.onerror = (error) => {
                console.error('Error loading image onto canvas:', error);
                setError('Failed to load image onto canvas.');
            };
        } catch (error) {
            console.error('Error fetching image for editing:', error);
            setError('Failed to fetch image for editing.');
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className=" p-4 lg:p-8 bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen">
            <h1 className="text-5xl font-bold mb-8 text-gray-800 text-center">Whiteboard</h1>
           
            <div className="mb-8 flex flex-col md:flex-row justify-between">
                <div class="flex flex-wrap justify-around gap-3">
                    <button
                        onClick={() => handleColorChange('#000000')}
                        className={`px-4 my-2 py-2 rounded-full ${tool === 'eraser' ? 'bg-gray-300' : brushColor === '#000000' ? 'bg-black text-white' : 'bg-gray-200'} `}
                        aria-label="Black Brush Color"
                        disabled={tool === 'eraser'}
                    >
                        Black
                    </button>
                    <button
                        onClick={() => handleColorChange('#FF0000')}
                        className={`px-4 my-2 py-2 rounded-full ${tool === 'eraser' ? 'bg-gray-300' : brushColor === '#FF0000' ? 'bg-red-600 text-white' : 'bg-red-200'} `}
                        aria-label="Red Brush Color"
                        disabled={tool === 'eraser'}
                    >
                        Red
                    </button>
                    <button
                        onClick={() => handleColorChange('#00FF00')}
                        className={`px-4 my-2 py-2 rounded-full ${tool === 'eraser' ? 'bg-gray-300' : brushColor === '#00FF00' ? 'bg-green-600 text-white' : 'bg-green-200'} `}
                        aria-label="Green Brush Color"
                        disabled={tool === 'eraser'}
                    >
                        Green
                    </button>
                    <button
                        onClick={() => handleColorChange('#0000FF')}
                        className={`px-4 my-2 py-2 rounded-full ${tool === 'eraser' ? 'bg-gray-300' : brushColor === '#0000FF' ? 'bg-blue-600 text-white' : 'bg-blue-200'} `}
                        aria-label="Blue Brush Color"
                        disabled={tool === 'eraser'}
                    >
                        Blue
                    </button>
                    <button
                        onClick={() => handleColorChange('#FFFF00')}
                        className={`px-4 my-2 py-2 rounded-full ${tool === 'eraser' ? 'bg-gray-300' : brushColor === '#FFFF00' ? 'bg-yellow-600 text-black' : 'bg-yellow-200'} `}
                        aria-label="Yellow Brush Color"
                        disabled={tool === 'eraser'}
                    >
                        Yellow
                    </button>
                </div>

                <div class="flex flex-row justify-around gap-4">
                    <button  onClick={() => handleToolChange('brush')}
                            className={`px-6 py-3 rounded-lg shadow-md transition-transform ${tool === 'brush' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-300'} hover:scale-105`}
                            aria-label="Brush Tool"
                                >
                                    Brush
                    </button>
                    <button
                                    onClick={() => handleToolChange('eraser')}
                                    className={`px-6 py-3 rounded-lg shadow-md transition-transform ${tool === 'eraser' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-300'} hover:scale-105`}
                                    aria-label="Eraser Tool"
                                >
                                    Eraser
                    </button>
                </div>

                <div class="flex flex-wrap gap-3 justify-around">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-6 py-2 rounded-lg transition ${isSaving ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        aria-busy={isSaving}
                    >
                        {isSaving ? 'Saving...' : (editingImage ? 'Save Changes' : 'Save')}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-6 py-3 rounded-lg bg-green-600 text-white shadow-md transition-transform hover:scale-105"
                        aria-label="Download Drawing"
                    >
                        Download
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-6 py-3 rounded-lg bg-red-600 text-white shadow-md transition-transform hover:scale-105"
                        aria-label="Clear Drawing"
                    >
                        Clear
                    </button>
                </div>
            </div>


            <div className="bg-white shadow-lg rounded-lg mb-8 p-4 mx-auto" style={{ width: '100%', height: '600px' }}>
                <CanvasDraw
                    ref={handleCanvasRef}
                    brushColor={brushColor}
                    brushRadius={5}
                    hideGrid
                    hideInterface
                    lazyRadius={0}
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
            
            {error && <p className="text-red-600 text-center">{error}</p>}
            {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative bg-white border border-gray-300 rounded-lg overflow-hidden">
                            <img src={`https://noteboard-backend.onrender.com${image}`} alt={`Drawing ${index}`} className="w-full h-auto object-cover" />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button
                                    onClick={() => {
                                        setEditingImage(image);
                                        loadImageToCanvas(image);
                                    }}
                                    className="bg-blue-600 text-white p-1 rounded-lg hover:bg-blue-700 transition"
                                    aria-label="Edit Drawing"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13l3 3 7-7L10 6l-7 7m9-1h8m-8 4h8" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(image.split('/').pop())}
                                    className="bg-red-600 text-white p-1 rounded-lg hover:bg-red-700 transition"
                                    aria-label="Delete Drawing"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 7v14a1 1 0 001 1h10a1 1 0 001-1V7m-6 4V3m4 4H7M6 3h12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No images found.</p>
            )}
        </div>
    );
};

export default Whiteboard;
