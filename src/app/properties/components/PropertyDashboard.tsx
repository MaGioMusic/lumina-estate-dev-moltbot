'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ChartBarIcon, 
  HomeIcon, 
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface PropertyDashboardProps {
  propertyId?: string;
}

const PropertyDashboard: React.FC<PropertyDashboardProps> = ({ propertyId }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Agent',
      avatar: '/images/photos/contact-2.jpg',
      message: 'Hello! How can I help you with this property?',
      timestamp: '2m ago',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      avatar: '/images/photos/contact-1.jpg',
      message: 'I\'m interested in scheduling a viewing.',
      timestamp: '1m ago',
      isOwn: true
    }
  ]);

  // Mock data for demonstration
  const agentStats = {
    profileCompletion: 85,
    totalProperties: 124,
    activeListings: 45,
    successfulSales: 89,
    responseRate: 95
  };

  // Property details based on ID
  const getPropertyDetails = (id: string) => {
    const properties: Record<string, any> = {
      '1': {
        title: t('luxuryVillaInVake'),
        address: `${t('vake')}, ${t('vera')}, ${t('tbilisi')}`,
        price: '$450,000',
        type: t('villa'),
        bedrooms: 4,
        bathrooms: 3,
        area: '240 მ²'
      },
      '2': {
        title: t('modernPenthouseInCenter'),
        address: `${t('rustaveliAvenue')}, ${t('tbilisi')}`,
        price: '$850,000',
        type: t('penthouse'),
        bedrooms: 3,
        bathrooms: 3,
        area: '189 მ²'
      },
      default: {
        title: t('propertyDetails'),
        address: `${t('tbilisi')}, ${t('georgia')}`,
        price: '$350,000',
        type: t('apartment'),
        bedrooms: 2,
        bathrooms: 2,
        area: '120 მ²'
      }
    };
    return properties[id || 'default'] || properties.default;
  };

  const currentProperty = getPropertyDetails(propertyId || 'default');

  const propertyImages = [
    '/images/properties/property-1.jpg',
    '/images/properties/property-2.jpg',
    '/images/properties/property-3.jpg',
    '/images/properties/property-4.jpg'
  ];

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setIsUploading(true);
      const fileArray = Array.from(files);
      
      // Simulate upload process
      setTimeout(() => {
        setUploadedFiles(prev => [...prev, ...fileArray]);
        setIsUploading(false);
        console.log('Files uploaded successfully:', fileArray.map(f => f.name));
      }, 1500);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        avatar: '/images/photos/contact-1.jpg',
        message: messageInput,
        timestamp: 'now',
        isOwn: true
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      
      // Simulate agent response after 2 seconds
      setTimeout(() => {
        const agentResponse = {
          id: messages.length + 2,
          sender: 'Agent',
          avatar: '/images/photos/contact-2.jpg',
          message: 'Thank you for your message! I\'ll get back to you shortly.',
          timestamp: 'now',
          isOwn: false
        };
        setMessages(prev => [...prev, agentResponse]);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-5">
        {/* Back Button */}
        <div className="mb-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>უკან დაბრუნება</span>
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-orange-500">Lumina Estate</span>
          </div>
          
          <nav className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 text-blue-600">
              <ChartBarIcon className="w-5 h-5" />
              <span>დაშბორდი</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <HomeIcon className="w-5 h-5 text-orange-500" />
              <span>ქონება</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <ChartBarIcon className="w-5 h-5 text-orange-500" />
              <span>ანალიტიკა</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-orange-500" />
              <span>შეტყობინებები</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Cog6ToothIcon className="w-5 h-5 text-orange-500" />
              <span>პარამეტრები</span>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-orange-500 rounded"></div>
            <div className="w-6 h-6 bg-orange-500 rounded"></div>
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image 
                src="/images/photos/contact-1.jpg" 
                alt="Profile" 
                width={32} 
                height={32}
                className="object-cover"
              />
            </div>
            <span className="text-gray-700">John Cooper</span>
            <div className="w-4 h-4 text-gray-600">▼</div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-gray-200 p-6 space-y-8">
          {/* Upload Property Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-5">ქონების ატვირთვა</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              {isUploading ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                  <p className="text-blue-600">ფაილების ატვირთვა...</p>
                </div>
              ) : (
                <>
                  <CloudArrowUpIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">ფაილების გადმოთრევა ან ატვირთვა</p>
                  <label className="bg-orange-500 text-white px-6 py-2 rounded-lg cursor-pointer inline-block hover:bg-orange-600 transition-colors">
                    ფაილების ატვირთვა
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  </label>
                </>
              )}
            </div>
            
            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-700">ატვირთული ფაილები ({uploadedFiles.length})</h3>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm">
                      <span className="truncate flex-1">{file.name}</span>
                      <button 
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Agent Statistics */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">აგენტის სტატისტიკა</h3>
            <div className="space-y-5">
              {/* Profile Completion with Progress Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">პროფილის შევსება</span>
                  <span className="text-blue-600 font-medium">{agentStats.profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${agentStats.profileCompletion}%` }}
                  ></div>
                </div>
              </div>

              {/* Response Rate with Progress Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">პასუხის მაჩვენებელი</span>
                  <span className="text-green-600 font-medium">{agentStats.responseRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${agentStats.responseRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Number Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{agentStats.totalProperties}</div>
                  <div className="text-xs text-gray-500">სულ ქონება</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">{agentStats.activeListings}</div>
                  <div className="text-xs text-gray-500">აქტიური განცხადებები</div>
                </div>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">{agentStats.successfulSales}</div>
                <div className="text-xs text-gray-500">წარმატებული გაყიდვები</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Property Info Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentProperty.title}</h1>
                <p className="text-gray-600 mb-4">{currentProperty.address}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>🛏️ {currentProperty.bedrooms} საძინებელი</span>
                  <span>🚿 {currentProperty.bathrooms} სააბაზანო</span>
                  <span>📐 {currentProperty.area}</span>
                  <span>🏠 {currentProperty.type}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-orange-600 mb-2">{currentProperty.price}</div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  გასაყიდად
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Property Images Gallery */}
            <div className="bg-gray-50 rounded-lg p-4">
              {/* Main Chart/Map Placeholder */}
              <div className="bg-blue-100 rounded-lg h-75 mb-4 flex items-center justify-center">
                <div className="text-center">
                  <ChartBarIcon className="w-16 h-16 text-blue-600 mx-auto mb-2" />
                  <p className="text-blue-600 font-medium">Property Analytics Chart</p>
                </div>
              </div>
              
              {/* Image Gallery */}
              <div className="flex space-x-4">
                {propertyImages.map((image, index) => (
                  <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
                    <Image 
                      src={image} 
                      alt={`Property ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ყოველთვიური მაჩვენებლები</h3>
              <div className="h-48 flex items-end justify-between px-4 pb-4 space-x-2">
                {/* Mock Chart Bars */}
                {[65, 85, 45, 75, 95, 70, 80, 60, 90, 55, 75, 85].map((height, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div 
                      className="bg-blue-500 w-8 rounded-t transition-all duration-1000 ease-out hover:bg-blue-600 cursor-pointer"
                      style={{ 
                        height: `${height}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                      title={`Month ${index + 1}: ${height}%`}
                    ></div>
                    <span className="text-xs text-gray-500 rotate-45 origin-bottom-left">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Chart Legend */}
              <div className="flex justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">ქონების ნახვები</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">შეკითხვები</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-gray-600">გაყიდვები</span>
                </div>
              </div>
            </div>

            {/* Property Location Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">ქონების მდებარეობა</h3>
              <div className="bg-gray-100 rounded-lg h-46 flex items-center justify-center">
                <span className="text-gray-500">Interactive Map Component</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Messages */}
        <div className="w-96 border-l border-gray-200">
          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="bg-gray-50 rounded-lg flex items-center px-3 py-2">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="საუბრების ძიება..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto max-h-96 space-y-3 p-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex space-x-3 ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image 
                    src={msg.avatar} 
                    alt={msg.sender} 
                    width={32} 
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className={`flex-1 min-w-0 ${msg.isOwn ? 'text-right' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`font-medium text-sm ${msg.isOwn ? 'text-blue-600' : 'text-gray-900'}`}>
                      {msg.sender}
                    </h4>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <div className={`inline-block px-3 py-2 rounded-lg text-sm max-w-xs ${
                    msg.isOwn 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="absolute bottom-0 right-0 w-96 p-4 bg-white border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg flex items-center px-4 py-3">
              <PaperClipIcon className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="შეტყობინების ჩაწერა..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-transparent flex-1 outline-none text-gray-600 placeholder-gray-400"
              />
              <FaceSmileIcon className="w-5 h-5 text-gray-400 mx-2" />
              <button 
                onClick={handleSendMessage}
                className="text-gray-400 hover:text-gray-600"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg shadow-lg transition-colors">
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default PropertyDashboard; 