'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { FiSearch, FiPhone, FiVideo, FiPaperclip, FiImage, FiSend, FiUser, FiClock, FiMapPin, FiMail, FiShoppingBag, FiHelpCircle } from 'react-icons/fi';

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  avatar: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: string;
  status: string;
}

export default function ChatPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  
  const contact = searchParams.get('contact');
  const [selectedChat, setSelectedChat] = useState<string>('giorgi-mamaladze');
  const [newMessage, setNewMessage] = useState('');

  // Mock data for chat users
  const chatUsers: ChatUser[] = [
    {
      id: 'giorgi-mamaladze',
      name: 'გიორგი მამალაძე',
      avatar: '/images/photos/contact-1.jpg',
      lastMessage: 'გმადლობთ დახმარებისთვის, ძალიან...',
      timestamp: '10:23',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 'nino-kvaratskhelia',
      name: 'ნინო კვარაცხელია',
      avatar: '/images/photos/contact-2.jpg',
      lastMessage: 'როდის იქნება ხელმისაწვდომი?',
      timestamp: '09:45',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 'davit-gurgenidze',
      name: 'დავით გურგენიძე',
      avatar: '/images/photos/contact-3.jpg',
      lastMessage: 'გმადლობთ ინფორმაციისთვის',
      timestamp: 'გუშინ',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 'tamar-beridze',
      name: 'თამარ ბერიძე',
      avatar: '/images/photos/contact-4.jpg',
      lastMessage: '',
      timestamp: 'გუშინ',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 'levan-kiknadze',
      name: 'ლევან კიკნაძე',
      avatar: '/images/photos/contact-1.jpg',
      lastMessage: 'კიდევ მაქვს რამდენიმე კითხვა...',
      timestamp: '19/05',
      unreadCount: 3,
      isOnline: false
    },
    {
      id: 'mariam-gogoladze',
      name: 'მარიამ გოგოლაძე',
      avatar: '/images/photos/contact-2.jpg',
      lastMessage: 'მადლობა დროული პასუხისთვის',
      timestamp: '18/05',
      unreadCount: 0,
      isOnline: false
    }
  ];

  // Mock messages for selected chat
  const messages: Message[] = [
    {
      id: '1',
      text: 'გამარჯობა, მაინტერესებს თქვენი პროდუქტის შესახებ დამატებითი ინფორმაცია',
      timestamp: '10:15',
      isOwn: false,
      avatar: '/images/photos/contact-1.jpg'
    },
    {
      id: '2',
      text: 'გამარჯობა! რა თქმა უნდა, რა გაინტერესებთ კონკრეტულად?',
      timestamp: '10:17',
      isOwn: true,
      avatar: '/images/photos/contact-4.jpg'
    },
    {
      id: '3',
      text: 'მაინტერესებს ფასი და მიწოდების ვადები',
      timestamp: '10:19',
      isOwn: false,
      avatar: '/images/photos/contact-1.jpg'
    },
    {
      id: '4',
      text: 'პროდუქტის ფასი არის 299₾, ხოლო მიწოდება შესაძლებელია 2-3 სამუშაო დღეში თბილისის მასშტაბით. რეგიონებში მიწოდებას სჭირდება 3-5 სამუშაო დღე.',
      timestamp: '10:20',
      isOwn: true,
      avatar: '/images/photos/contact-4.jpg'
    },
    {
      id: '5',
      text: 'გმადლობთ დახმარებისთვის, ძალიან სასარგებლო ინფორმაციაა',
      timestamp: '10:23',
      isOwn: false,
      avatar: '/images/photos/contact-1.jpg'
    }
  ];

  // Mock transactions
  const transactions: Transaction[] = [
    { id: '1', date: '15/05/2023', amount: '299₾', status: 'დასრულებული' },
    { id: '2', date: '03/04/2023', amount: '149₾', status: 'დასრულებული' },
    { id: '3', date: '22/02/2023', amount: '499₾', status: 'დასრულებული' }
  ];

  const selectedUser = chatUsers.find(user => user.id === selectedChat);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (contact) {
      setSelectedChat(contact);
    }
  }, [contact]);

  return (
    <div className={`h-screen flex ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} pt-16`}>
      {/* Left Sidebar - Chat List */}
      <div className={`w-[350px] flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Search Bar */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`relative ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-sm`}>
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
            <input
              type="text"
              placeholder="ძიება"
              className={`w-full pl-10 pr-4 py-2 ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} rounded-lg border-0 focus:ring-2 focus:ring-orange-500`}
            />
            <FiSearch className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chatUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedChat(user.id)}
              className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'} cursor-pointer transition-colors ${
                selectedChat === user.id ? (theme === 'dark' ? 'bg-gray-700' : 'bg-white') : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate`}>
                      {user.name}
                    </h3>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} truncate`}>
                      {user.lastMessage}
                    </p>
                    {user.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedUser?.avatar || '/images/photos/contact-1.jpg'}
                alt={selectedUser?.name || 'User'}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {selectedUser?.name || 'გიორგი მამალაძე'}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    ონლაინ
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                <FiPhone className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              <button className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                <FiVideo className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              {!message.isOwn && (
                <img
                  src={message.avatar}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className={`max-w-lg ${message.isOwn ? 'order-first' : ''}`}>
                <div className={`px-4 py-3 rounded-lg ${
                  message.isOwn 
                    ? 'bg-orange-500 text-white' 
                    : theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                } shadow-sm`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <div className={`mt-1 text-xs ${
                  message.isOwn ? 'text-right' : 'text-left'
                } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {message.timestamp}
                </div>
              </div>
              {message.isOwn && (
                <img
                  src={message.avatar}
                  alt="You"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className={`flex items-center gap-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3`}>
            <button className={`p-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
              <FiPaperclip className="w-5 h-5" />
            </button>
            <button className={`p-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
              <FiImage className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="დაწერეთ შეტყობინება..."
              className={`flex-1 ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-900 placeholder-gray-500'} border-0 focus:ring-0 focus:outline-none`}
            />
            <button className={`p-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}>
              <FiImage className="w-5 h-5" />
            </button>
            <button
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - User Profile */}
      <div className={`w-[350px] flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-l ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto`}>
        {/* User Profile */}
        <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} text-center`}>
          <img
            src={selectedUser?.avatar || '/images/photos/contact-1.jpg'}
            alt={selectedUser?.name || 'User'}
            className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
          />
          <h3 className={`mt-4 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {selectedUser?.name || 'გიორგი მამალაძე'}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>ონლაინ</span>
          </div>
        </div>

        {/* Contact Information */}
        <div className={`p-5 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            საკონტაქტო ინფორმაცია
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FiPhone className="w-4 h-4 text-green-600" />
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                +995 599 12 34 56
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FiMail className="w-4 h-4 text-green-600" />
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                giorgi.mamaladze@gmail.com
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FiMapPin className="w-4 h-4 text-green-600" />
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                თბილისი, საქართველო
              </span>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className={`p-5 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            ტრანზაქციების ისტორია
          </h4>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-lg p-3 shadow-sm`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {transaction.date}
                  </span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {transaction.amount}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-5">
          <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            სწრაფი ქმედებები
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-900'} p-3 rounded-lg shadow-sm transition-colors flex items-center gap-2`}>
              <FiClock className="w-4 h-4" />
              <span className="text-sm font-medium">ისტორია</span>
            </button>
            <button className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-900'} p-3 rounded-lg shadow-sm transition-colors flex items-center gap-2`}>
              <FiUser className="w-4 h-4" />
              <span className="text-sm font-medium">პროფილი</span>
            </button>
            <button className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-900'} p-3 rounded-lg shadow-sm transition-colors flex items-center gap-2`}>
              <FiShoppingBag className="w-4 h-4" />
              <span className="text-sm font-medium">შეკვეთები</span>
            </button>
            <button className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-900'} p-3 rounded-lg shadow-sm transition-colors flex items-center gap-2`}>
              <FiHelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">დახმარება</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 