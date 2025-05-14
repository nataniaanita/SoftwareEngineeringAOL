import React, { useState } from 'react';

const Generate: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'GET', 
      });

      if (!response.ok) {
        throw new Error('Failed to generate images');
      }

      const data = await response.json();
      setImages(data.images || []);
      setEvaluations(data.evaluations || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Images'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((img, index) => (
          <div key={index} className="text-center">
            <img
              src={`data:image/jpeg;base64,${img}`}
              alt={`Generated ${index}`}
              className="w-full rounded shadow"
            />
            <p className="mt-2">Discriminator Evaluation: {evaluations[index] > 0.5 ? 'Real' : 'Fake'}</p>
            <p className="mt-2 text-sm">Confidence: {evaluations[index].toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Generate;
