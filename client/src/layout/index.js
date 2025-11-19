import React from 'react';
import logo from '../assets/logo.png';

const AuthLayouts = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Floating Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="animate-float w-24 h-24 bg-white/30 rounded-full absolute top-1/4 left-1/4 shadow-xl"></div>
        <div className="animate-float-delay w-32 h-32 bg-yellow-300/40 rounded-full absolute bottom-1/4 right-1/3 shadow-2xl"></div>
        <div className="animate-spin-slow w-20 h-20 bg-green-300/40 rounded-full absolute top-1/3 right-1/4 shadow-xl"></div>
        <div className="animate-float w-28 h-28 bg-red-300/40 rounded-full absolute bottom-1/3 left-1/5 shadow-2xl"></div>
      </div>

      {/* Header */}
      <header className="flex justify-center items-center py-6 h-24 shadow-lg bg-white/30 backdrop-blur-lg sticky top-0 z-50 border-b-4 border-white/40">
        <img
          src={logo}
          alt="logo"
          width={180}
          height={60}
          className="transition-transform duration-500 hover:scale-125 hover:rotate-3 drop-shadow-lg"
        />
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-10 relative z-10">
        <div className="w-full max-w-lg bg-gradient-to-r from-white via-gray-100 to-white backdrop-blur-xl rounded-3xl shadow-2xl p-10 transform transition-all duration-700 hover:shadow-4xl hover:-translate-y-3 border-4 border-white/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 opacity-20 rounded-3xl blur-lg"></div>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>

      {/* Glowing Animated Circles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="animate-glow w-48 h-48 bg-pink-500/30 rounded-full absolute top-1/4 left-1/3 filter blur-4xl"></div>
        <div className="animate-glow-delay w-64 h-64 bg-indigo-500/30 rounded-full absolute bottom-1/4 right-1/4 filter blur-4xl"></div>
      </div>

      {/* Sparkling Particles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="animate-sparkle w-2 h-2 bg-white rounded-full absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          @keyframes float-delay {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-30px);
            }
          }
          @keyframes glow {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.5;
            }
          }
          @keyframes glow-delay {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.6;
            }
          }
          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-delay {
            animation: float-delay 8s ease-in-out infinite;
          }
          .animate-glow {
            animation: glow 4s ease-in-out infinite;
          }
          .animate-glow-delay {
            animation: glow-delay 6s ease-in-out infinite;
          }
          .animate-sparkle {
            animation: sparkle 2s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default AuthLayouts;