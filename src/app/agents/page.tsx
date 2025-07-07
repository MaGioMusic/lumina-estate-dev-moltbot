'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { FiSearch, FiDownload, FiFilter, FiPlus, FiEye, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiCalendar, FiChevronDown, FiTrendingUp, FiArrowUp, FiArrowDown, FiUsers, FiTarget, FiHome, FiMoreHorizontal, FiActivity, FiPieChart, FiMapPin } from 'react-icons/fi';
import AgentDashboard from './components/AgentDashboard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  type: 'Buyer' | 'Seller' | 'Buyer & Seller' | 'Lead' | 'Inactive';
  propertyInterest: string;
  lastContact: string;
  status: 'Viewing Scheduled' | 'Offer Made' | 'Negotiating' | 'New Lead' | 'Follow-up Required';
  isSelected: boolean;
}

export default function AgentsPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const activeTab = searchParams.get('tab') || 'dashboard';

  // Chart data
  const salesTrendData = [
    { month: 'Jan', sales: 1.8 },
    { month: 'Feb', sales: 2.1 },
    { month: 'Mar', sales: 2.3 },
    { month: 'Apr', sales: 2.0 },
    { month: 'May', sales: 2.4 },
    { month: 'Jun', sales: 2.7 },
    { month: 'Jul', sales: 2.5 },
    { month: 'Aug', sales: 2.8 },
    { month: 'Sep', sales: 2.6 },
    { month: 'Oct', sales: 2.9 },
    { month: 'Nov', sales: 2.7 },
    { month: 'Dec', sales: 3.0 },
  ];

  const clientActivityData = [
    { month: 'Jan', newLeads: 45, viewings: 32, offers: 18 },
    { month: 'Feb', newLeads: 52, viewings: 38, offers: 22 },
    { month: 'Mar', newLeads: 48, viewings: 42, offers: 25 },
    { month: 'Apr', newLeads: 55, viewings: 35, offers: 20 },
    { month: 'May', newLeads: 62, viewings: 48, offers: 28 },
    { month: 'Jun', newLeads: 58, viewings: 52, offers: 32 },
  ];

  const propertyTypeData = [
    { name: 'Apartments', value: 45, color: '#F08336' },
    { name: 'Houses', value: 30, color: '#FFB88C' },
    { name: 'Condos', value: 15, color: '#E67E22' },
    { name: 'Commercial', value: 10, color: '#D35400' },
  ];

  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+1 (555) 123-4567',
      avatar: '/images/photos/contact-1.jpg',
      type: 'Buyer',
      propertyInterest: 'Modern villa in Beverly Hills area. Budget around $3M.',
      lastContact: '2 hours ago',
      status: 'Viewing Scheduled',
      isSelected: false
    },
    {
      id: '2',
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '+1 (555) 987-6543',
      avatar: '/images/photos/contact-2.jpg',
      type: 'Buyer & Seller',
      propertyInterest: 'Interested in Coastal Paradise property. Made an offer of $3.8M.',
      lastContact: '1 day ago',
      status: 'Offer Made',
      isSelected: false
    },
    {
      id: '3',
      name: 'James Chen',
      email: 'james.chen@example.com',
      phone: '+1 (555) 456-7890',
      avatar: '/images/photos/contact-3.jpg',
      type: 'Seller',
      propertyInterest: 'Selling City Penthouse property. Currently in negotiations.',
      lastContact: '3 days ago',
      status: 'Negotiating',
      isSelected: false
    },
    {
      id: '4',
      name: 'Sophia Rodriguez',
      email: 'sophia.r@example.com',
      phone: '+1 (555) 789-0123',
      avatar: '/images/photos/contact-4.jpg',
      type: 'Lead',
      propertyInterest: 'New lead interested in luxury properties in the Malibu area.',
      lastContact: '1 week ago',
      status: 'New Lead',
      isSelected: false
    },
    {
      id: '5',
      name: 'David Kim',
      email: 'david.kim@example.com',
      phone: '+1 (555) 234-5678',
      avatar: '/images/photos/contact-1.jpg',
      type: 'Inactive',
      propertyInterest: 'Was interested in several properties but has been unresponsive.',
      lastContact: '1 month ago',
      status: 'Follow-up Required',
      isSelected: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Clients');
  const [currentPage, setCurrentPage] = useState(1);

  const toggleClientSelection = (clientId: string) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { ...client, isSelected: !client.isSelected }
        : client
    ));
  };

  const toggleSelectAll = () => {
    const allSelected = clients.every(client => client.isSelected);
    setClients(clients.map(client => ({ ...client, isSelected: !allSelected })));
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Buyer':
        return 'bg-blue-100 text-blue-800';
      case 'Seller':
        return 'bg-green-100 text-green-800';
      case 'Buyer & Seller':
        return 'bg-yellow-100 text-yellow-800';
      case 'Lead':
        return 'bg-cyan-100 text-cyan-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Viewing Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Offer Made':
        return 'bg-yellow-100 text-yellow-800';
      case 'Negotiating':
        return 'bg-purple-100 text-purple-800';
      case 'New Lead':
        return 'bg-gray-100 text-gray-800';
      case 'Follow-up Required':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeTab === 'dashboard') {
    return <AgentDashboard />;
  }

  if (activeTab === 'analytics') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header with Controls */}
        <div className="flex items-center justify-between p-6">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            Analytics Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-orange-500" />
              <span className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Last 12 Months</span>
              <FiChevronDown className="w-4 h-4 text-orange-500" />
            </div>
            <div className="flex items-center gap-2 cursor-pointer">
              <FiFilter className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500">Filter</span>
            </div>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors">
              <FiDownload className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 mb-6">
          <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Total Sales</h3>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mb-2`}>$24.5M</div>
            <div className="flex items-center gap-2">
              <FiArrowUp className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500 font-medium">+12.5%</span>
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>vs last year</span>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Active Clients</h3>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mb-2`}>1,248</div>
            <div className="flex items-center gap-2">
              <FiArrowUp className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500 font-medium">+8.2%</span>
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>vs last month</span>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Conversion Rate</h3>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <FiTarget className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mb-2`}>18.6%</div>
            <div className="flex items-center gap-2">
              <FiArrowUp className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500 font-medium">+2.4%</span>
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>vs last quarter</span>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Avg. Property Value</h3>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <FiHome className="w-5 h-5 text-orange-500" />
              </div>
            </div>
            <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mb-2`}>$1.8M</div>
            <div className="flex items-center gap-2">
              <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>vs last month</span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mb-6">
          {/* Sales Trend Chart */}
          <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Sales Trend</h3>
              <FiMoreHorizontal className="w-4 h-4 text-orange-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#53433F" />
                <YAxis stroke="#53433F" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#F08336" 
                  strokeWidth={3}
                  dot={{ fill: '#F08336', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Client Activity Chart */}
          <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Client Activity</h3>
              <FiMoreHorizontal className="w-4 h-4 text-orange-500" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={clientActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#53433F" />
                <YAxis stroke="#53433F" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#1F2937' : 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="newLeads" fill="#F08336" radius={[4, 4, 0, 0]} />
                <Bar dataKey="viewings" fill="#FFDBD1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offers" fill="#77574E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-orange-500">New Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-200 rounded-full"></div>
                <span className="text-orange-200">Property Viewings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span className="text-gray-600">Offers Made</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 mb-6">
          {/* Property Type Distribution */}
          <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mb-6`}>Property Type Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {propertyTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Property Location */}
          <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mb-6`}>Property Location</h3>
            <div className="h-[250px] flex items-center justify-center bg-gradient-to-br from-orange-500/10 to-orange-200/20 rounded-lg">
              <div className="text-center">
                <FiMapPin className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Location map visualization</p>
              </div>
            </div>
          </div>

          {/* Top Performing Agents */}
          <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} mb-6`}>Top Performing Agents</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/photos/sarah-wilson.jpg"
                    alt="Sarah Wilson"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Sarah Wilson</span>
                </div>
                <span className="text-orange-500 font-medium">$4.2M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/photos/agent-2.jpg"
                    alt="Michael Brown"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Michael Brown</span>
                </div>
                <span className="text-orange-500 font-medium">$3.8M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/photos/agent-3.jpg"
                    alt="Emma Johnson"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Emma Johnson</span>
                </div>
                <span className="text-orange-500 font-medium">$3.5M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/photos/agent-4.jpg"
                    alt="James Chen"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>James Chen</span>
                </div>
                <span className="text-orange-500 font-medium">$3.1M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'settings') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
        <div className="p-6">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-dark-text' : 'text-gray-900'}`}>
            Agent Settings
          </h1>
          <p className={`mt-4 ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
            Settings content coming soon...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-bg' : 'bg-gray-50'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-dark-text' : 'text-gray-900'}`}>
            Clients Management
          </h1>
          <div className="flex items-center gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FiPlus className="w-4 h-4" />
              Add New Client
            </button>
            <button className={`${theme === 'dark' ? 'bg-dark-bg-secondary text-dark-text border-dark-border' : 'bg-gray-100 text-gray-700 border-gray-300'} border px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors`}>
              <FiDownload className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className={`flex-1 relative ${theme === 'dark' ? 'bg-dark-bg-secondary border-dark-border' : 'bg-white border-gray-300'} border rounded-lg`}>
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-dark-bg-secondary text-dark-text placeholder-dark-text-secondary' : 'bg-white text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>
          <button className={`${theme === 'dark' ? 'bg-dark-bg-secondary text-dark-text border-dark-border' : 'bg-gray-100 text-gray-700 border-gray-300'} border px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors`}>
            <FiFilter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {['All Clients', 'Active', 'Leads', 'Buyers', 'Sellers', 'Recent Activity'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white'
                  : theme === 'dark'
                  ? 'bg-dark-bg-secondary text-dark-text border border-dark-border hover:bg-dark-bg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className={`${theme === 'dark' ? 'bg-dark-bg-secondary' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}>
          <div className={`${theme === 'dark' ? 'bg-dark-bg border-dark-border' : 'bg-gray-50 border-gray-200'} border-b px-6 py-4`}>
            <div className="flex items-center gap-6">
              <input
                type="checkbox"
                checked={clients.every(client => client.isSelected)}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <div className="flex-1 grid grid-cols-6 gap-6">
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`}>Client</div>
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`}>Type</div>
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`}>Property Interest</div>
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`}>Last Contact</div>
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'}`}>Status</div>
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-700'} text-center`}>Actions</div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {clients.map((client) => (
              <div key={client.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-6">
                  <input
                    type="checkbox"
                    checked={client.isSelected}
                    onChange={() => toggleClientSelection(client.id)}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1 grid grid-cols-6 gap-6 items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className={`font-medium ${theme === 'dark' ? 'text-dark-text' : 'text-gray-900'}`}>
                          {client.name}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                          {client.email}
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                          {client.phone}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeStyle(client.type)}`}>
                        {client.type}
                      </span>
                    </div>

                    <div className={`text-sm ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-600'} line-clamp-2`}>
                      {client.propertyInterest}
                    </div>

                    <div className={`text-sm ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                      {client.lastContact}
                    </div>

                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(client.status)}`}>
                        {client.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 text-orange-500 hover:bg-orange-50 rounded transition-colors">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-orange-500 hover:bg-orange-50 rounded transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-orange-500 hover:bg-orange-50 rounded transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className={`text-sm ${theme === 'dark' ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
            Showing 1-5 of 1,024 clients
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2 ${theme === 'dark' ? 'border-dark-border hover:bg-dark-bg' : 'border-gray-300 hover:bg-gray-50'} border rounded-md transition-colors`}>
              <FiChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  currentPage === page
                    ? 'bg-orange-500 text-white'
                    : theme === 'dark'
                    ? 'border-dark-border text-dark-text hover:bg-dark-bg'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } border`}
              >
                {page}
              </button>
            ))}
            <button className={`p-2 ${theme === 'dark' ? 'border-dark-border hover:bg-dark-bg' : 'border-gray-300 hover:bg-gray-50'} border rounded-md transition-colors`}>
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 