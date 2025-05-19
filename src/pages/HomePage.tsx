"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  Database,
  Shield,
  ChevronRight,
  ExternalLink,
  Play,
} from "lucide-react";

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-24 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-1000 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Synthetic Chest X-ray Generation
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Revolutionizing medical imaging with AI-powered synthetic data
                generation for enhanced pneumonia detection and diagnosis.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="bg-blue-700 bg-opacity-30 hover:bg-opacity-40 text-white border border-blue-400 px-8 py-4 rounded-lg font-medium transition-all flex items-center group"
                >
                  Try Demo
                  <Play className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            <div
              className={`relative transition-all duration-1000 delay-300 transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            ></div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto fill-gray-50"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Project Overview
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Addressing the critical challenge of limited medical imaging data
            through advanced generative AI techniques
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-6">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                The Challenge
              </h3>
              <p className="text-gray-600 mb-6">
                The development of accurate AI models for medical diagnosis is
                hindered by limited access to large, labeled medical image
                datasets due to privacy regulations, collection expenses, and
                the relative rarity of certain pathological conditions.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm text-blue-800">
                  <strong>Did you know?</strong> Only 1% of medical imaging data
                  is typically available for AI research due to privacy concerns
                  and regulatory restrictions.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Solution
              </h3>
              <p className="text-gray-600 mb-6">
                We implement a specialized Variational Autoencoder (VAE)
                architecture designed to synthesize chest X-ray images for
                respiratory disease analysis. By generating additional training
                examples, we aim to improve the classification performance of
                downstream diagnostic models.
              </p>
              <div className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-500">
                <p className="text-sm text-indigo-800">
                  <strong>Innovation:</strong> Our VAE model can generate
                  thousands of unique, high-quality synthetic X-rays that are
                  clinically relevant.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Data Augmentation",
              description:
                "Enhanced dataset size through synthetic generation of clinically accurate chest X-rays",
              icon: <Database className="h-6 w-6" />,
              color: "blue",
            },
            {
              title: "Improved Accuracy",
              description:
                "Better detection of pneumonia and other respiratory conditions through robust model training",
              icon: <Brain className="h-6 w-6" />,
              color: "indigo",
            },
            {
              title: "Ethical Data Use",
              description:
                "Addressing privacy concerns while advancing medical AI capabilities",
              icon: <Shield className="h-6 w-6" />,
              color: "purple",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-t-4 ${
                item.color === "blue"
                  ? "border-blue-500"
                  : item.color === "indigo"
                  ? "border-indigo-500"
                  : "border-purple-500"
              }`}
            >
              <div className="p-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                    item.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : item.color === "indigo"
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            to="/generate"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center group"
          >
            Try Demo Generation
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
