"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Download, Loader2, RefreshCw, ZoomIn, Sliders } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Generate: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gridSize, setGridSize] = useState<number>(8);
  const [imageCount, setImageCount] = useState<number>(10);
  const [showSettings, setShowSettings] = useState(false);
  const [cardSize, setCardSize] = useState<"small" | "medium" | "large">(
    "small"
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGridSize(2);
      } else if (window.innerWidth < 768) {
        setGridSize(3);
      } else if (window.innerWidth < 1024) {
        setGridSize(4);
      } else if (window.innerWidth < 1280) {
        setGridSize(6);
      } else {
        if (cardSize === "small") {
          setGridSize(8);
        } else if (cardSize === "medium") {
          setGridSize(6);
        } else {
          setGridSize(4);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [cardSize]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/generate?count=${imageCount}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate images");
      }

      const data = await response.json();
      setImages(data.images || []);
      setEvaluations(data.evaluations || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (base64Image: string, filename: string) => {
    const link = document.createElement("a");
    link.href = `data:image/jpeg;base64,${base64Image}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = async () => {
    if (images.length === 0) return;

    const zip = new JSZip();
    const folder = zip.folder("generated_images");

    images.forEach((img, index) => {
      folder?.file(`generated_image_${index + 1}.jpg`, img, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "generated_images.zip");
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const presetCounts = [5, 10, 20, 50, 100];

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Generate Medical Images
          </h1>
          <p className="text-gray-600 mb-6">
            Generate synthetic medical images using our advanced AI model. These
            images can be used for research, training, or educational purposes.
          </p>

          <div className="flex flex-wrap gap-4 items-center mb-4">
            <button
              onClick={handleGenerate}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition flex items-center gap-2 font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  Generate Images
                </>
              )}
            </button>

            <button
              onClick={toggleSettings}
              className="bg-gray-200 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-300 transition flex items-center gap-2"
            >
              <Sliders className="h-5 w-5" />
              Settings
            </button>

            {images.length > 0 && (
              <button
                onClick={downloadAllImages}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition flex items-center gap-2 font-medium"
              >
                <Download className="h-5 w-5" />
                Download All
              </button>
            )}
          </div>

          {showSettings && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-3">
                Generation Settings
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select:
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetCounts.map((count) => (
                    <button
                      key={count}
                      onClick={() => setImageCount(count)}
                      className={`px-3 py-1 text-sm rounded-md transition ${
                        imageCount === count
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {count} {count === 1 ? "image" : "images"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="imageCount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Number of Images to Generate (1-100):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      id="imageCount"
                      min="1"
                      max="100"
                      value={imageCount}
                      onChange={(e) => setImageCount(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={imageCount}
                      onChange={(e) => setImageCount(Number(e.target.value))}
                      className="w-16 border rounded px-2 py-1 text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <p className="text-xs text-gray-500">
                  Note: Generating a large number of images may take longer to
                  process.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">
              Generating {imageCount} images, please wait...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This may take a moment for larger batches
            </p>
          </div>
        )}

        {!loading && images.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Generated Images ({images.length})
              </h2>
            </div>

            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              }}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition border border-gray-200"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={`data:image/jpeg;base64,${img}`}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </div>

                  <div className="p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        #{index + 1}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${
                          evaluations[index] > 0.7
                            ? "bg-green-100 text-green-800"
                            : evaluations[index] > 0.5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {evaluations[index] > 0.7
                          ? "High"
                          : evaluations[index] > 0.5
                          ? "Medium"
                          : "Low"}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-1 mb-1.5">
                      <div
                        className={`h-1 rounded-full ${
                          evaluations[index] > 0.7
                            ? "bg-green-600"
                            : evaluations[index] > 0.5
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${evaluations[index] * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {evaluations[index].toFixed(2)}
                      </span>
                      <button
                        onClick={() =>
                          downloadImage(img, `generated_image_${index + 1}.jpg`)
                        }
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded flex items-center gap-1 transition"
                      >
                        <Download className="h-2.5 w-2.5" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && images.length === 0 && !error && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <div className="flex justify-center mb-4">
              <RefreshCw className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Images Generated Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Click the "Generate Images" button to create new synthetic medical
              images.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generate;
