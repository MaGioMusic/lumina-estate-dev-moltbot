'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  status: 'active' | 'pending' | 'sold' | 'rented';
  createdAt: string;
  agent: string;
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    // Simulate API call
    const fetchProperties = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockProperties: Property[] = [
        {
          id: 1,
          title: 'ლუქს ბინა ვაკეში',
          price: '250,000₾',
          location: 'ვაკე, თბილისი',
          type: 'ბინა',
          bedrooms: 3,
          bathrooms: 2,
          area: 120,
          image: '/images/properties/property-1.jpg',
          status: 'active',
          createdAt: '2024-01-15',
          agent: 'ნინო გელაშვილი'
        },
        {
          id: 2,
          title: 'კომფორტული სახლი მთაწმინდაზე',
          price: '450,000₾',
          location: 'მთაწმინდა, თბილისი',
          type: 'სახლი',
          bedrooms: 4,
          bathrooms: 3,
          area: 200,
          image: '/images/properties/property-2.jpg',
          status: 'pending',
          createdAt: '2024-01-12',
          agent: 'გიორგი ბერიძე'
        },
        {
          id: 3,
          title: 'ოფისი ვერაში',
          price: '180,000₾',
          location: 'ვერა, თბილისი',
          type: 'ოფისი',
          bedrooms: 0,
          bathrooms: 1,
          area: 80,
          image: '/images/properties/property-3.jpg',
          status: 'sold',
          createdAt: '2024-01-10',
          agent: 'ანა ჯავახიშვილი'
        },
        {
          id: 4,
          title: 'სტუდია საბურთალოში',
          price: '95,000₾',
          location: 'საბურთალო, თბილისი',
          type: 'სტუდია',
          bedrooms: 1,
          bathrooms: 1,
          area: 45,
          image: '/images/properties/property-4.jpg',
          status: 'rented',
          createdAt: '2024-01-08',
          agent: 'დავით მესხი'
        },
        {
          id: 5,
          title: 'პენტჰაუსი ძველ ქალაქში',
          price: '650,000₾',
          location: 'ძველი ქალაქი, თბილისი',
          type: 'პენტჰაუსი',
          bedrooms: 5,
          bathrooms: 4,
          area: 300,
          image: '/images/properties/property-5.jpg',
          status: 'active',
          createdAt: '2024-01-05',
          agent: 'ლევან კვარაცხელია'
        }
      ];
      
      setProperties(mockProperties);
      setIsLoading(false);
    };

    fetchProperties();
  }, []);

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.agent.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'rented': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'აქტიური';
      case 'pending': return 'მიმდინარე';
      case 'sold': return 'გაყიდული';
      case 'rented': return 'დაქირავებული';
      default: return status;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(paginatedProperties.map(p => p.id));
    } else {
      setSelectedProperties([]);
    }
  };

  const handleSelectProperty = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProperties([...selectedProperties, id]);
    } else {
      setSelectedProperties(selectedProperties.filter(pId => pId !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="p-6 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">უძრავი ქონების მართვა</h1>
          <p className="text-gray-600 mt-1">სულ {properties.length} ობიექტი</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#D4AF37] hover:bg-[#B8860B] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          ახალი ობიექტი
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">ძებნა</label>
            <div className="relative">
              <input
                type="text"
                placeholder="ძებნა სახელით, ადგილმდებარეობით..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">სტატუსი</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="all">ყველა</option>
              <option value="active">აქტიური</option>
              <option value="pending">მიმდინარე</option>
              <option value="sold">გაყიდული</option>
              <option value="rented">დაქირავებული</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ტიპი</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
            >
              <option value="all">ყველა</option>
              <option value="ბინა">ბინა</option>
              <option value="სახლი">სახლი</option>
              <option value="ოფისი">ოფისი</option>
              <option value="სტუდია">სტუდია</option>
              <option value="პენტჰაუსი">პენტჰაუსი</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                {selectedProperties.length > 0 ? `${selectedProperties.length} არჩეული` : 'ყველას არჩევა'}
              </span>
            </div>
            {selectedProperties.length > 0 && (
              <div className="flex items-center space-x-2">
                <button className="text-sm text-red-600 hover:text-red-800">წაშლა</button>
                <button className="text-sm text-blue-600 hover:text-blue-800">რედაქტირება</button>
              </div>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ობიექტი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ფასი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ტიპი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  სტატუსი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  აგენტი
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  თარიღი
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  მოქმედებები
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProperties.includes(property.id)}
                        onChange={(e) => handleSelectProperty(property.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37] mr-4"
                      />
                      <div className="flex-shrink-0 h-12 w-12">
                        <Image
                          src={property.image}
                          alt={property.title}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-500">{property.location}</div>
                        <div className="text-xs text-gray-400">
                          {property.bedrooms > 0 && `${property.bedrooms} ოთახი • `}
                          {property.bathrooms} ბანი • {property.area}მ²
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{property.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{property.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                      {getStatusText(property.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {property.agent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString('ka-GE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-[#D4AF37] hover:text-[#B8860B]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                ნაჩვენებია {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProperties.length)} {filteredProperties.length}-დან
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  წინა
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded-md text-sm font-medium ${
                      currentPage === page
                        ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  შემდეგი
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 