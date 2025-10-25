import { NextRequest, NextResponse } from 'next/server';
import { logger, sanitizeForLogging } from '@/lib/logger';
import { getMockPropertyById } from '@/lib/mockProperties';
import { getPropertyImages } from '@/lib/samplePropertyImages';

// Note: MCP server instance temporarily unused in mock API

export async function POST(request: NextRequest) {
  try {
    const { tool, params } = await request.json();
    
    // Handle different MCP tools
    switch (tool) {
      case 'search_properties':
        return await handleSearchProperties(params);
      case 'get_property_details':
        return await handleGetPropertyDetails(params);
      case 'get_agent_info':
        return await handleGetAgentInfo(params);
      case 'calculate_mortgage':
        return await handleCalculateMortgage(params);
      case 'get_market_insights':
        return await handleGetMarketInsights(params);
      default:
        return NextResponse.json(
          { error: 'Unknown tool' },
          { status: 400 }
        );
    }
  } catch (error) {
    logger.error('MCP API Error:', sanitizeForLogging(error));
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleSearchProperties(params: any) {
  try {
    // Mock implementation - in real app, this would call actual MCP server
    const mockResults = [
      {
        id: '1',
        title: 'ლუქსუს ბინა ვაკეში',
        price: 250000,
        location: 'ვაკე, თბილისი',
        type: 'apartment',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        description: 'ულამაზესი ბინა ვაკეში, ყველა კომფორტით',
        images: ['/images/properties/property-1.jpg'],
        coordinates: { lat: 41.7151, lng: 44.7661 },
        agent: {
          name: 'ნინო გელაშვილი',
          phone: '+995 555 123 456',
          email: 'nino@lumina-estate.ge'
        },
        features: ['ბალკონი', 'პარკინგი', 'ცენტრალური გათბობა'],
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'კომფორტული ბინა საბურთალოში',
        price: 180000,
        location: 'საბურთალო, თბილისი',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        description: 'მშვენიერი ბინა საბურთალოში',
        images: ['/images/properties/property-2.jpg'],
        coordinates: { lat: 41.7258, lng: 44.7514 },
        agent: {
          name: 'გიორგი ბერიძე',
          phone: '+995 555 789 012',
          email: 'giorgi@lumina-estate.ge'
        },
        features: ['ბალკონი', 'ლიფტი'],
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Filter results based on params
    let filteredResults = mockResults;
    
    if (params.location) {
      filteredResults = filteredResults.filter(p => 
        p.location.toLowerCase().includes(params.location.toLowerCase())
      );
    }
    
    if (params.minPrice) {
      filteredResults = filteredResults.filter(p => p.price >= params.minPrice);
    }
    
    if (params.maxPrice) {
      filteredResults = filteredResults.filter(p => p.price <= params.maxPrice);
    }
    
    if (params.propertyType) {
      filteredResults = filteredResults.filter(p => p.type === params.propertyType);
    }

    return NextResponse.json({
      results: filteredResults,
      count: filteredResults.length,
      searchCriteria: params
    });
  } catch (error) {
    logger.error('Search properties error:', sanitizeForLogging(error));
    return NextResponse.json(
      { error: 'Failed to search properties' },
      { status: 500 }
    );
  }
}

async function handleGetPropertyDetails(params: any) {
  try {
    const idStr = String(params.propertyId || '').trim();
    const idNum = parseInt(idStr, 10);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json({ error: 'Invalid propertyId' }, { status: 400 });
    }

    const p = getMockPropertyById(idNum);
    if (!p) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const images = getPropertyImages(String(p.id));
    // Basic district translation (fallback English)
    const districtMap: Record<string, string> = {
      vake: 'Vake',
      mtatsminda: 'Mtatsminda',
      saburtalo: 'Saburtalo',
      isani: 'Isani',
      gldani: 'Gldani',
    };
    const district = districtMap[p.address] || p.address;

    const resp = {
      id: String(p.id),
      title: `${p.type.charAt(0).toUpperCase()}${p.type.slice(1)} in ${district}`,
      price: p.price,
      location: `${district}, Tbilisi`,
      type: p.type,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area: p.sqft,
      description: '—',
      images,
      // Simple mock coordinates per district
      coordinates: { lat: 41.7151 + (p.id % 10) * 0.001, lng: 44.7661 + (p.id % 10) * 0.001 },
      agent: { name: 'Lumina Agent', phone: '+995 555 123 456', email: 'agent@lumina-estate.ge' },
      features: p.amenities || [],
      status: p.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(resp);
  } catch (error) {
    logger.error('Get property details error:', sanitizeForLogging(error));
    return NextResponse.json(
      { error: 'Failed to get property details' },
      { status: 500 }
    );
  }
}

async function handleGetAgentInfo(params: any) {
  try {
    // Mock agent info
    const mockAgent = {
      id: params.agentId,
      name: 'ნინო გელაშვილი',
      email: 'nino@lumina-estate.ge',
      phone: '+995 555 123 456',
      specialization: ['ბინები', 'კომერციული ქონება'],
      experience: 5,
      rating: 4.8,
      avatar: '/images/photos/contact-1.jpg',
      properties: ['1', '2', '3'],
      languages: ['ქართული', 'ინგლისური', 'რუსული'],
      description: 'გამოცდილი უძრავი ქონების აგენტი 5 წლიანი გამოცდილებით. სპეციალიზაცია: ბინები და კომერციული ქონება.'
    };

    return NextResponse.json(mockAgent);
  } catch (error) {
    logger.error('Get agent info error:', sanitizeForLogging(error));
    return NextResponse.json(
      { error: 'Failed to get agent info' },
      { status: 500 }
    );
  }
}

async function handleCalculateMortgage(params: any) {
  try {
    const { price, downPayment, interestRate, loanTerm } = params;
    
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    const result = {
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      downPaymentPercentage: Math.round((downPayment / price) * 100 * 100) / 100
    };

    return NextResponse.json(result);
  } catch (error) {
    logger.error('Calculate mortgage error:', sanitizeForLogging(error));
    return NextResponse.json(
      { error: 'Failed to calculate mortgage' },
      { status: 500 }
    );
  }
}

async function handleGetMarketInsights(params: any) {
  try {
    // Mock market insights
    const mockInsights = {
      location: params.location,
      averagePrice: 180000,
      priceChange: '+12.5%',
      averageDaysOnMarket: 45,
      totalListings: 156,
      soldLastMonth: 23,
      pricePerSqm: 1500,
      popularPropertyTypes: ['apartment', 'house', 'commercial'],
      recommendations: [
        'ბაზარი ზრდადია ამ უბანში',
        'კარგი დროა ინვესტიციისთვის',
        'ახალი განვითარება იგეგმება',
        'ფასები სტაბილურია'
      ]
    };

    return NextResponse.json(mockInsights);
  } catch (error) {
    logger.error('Get market insights error:', sanitizeForLogging(error));
    return NextResponse.json(
      { error: 'Failed to get market insights' },
      { status: 500 }
    );
  }
} 