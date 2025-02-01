import React from 'react';
import { Navigate } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, signInWithGoogle } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reign Co.</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to continue</p>
        </div>
        <button
          onClick={signInWithGoogle}
          className="group relative w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 transition-colors duration-200"
        >
          <Chrome className="h-5 w-5 text-[#4285F4]" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;