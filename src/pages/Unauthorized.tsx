import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ExclamationTriangleIcon, 
  ArrowLeftIcon,
  HomeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function Unauthorized() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Access Denied
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          You don't have permission to access this resource
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-red-600" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Unauthorized Access
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Your current role ({user?.role}) doesn't have permission to access this page.
            </p>

            <div className="space-y-3">
              <Link
                to="/"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Go to Home
              </Link>
              
              <button
                onClick={logout}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Switch Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
