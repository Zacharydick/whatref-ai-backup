import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setSelectedFile(event.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error uploading the image:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Upload a Wristwatch Image</h2>
            <input type="file" onChange={handleFileChange} />
            <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{ border: '2px dashed #ccc', padding: '20px', margin: '20px 0' }}
            >
                Drag and drop your image here
            </div>
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Image'}
            </button>
            {result && <div>{JSON.stringify(result)}</div>}
        </div>
    );
};

export default ImageUpload;