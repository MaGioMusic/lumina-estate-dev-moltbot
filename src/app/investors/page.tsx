'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PageSnapshotEmitter, { emitPageSnapshotNow } from '@/app/components/PageSnapshotEmitter';
import { 
  FiTrendingUp, 
  FiBarChart2, 
  FiPieChart, 
  FiDollarSign,
  FiMapPin,
  FiArrowRight,
  FiMessageCircle,
  FiActivity,
  FiChevronDown
} from 'react-icons/fi';

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  roi: string;
  monthlyRent: string;
  occupancy: string;
  image: string;
}

const InvestorsPage = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [propertyType, setPropertyType] = useState('Residential');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');

  // KPI metrics (kept simple; numbers are placeholders)
  const kpis = [
    { label: 'Avg. ROI', value: '9.2%' },
    { label: 'Avg. IRR', value: '12.4%' },
    { label: 'Cash Flow', value: '+$1.8k/mo' },
    { label: 'Occupancy', value: '95%' }
  ];

  // Investment tiers
  const tiers = [
    {
      name: 'Seed',
      price: 'From $25k',
      features: ['Shared portfolio access', 'Quarterly reports', 'Standard support'],
      cta: 'Get Started'
    },
    {
      name: 'Growth',
      price: 'From $100k',
      highlight: true,
      features: ['Dedicated advisor', 'Monthly performance calls', 'Priority deals'],
      cta: 'Request Access'
    },
    {
      name: 'Strategic',
      price: 'Custom',
      features: ['Bespoke strategy', 'Direct sourcing', 'White-glove service'],
      cta: 'Talk to Us'
    }
  ];

  const properties: Property[] = [
    {
      id: 1,
      title: 'Luxury Apartment Complex',
      location: t('downtownFinancialDistrict'),
      price: '$2,450,000',
      roi: '8.5%',
      monthlyRent: '$12,500',
      occupancy: '95%',
      image: '/images/properties/property-12.jpg'
    },
    {
      id: 2,
      title: 'Modern Office Building',
      location: t('techHubArea'),
      price: '$3,750,000',
      roi: '9.2%',
      monthlyRent: '$18,000',
      occupancy: '95%',
      image: '/images/properties/property-13.jpg'
    },
    {
      id: 3,
      title: 'Retail Plaza',
      location: t('shoppingDistrict'),
      price: '$1,950,000',
      roi: '7.8%',
      monthlyRent: '$9,500',
      occupancy: '95%',
      image: '/images/properties/property-14.jpg'
    }
  ];

  const aiQuestions = [
    'What is the typical ROI in the downtown area?',
    'What are the main investment risks?',
    'When is the best time to sell?'
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <PageSnapshotEmitter
        page="investors"
        title="Investors — Lumina Estate"
        summary="ინვესტორთათვის განყოფილების მოკლე აღწერა."
        data={{ tiers: ['Seed', 'Series A', 'Strategic'] }}
        auto
      />
      {/* Hero Section */}
      <div 
        className="relative h-[440px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.88), rgba(30, 58, 138, 0.88)), url('/images/photos/hero-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Unlock Smart Real Estate Investments
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed">
              Make informed decisions with data-driven insights and expert analysis for maximum returns on your real estate investments.
            </p>
            <button className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2 transition-colors">
              See Investment Opportunities
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpi.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Analytics & Insights */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Market Analytics & Insights
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Neighborhood Price Growth */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiTrendingUp className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Neighborhood Price Growth</h3>
              </div>
              <div className="relative h-40 bg-gray-50 dark:bg-gray-600 rounded-lg flex items-end justify-center p-4">
                <div className="flex items-end gap-2 h-full">
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '60%'}}></div>
                  <div className="bg-yellow-400 w-8 rounded-t" style={{height: '40%'}}></div>
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '80%'}}></div>
                  <div className="bg-yellow-400 w-8 rounded-t" style={{height: '65%'}}></div>
                  <div className="bg-blue-500 w-8 rounded-t" style={{height: '30%'}}></div>
                </div>
                <div className="absolute left-2 top-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="mb-2">220</div>
                  <div className="mb-2">165</div>
                  <div className="mb-2">110</div>
                  <div>55</div>
                </div>
              </div>
            </div>

            {/* Investment Potential */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                                 <FiBarChart2 className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Investment Potential</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">District 1</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">High</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">12% ROI</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">District 2</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">Medium</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">10% ROI</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">District 3</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">Moderate</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">8% ROI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Area Comparison */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiPieChart className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Area Comparison</h3>
              </div>
              <div className="relative h-40 bg-gray-50 dark:bg-gray-600 rounded-lg flex items-end justify-center p-4">
                <div className="flex items-end gap-1 h-full">
                  <div className="bg-blue-500 w-6 rounded-t" style={{height: '70%'}}></div>
                  <div className="bg-primary-400 w-6 rounded-t" style={{height: '50%'}}></div>
                  <div className="bg-blue-500 w-6 rounded-t" style={{height: '90%'}}></div>
                  <div className="bg-primary-400 w-6 rounded-t" style={{height: '65%'}}></div>
                  <div className="bg-blue-500 w-6 rounded-t" style={{height: '40%'}}></div>
                  <div className="bg-primary-400 w-6 rounded-t" style={{height: '25%'}}></div>
                </div>
                <div className="absolute left-2 top-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="mb-3">12</div>
                  <div className="mb-3">9</div>
                  <div className="mb-3">6</div>
                  <div className="mb-3">3</div>
                  <div>0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Tiers */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Investment Tiers
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border shadow-sm overflow-hidden ${tier.highlight ? 'border-[#D4AF37]' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800`}
              >
                <div className={`p-6 ${tier.highlight ? 'bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white' : ''}`}>
                  <div className="flex items-baseline justify-between">
                    <h3 className={`text-xl font-semibold ${tier.highlight ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>{tier.name}</h3>
                    <span className={`text-sm font-medium ${tier.highlight ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>{tier.price}</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <ul className="space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="text-sm text-gray-700 dark:text-gray-300">• {f}</li>
                    ))}
                  </ul>
                  <button className={`mt-4 w-full py-2.5 rounded-lg font-medium transition-colors ${tier.highlight ? 'bg-[#D4AF37] hover:bg-[#B8860B] text-white' : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 text-white'}`}>
                    {tier.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Investment Properties */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Premium Investment Properties
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white dark:bg-gray-700 rounded-xl shadow-sm overflow-hidden">
                <div 
                  className="h-48 bg-gray-200"
                  style={{
                    backgroundImage: `url('${property.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{property.title}</h3>
                  <div className="flex items-center gap-1 mb-4 text-gray-600 dark:text-gray-400">
                    <FiMapPin className="w-4 h-4" />
                    <span>{property.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{property.price}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expected ROI</div>
                      <div className="text-lg font-semibold text-green-600">{property.roi}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Monthly Rent</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{property.monthlyRent}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Occupancy</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{property.occupancy}</div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-primary-400 hover:bg-primary-500 text-white font-medium py-3 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evaluate Your Investment */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">
            Evaluate Your Investment
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Investment Calculator */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-8">
              <div className="flex items-center gap-2 mb-6">
                                 <FiActivity className="w-5 h-5 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Investment Calculator</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Type</label>
                  <div className="relative">
                    <select 
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option>Residential</option>
                      <option>Commercial</option>
                      <option>Mixed Use</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Purchase Price</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Monthly Rent</label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <button className="w-full bg-primary-400 hover:bg-primary-500 text-white font-medium py-3 rounded-lg transition-colors">
                  Calculate ROI
                </button>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Investment Summary</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Annual Return</div>
                  <div className="text-3xl font-bold text-primary-500">$48,000</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">ROI</div>
                    <div className="text-xl font-semibold text-green-600">8.5%</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Break-even</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">4.2 Years</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Investment Grade</div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">A+</span>
                    <span className="text-gray-600 dark:text-gray-400">Excellent Investment Opportunity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials / Trust */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12">Trusted by Investors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-gray-700 dark:text-gray-300">“Lumina helped us diversify into high-performing districts with clear, data-backed decisions.”</p>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">Investor #{i}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-10">FAQ</h2>
          <div className="space-y-4">
            {[
              {q: 'How do returns get distributed?', a: 'Returns are distributed quarterly with full statements.'},
              {q: 'Can I exit early?', a: 'Certain tiers include early liquidity options subject to terms.'},
              {q: 'Is there a minimum ticket?', a: 'The Seed tier starts from $25k; Strategic is customized.'}
            ].map((item) => (
              <details key={item.q} className="rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4">
                <summary className="cursor-pointer text-gray-900 dark:text-gray-100 font-medium">{item.q}</summary>
                <div className="mt-2 text-gray-600 dark:text-gray-300">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Have Questions? Ask Our AI Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-12">
            Get instant answers about investment opportunities, ROI calculations, and market trends
          </p>
          
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm overflow-hidden max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-600">
              <div className="space-y-4">
                {aiQuestions.map((question, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-left text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                    {question}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6">
              <button className="bg-primary-400 hover:bg-primary-500 text-white font-medium px-8 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors">
                Start Chat
                <FiMessageCircle className="w-5 h-5" />
              </button>
              <div className="mt-4">
                <button
                  onClick={() => emitPageSnapshotNow({
                    page: 'investors',
                    title: 'Investors — Lumina Estate',
                    summary: 'ინვესტორთა სექციების მიმდინარე შეჯამება'
                  })}
                  className="text-sm h-8 px-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  ამ გვერდის აღწერა
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] py-14">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-2">Ready to invest with confidence?</h3>
              <p className="text-white/90">Join our investor program and access data-driven opportunities.</p>
            </div>
            <button className="bg-[#D4AF37] hover:bg-[#B8860B] text-white font-semibold px-6 py-3 rounded-lg transition-colors">Request Access</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorsPage;