"use client"

import type React from "react"

import { useState, useRef } from "react"
import axios from "axios"
import { Upload, X, CheckCircle, AlertCircle, FileUp } from "lucide-react"

function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState("")
  const [message, setMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value) // ngeset type jadi inputannya soalnya function ini dipanggil pas valuenya (inputnya) berubah
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    if (selectedFile) {
      setFile(selectedFile)
      setStatus("idle")
      setMessage("")
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.name.endsWith(".zip")) {
      setFile(droppedFile)
      setStatus("idle")
      setMessage("")
    } else {
      setStatus("error")
      setMessage("Please upload a ZIP file")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("File must not be empty!")
      setStatus("error")
      return
    }
    if (!type){
      setMessage("Dataset type must be specified!")
      setStatus("error")
      return
    }

    if ((file.size / 1024 / 1024) > 50){
      setMessage("File must not be bigger than 50MB")
      setFile(null)
      setStatus("error")
      return
    }

    setIsUploading(true)
    setMessage("")
    setStatus("idle")

    const formData = new FormData() // masukkin file dan typenya ke sini
    formData.append("file", file)
    formData.append("filetype", type)

    try {
      // ngirim ke backend
      const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setMessage(res.data.message)
      setStatus("success")
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setMessage("Upload failed. Please try again.")
      setStatus("error")
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setType("")
    setMessage("")
    setStatus("idle")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (

    <div className="min-h-screen h-full w-full bg-[#FFFFFF] flex items-center justify-center p-4">

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
          <div className="bg-[#67b1d6] p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Upload Dataset</h1>
            <p className="text-violet-100 mt-2">Upload your ZIP files</p>
          </div>
          <div className="flex flex-col justify-center items-center text-center">
              <label htmlFor="type" className="text-l mb-1 font-bold m-5 text-gray-800">Enter dataset type</label>
              <input className="border-2 rounded-md border-gray-300 w-75 p-2" 
              type="text" 
              name="type" 
              id="type"  
              value={type}
              onChange={handleInputChange}/>
            </div>
          <div className="p-6">
            <div
              className={`border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center ${
                isDragging
                  ? "border-violet-500 bg-violet-50"
                  : file
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-violet-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept=".zip"
                onChange={handleChange}
                disabled={isUploading}
                className="hidden"
                ref={fileInputRef}
              />

              
              <div className="flex flex-col items-center justify-center space-y-3">
                {file ? (
                  <>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FileUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 truncate max-w-[200px]">{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          clearFile()
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-full bg-violet-100 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-violet-600" />
                    </div>
                    <p className="text-gray-700 font-medium">Drag & drop your ZIP file here</p>
                    <p className="text-sm text-gray-500">or click to browse files</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleUpload}
                disabled={isUploading || !file}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                  !file
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                }`}
              >
                {isUploading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Upload...
                  </>
                ) : (
                  "Upload ZIP File"
                )}
              </button>
            </div>

            {message && (
              <div
                className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
                  status === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <p>{message}</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">Max size 50MB</p>
      </div>
    </div>

  )
  
}

export default UploadPage;