'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface PropertyDashboardProps {
  params: { id: string };
}

export default function PropertyDashboard({ params }: PropertyDashboardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dashboard-layout">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-[350px] border-r border-gray-200 min-h-screen flex flex-col p-6 gap-5">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>უკან დაბრუნება</span>
          </button>

          {/* Upload Property Section */}
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-medium text-gray-900">Upload Property</h2>
            
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-700 mb-4">Drag and drop files or click to upload</p>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
                Upload Files
              </button>
            </div>
          </div>

          {/* Agent Statistics */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Agent Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700">Profile Completion</span>
                <span className="text-blue-600 font-medium">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Properties</span>
                <span className="text-blue-600 font-medium">124</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Active Listings</span>
                <span className="text-blue-600 font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Successful Sales</span>
                <span className="text-blue-600 font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Response Rate</span>
                <span className="text-blue-600 font-medium">95%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Property Info Header */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">ქონების დეტალები</h1>
                <p className="text-gray-600">თბილისი, საქართველო</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V15a3 3 0 003 3h6a3 3 0 003-3v-2.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
                    </svg>
                    2 საძინებელი
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                    2 სააბაზანო
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                    </svg>
                    120 მ²
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    ბინა
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-500 mb-2">$350,000</div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">გასაყიდი</span>
              </div>
            </div>

            {/* Property Images */}
            <div className="bg-blue-100 rounded-lg h-[300px] mb-4 flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Property Thumbnails */}
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg bg-cover bg-center" 
                     style={{backgroundImage: `url('https://static.motiffcontent.com/private/resource/image/1968daba134bbfe-e08ec7b7-5040-47fb-8386-17ee85fe2f7e.jpeg')`}}>
                </div>
              ))}
            </div>
          </div>

          {/* Property Location */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property Location</h3>
            <div className="bg-blue-100 rounded-lg h-[200px] flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="bg-blue-100 rounded-lg h-[200px] flex items-center justify-center mb-4">
              <div className="text-center">
                <svg className="w-16 h-16 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-blue-600 font-medium">Property Analytics Chart</p>
              </div>
            </div>
            
            {/* Chart Timeline */}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Messages */}
        <div className="w-[432px] border-l border-gray-200 min-h-screen flex flex-col">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="bg-transparent flex-1 outline-none text-gray-600"
              />
            </div>
          </div>

          {/* Message Item */}
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-cover bg-center" 
                 style={{backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/1968daba1343910-52db3341-40da-4787-82a5-4dd66cad925a.jpeg')"}}></div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-gray-900">Agent</span>
                <span className="text-sm text-gray-500">2m ago</span>
              </div>
              <p className="text-sm text-gray-600">Latest message from the conversation...</p>
            </div>
          </div>

          {/* Chat Input */}
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="bg-transparent flex-1 outline-none text-gray-600"
              />
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 