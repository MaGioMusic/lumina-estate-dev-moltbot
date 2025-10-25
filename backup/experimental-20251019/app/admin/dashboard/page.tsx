'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      title: 'ქალაქები',
      value: '120',
      change: '+24%',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      description: 'ბოლო თვეში ჩამატებული'
    },
    {
      title: 'აქტიური ლისტინგები',
      value: '32',
      change: '+8%',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      description: 'გაყიდული ბინები'
    },
    {
      title: 'ახალი ლისტინგები',
      value: '18',
      change: '+24%',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'ბოლო კვირის სტატისტიკა'
    },
    {
      title: 'მთლიანი შემოსავალი',
      value: '€185,000',
      change: '+4%',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: 'ბოლო თვეში მიღებული'
    },
    {
      title: 'მიმოხილვები',
      value: '12',
      change: '+12%',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      description: 'ბოლო კვირის მიმოხილვები'
    },
    {
      title: 'დახურული გარიგებები',
      value: '5',
      change: '+2%',
      changeType: 'increase',
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      description: 'წარმატებულად დასრულებული'
    }
  ];

  const topAgents = [
    {
      name: 'ნიკოლოზ დავითაძე',
      percentage: 92,
      avatar: '/images/photos/contact-1.jpg'
    },
    {
      name: 'ნინო კაკაბაძე',
      percentage: 85,
      avatar: '/images/photos/contact-2.jpg'
    },
    {
      name: 'ფაუზა ვაშაღიძე',
      percentage: 78,
      avatar: '/images/photos/contact-3.jpg'
    },
    {
      name: 'ლაშა ლომიძე',
      percentage: 72,
      avatar: '/images/photos/contact-4.jpg'
    }
  ];

  const districts = [
    { name: 'ვაკე', percentage: 85 },
    { name: 'საბურთალო', percentage: 75 },
    { name: 'მთაწმინდა', percentage: 65 },
    { name: 'ვერე', percentage: 55 },
    { name: 'ჩუღურეთი', percentage: 45 }
  ];

  const recentTransactions = [
    {
      type: 'ბინები',
      amount: '₾350,000',
      date: '2 საათის წინ',
      description: 'ორი ბინა გაიყიდა'
    },
    {
      type: 'კომერციული',
      amount: '₾1,200,000',
      date: '5 საათის წინ',
      description: 'კომერციული ოფისი გაიყიდა'
    },
    {
      type: 'ქალაქის ოფისები',
      amount: '₾850,000',
      date: '1 დღის წინ',
      description: 'ოფისის კომპლექსი გაიყიდა'
    },
    {
      type: 'ვილები',
      amount: '₾2,500,000',
      date: '2 დღის წინ',
      description: 'ლუქს ვილა გაიყიდა'
    }
  ];

  const recentActivities = [
    {
      action: 'ახალი ლისტინგი დაემატა',
      time: '10:30',
      user: 'ნიკო ვაშაძე'
    },
    {
      action: 'გარიგება წარმატებით დასრულდა',
      time: '12:00 - 14:00',
      user: 'ნინო ვაშაძე'
    },
    {
      action: 'ახალი შეთავაზება მიღებულია',
      time: '16:00 - 17:00',
      user: 'ლაშა ფაცაცია'
    }
  ];

  const userComments = [
    {
      user: 'ნიკო კაკაბაძე',
      time: '10 წუთის წინ',
      comment: 'გამარჯობა, როგორ შეიძლება ამ ქონების შესახებ მეტი ინფორმაცია მივიღო?',
      avatar: '/images/photos/contact-1.jpg'
    },
    {
      user: 'ფაუზა ვაშაღიძე',
      time: '2 საათის წინ',
      comment: 'მადლობა შესანიშნავი სერვისისთვის, დავაკმაყოფილდი თქვენი მუშაობით!',
      avatar: '/images/photos/contact-2.jpg'
    },
    {
      user: 'ლაშა ლომიძე',
      time: '5 საათის წინ',
      comment: 'რა არის ამ ქონების საბოლოო ფასი?',
      avatar: '/images/photos/contact-3.jpg'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">დაშბორდი</h1>
          <p className="text-gray-600">მოგესალმებით, ადმინისტრატორ!</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="ძებნა..."
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="relative p-2 text-gray-500 hover:text-primary-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM7 7h5l-5-5v5z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="relative p-2 text-gray-500 hover:text-primary-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="relative p-2 text-gray-500 hover:text-primary-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {stat.icon}
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">გაყიდვების და შემოსავლების დინამიკა</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">შემოსავალი</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">გაყიდვები</span>
              </div>
            </div>
          </div>
          
          {/* Simplified Chart Visualization */}
          <div className="relative h-64 bg-gray-50 rounded-lg p-4">
            <svg className="w-full h-full" viewBox="0 0 600 200">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Blue area (შემოსავალი) */}
              <path d="M 0 160 Q 150 140 300 120 T 600 100 L 600 200 L 0 200 Z" fill="#3b82f6" opacity="0.3"/>
              <path d="M 0 160 Q 150 140 300 120 T 600 100" fill="none" stroke="#3b82f6" strokeWidth="2"/>
              
              {/* Green area (გაყიდვები) */}
              <path d="M 0 180 Q 150 160 300 140 T 600 120 L 600 200 L 0 200 Z" fill="#10b981" opacity="0.3"/>
              <path d="M 0 180 Q 150 160 300 140 T 600 120" fill="none" stroke="#10b981" strokeWidth="2"/>
              
              {/* Month labels */}
              <text x="50" y="190" fontSize="12" fill="#6b7280" textAnchor="middle">იანვარი</text>
              <text x="150" y="190" fontSize="12" fill="#6b7280" textAnchor="middle">თებერვალი</text>
              <text x="250" y="190" fontSize="12" fill="#6b7280" textAnchor="middle">მარტი</text>
              <text x="350" y="190" fontSize="12" fill="#6b7280" textAnchor="middle">აპრილი</text>
              <text x="450" y="190" fontSize="12" fill="#6b7280" textAnchor="middle">მაისი</text>
              <text x="550" y="190" fontSize="12" fill="#6b7280" textAnchor="middle">ივნისი</text>
            </svg>
          </div>
        </div>

        {/* Top Agents */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">საუკეთესო აგენტები</h2>
          <div className="space-y-4">
            {topAgents.map((agent, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img 
                  src={agent.avatar} 
                  alt={agent.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">{agent.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Districts Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">პოპულარული რაიონები</h2>
          <div className="space-y-3">
            {districts.map((district, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{district.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${district.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{district.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">ბოლოდროინდელი აქტივობა</h2>
            <button className="text-sm text-primary-500 hover:text-primary-600">ყველას ნახვა</button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  <p className="text-xs text-gray-400">{activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Comments */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">მომხმარებლის კომენტარები</h2>
            <button className="text-sm text-primary-500 hover:text-primary-600">ყველას ნახვა</button>
          </div>
          <div className="space-y-4">
            {userComments.map((comment, index) => (
              <div key={index} className="flex items-start space-x-3">
                <img 
                  src={comment.avatar} 
                  alt={comment.user}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">{comment.user}</p>
                    <span className="text-xs text-gray-500">{comment.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 