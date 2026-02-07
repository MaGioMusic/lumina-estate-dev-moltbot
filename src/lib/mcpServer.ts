import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  images: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  features: string[];
  status: 'available' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  rating: number;
  avatar: string;
  properties: string[];
  languages: string[];
}

class LuminaEstateMCPServer {
  private server: Server;
  private properties: Property[] = [];
  private agents: Agent[] = [];

  constructor() {
    this.server = new Server(
      {
        name: 'lumina-estate-server',
        version: '1.0.0',
        description: 'MCP Server for Lumina Estate real estate platform',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data
    this.properties = [
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
      }
    ];

    this.agents = [
      {
        id: '1',
        name: 'ნინო გელაშვილი',
        email: 'nino@lumina-estate.ge',
        phone: '+995 555 123 456',
        specialization: ['ბინები', 'კომერციული ქონება'],
        experience: 5,
        rating: 4.8,
        avatar: '/images/photos/contact-1.jpg',
        properties: ['1'],
        languages: ['ქართული', 'ინგლისური', 'რუსული']
      }
    ];
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_properties',
          description: 'Search for properties based on criteria',
          inputSchema: {
            type: 'object',
            properties: {
              location: { type: 'string', description: 'Location to search in' },
              minPrice: { type: 'number', description: 'Minimum price' },
              maxPrice: { type: 'number', description: 'Maximum price' },
              propertyType: { type: 'string', description: 'Type of property' },
              bedrooms: { type: 'number', description: 'Number of bedrooms' },
              bathrooms: { type: 'number', description: 'Number of bathrooms' },
              minArea: { type: 'number', description: 'Minimum area in sqm' },
              maxArea: { type: 'number', description: 'Maximum area in sqm' }
            }
          }
        },
        {
          name: 'get_property_details',
          description: 'Get detailed information about a specific property',
          inputSchema: {
            type: 'object',
            properties: {
              propertyId: { type: 'string', description: 'Property ID' }
            },
            required: ['propertyId']
          }
        },
        {
          name: 'get_agent_info',
          description: 'Get information about a real estate agent',
          inputSchema: {
            type: 'object',
            properties: {
              agentId: { type: 'string', description: 'Agent ID' }
            },
            required: ['agentId']
          }
        },
        {
          name: 'calculate_mortgage',
          description: 'Calculate mortgage payments',
          inputSchema: {
            type: 'object',
            properties: {
              price: { type: 'number', description: 'Property price' },
              downPayment: { type: 'number', description: 'Down payment amount' },
              interestRate: { type: 'number', description: 'Annual interest rate' },
              loanTerm: { type: 'number', description: 'Loan term in years' }
            },
            required: ['price', 'downPayment', 'interestRate', 'loanTerm']
          }
        },
        {
          name: 'get_market_insights',
          description: 'Get market insights for a specific area',
          inputSchema: {
            type: 'object',
            properties: {
              location: { type: 'string', description: 'Location for market insights' }
            },
            required: ['location']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_properties':
            return await this.searchProperties(args);
          case 'get_property_details':
            return await this.getPropertyDetails(args);
          case 'get_agent_info':
            return await this.getAgentInfo(args);
          case 'calculate_mortgage':
            return await this.calculateMortgage(args);
          case 'get_market_insights':
            return await this.getMarketInsights(args);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        throw new McpError(ErrorCode.InternalError, `Error executing tool: ${error}`);
      }
    });
  }

  private async searchProperties(args: Record<string, unknown>) {
    let filteredProperties = this.properties;

    if (args.location) {
      filteredProperties = filteredProperties.filter(p => 
        p.location.toLowerCase().includes(args.location.toLowerCase())
      );
    }

    if (args.minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= args.minPrice);
    }

    if (args.maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= args.maxPrice);
    }

    if (args.propertyType) {
      filteredProperties = filteredProperties.filter(p => p.type === args.propertyType);
    }

    if (args.bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= args.bedrooms);
    }

    if (args.bathrooms) {
      filteredProperties = filteredProperties.filter(p => p.bathrooms >= args.bathrooms);
    }

    if (args.minArea) {
      filteredProperties = filteredProperties.filter(p => p.area >= args.minArea);
    }

    if (args.maxArea) {
      filteredProperties = filteredProperties.filter(p => p.area <= args.maxArea);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            results: filteredProperties,
            count: filteredProperties.length,
            searchCriteria: args
          }, null, 2)
        }
      ]
    };
  }

  private async getPropertyDetails(args: Record<string, unknown>) {
    const property = this.properties.find(p => p.id === args.propertyId);
    
    if (!property) {
      throw new McpError(ErrorCode.InvalidParams, 'Property not found');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(property, null, 2)
        }
      ]
    };
  }

  private async getAgentInfo(args: Record<string, unknown>) {
    const agent = this.agents.find(a => a.id === args.agentId);
    
    if (!agent) {
      throw new McpError(ErrorCode.InvalidParams, 'Agent not found');
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(agent, null, 2)
        }
      ]
    };
  }

  private async calculateMortgage(args: Record<string, unknown>) {
    const { price, downPayment, interestRate, loanTerm } = args as {
      price: number;
      downPayment: number;
      interestRate: number;
      loanTerm: number;
    };
    
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            loanAmount,
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalPayment: Math.round(totalPayment * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100,
            downPaymentPercentage: Math.round((downPayment / price) * 100 * 100) / 100
          }, null, 2)
        }
      ]
    };
  }

  private async getMarketInsights(args: Record<string, unknown>) {
    // Mock market insights data
    const insights = {
      location: args.location as string,
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
        'ახალი განვითარება იგეგმება'
      ]
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(insights, null, 2)
        }
      ]
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    // Only log startup in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Lumina Estate MCP Server started successfully! 🏠');
    }
  }
}

// Export for use in other parts of the application
export { LuminaEstateMCPServer, type Property, type Agent };

// Start the server if this file is run directly (ESM-compatible check)
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  const server = new LuminaEstateMCPServer();
  server.start().catch((error: Error) => {
    console.error('Failed to start MCP server:', error.message);
    process.exit(1);
  });
} 