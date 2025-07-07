import { Property, Agent } from './mcpServer';

interface MCPSearchParams {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
}

interface MCPMortgageParams {
  price: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
}

interface MCPMarketInsights {
  location: string;
  averagePrice: number;
  priceChange: string;
  averageDaysOnMarket: number;
  totalListings: number;
  soldLastMonth: number;
  pricePerSqm: number;
  popularPropertyTypes: string[];
  recommendations: string[];
}

interface MCPMortgageResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  downPaymentPercentage: number;
}

class MCPClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/mcp') {
    this.baseUrl = baseUrl;
  }

  async searchProperties(params: MCPSearchParams): Promise<Property[]> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'search_properties',
          params
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  async getPropertyDetails(propertyId: string): Promise<Property | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'get_property_details',
          params: { propertyId }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error('Error getting property details:', error);
      throw error;
    }
  }

  async getAgentInfo(agentId: string): Promise<Agent | null> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'get_agent_info',
          params: { agentId }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error('Error getting agent info:', error);
      throw error;
    }
  }

  async calculateMortgage(params: MCPMortgageParams): Promise<MCPMortgageResult> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'calculate_mortgage',
          params
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calculating mortgage:', error);
      throw error;
    }
  }

  async getMarketInsights(location: string): Promise<MCPMarketInsights> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'get_market_insights',
          params: { location }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting market insights:', error);
      throw error;
    }
  }

  // Helper method for AI chat to process natural language queries
  async processAIChatQuery(query: string): Promise<string> {
    try {
      // Simple natural language processing for demo
      const lowerQuery = query.toLowerCase();
      
      // Property search queries
      if (lowerQuery.includes('ვაკე') || lowerQuery.includes('vake')) {
        const properties = await this.searchProperties({ location: 'ვაკე' });
        return this.formatPropertiesResponse(properties);
      }
      
      if (lowerQuery.includes('ბინა') || lowerQuery.includes('apartment')) {
        const properties = await this.searchProperties({ propertyType: 'apartment' });
        return this.formatPropertiesResponse(properties);
      }
      
      // Mortgage calculation queries
      if (lowerQuery.includes('იპოთეკა') || lowerQuery.includes('mortgage')) {
        const result = await this.calculateMortgage({
          price: 200000,
          downPayment: 40000,
          interestRate: 8.5,
          loanTerm: 20
        });
        return this.formatMortgageResponse(result);
      }
      
      // Market insights queries
      if (lowerQuery.includes('ბაზარი') || lowerQuery.includes('market')) {
        const insights = await this.getMarketInsights('თბილისი');
        return this.formatMarketInsightsResponse(insights);
      }
      
      return 'ვერ გავიგე თქვენი კითხვა. გთხოვთ კონკრეტულად მითხრათ რა გინდათ: ქონების ძებნა, იპოთეკის გაანგარიშება, თუ ბაზრის ინფორმაცია?';
    } catch (error) {
      console.error('Error processing AI chat query:', error);
      return 'ვიღაცა შეცდომა მოხდა. გთხოვთ სცადოთ მოგვიანებით.';
    }
  }

  private formatPropertiesResponse(properties: Property[]): string {
    if (properties.length === 0) {
      return 'ამ კრიტერიუმებით ქონება ვერ მოიძებნა.';
    }
    
    let response = `მოიძებნა ${properties.length} ქონება:\n\n`;
    
    properties.forEach((property, index) => {
      response += `${index + 1}. ${property.title}\n`;
      response += `   💰 ფასი: ${property.price.toLocaleString()} ლარი\n`;
      response += `   📍 მდებარეობა: ${property.location}\n`;
      response += `   🏠 ტიპი: ${property.type}\n`;
      response += `   🛏️ საძინებელი: ${property.bedrooms}\n`;
      response += `   🚿 საბანიო: ${property.bathrooms}\n`;
      response += `   📐 ფართობი: ${property.area} კვ.მ\n`;
      response += `   👤 აგენტი: ${property.agent.name} (${property.agent.phone})\n\n`;
    });
    
    return response;
  }

  private formatMortgageResponse(result: MCPMortgageResult): string {
    return `💰 იპოთეკის გაანგარიშება:
    
🏦 სესხის ოდენობა: ${result.loanAmount.toLocaleString()} ლარი
📅 ყოველთვიური გადახდა: ${result.monthlyPayment.toLocaleString()} ლარი
💸 სრული გადახდა: ${result.totalPayment.toLocaleString()} ლარი
📈 პროცენტი სულ: ${result.totalInterest.toLocaleString()} ლარი
🏠 თავდაბარება: ${result.downPaymentPercentage}%`;
  }

  private formatMarketInsightsResponse(insights: MCPMarketInsights): string {
    return `📊 ბაზრის ანალიზი - ${insights.location}:
    
💰 საშუალო ფასი: ${insights.averagePrice.toLocaleString()} ლარი
📈 ფასის ცვლილება: ${insights.priceChange}
⏱️ საშუალო დღეები ბაზარზე: ${insights.averageDaysOnMarket}
🏠 სულ განცხადებები: ${insights.totalListings}
✅ გაყიდულია ბოლო თვეში: ${insights.soldLastMonth}
📐 ფასი კვ.მ-ზე: ${insights.pricePerSqm} ლარი

🎯 რეკომენდაციები:
${insights.recommendations.map(rec => `• ${rec}`).join('\n')}`;
  }
}

export { MCPClient, type MCPSearchParams, type MCPMortgageParams, type MCPMarketInsights, type MCPMortgageResult }; 