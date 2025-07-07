# Lumina Estate MCP Server 🏠

## მიმოხილვა

Lumina Estate MCP (Model Context Protocol) სერვერი არის AI-ზე დაფუძნებული სერვისი, რომელიც გამოიყენება უძრავი ქონების პლატფორმისთვის. ის უზრუნველყოფს ინტელექტუალურ ფუნქციებს ქონების ძებნისთვის, იპოთეკის გაანგარიშებისთვის და ბაზრის ანალიზისთვის.

## ფუნქციები

### 🔍 ქონების ძებნა (`search_properties`)
- მდებარეობის მიხედვით ფილტრაცია
- ფასის დიაპაზონის მიხედვით ძებნა
- ქონების ტიპის მიხედვით ფილტრაცია
- საძინებლების და საბანიოების რაოდენობის მიხედვით ძებნა
- ფართობის მიხედვით ძებნა

### 🏠 ქონების დეტალები (`get_property_details`)
- სრული ინფორმაცია ქონების შესახებ
- აგენტის კონტაქტი
- ფოტოების გალერეა
- ქონების მახასიათებლები

### 👤 აგენტის ინფორმაცია (`get_agent_info`)
- აგენტის პროფილი
- სპეციალიზაცია
- გამოცდილება და რეიტინგი
- ენების ცოდნა

### 💰 იპოთეკის კალკულატორი (`calculate_mortgage`)
- ყოველთვიური გადახდის გაანგარიშება
- სრული გადახდის თანხა
- პროცენტის ოდენობა
- თავდაბარების პროცენტი

### 📊 ბაზრის ანალიზი (`get_market_insights`)
- საშუალო ფასები
- ბაზრის ტენდენციები
- რეკომენდაციები
- სტატისტიკური მონაცემები

## გამოყენება

### 1. სერვერის დაწყება

```bash
# Development მოდში
npm run dev

# MCP სერვერის ცალკე გაშვება
npm run mcp-server
```

### 2. AI ჩატის გამოყენება

AI ჩატში შეგიძლიათ დაწეროთ:

```
🔍 ქონების ძებნა:
- "ვაკეში ბინა მინდა"
- "200,000 ლარამდე ბინა"
- "3 საძინებლიანი ბინა"

💰 იპოთეკის გაანგარიშება:
- "იპოთეკის გაანგარიშება"
- "mortgage calculation"

📊 ბაზრის ინფორმაცია:
- "ბაზრის ინფორმაცია"
- "market insights"
```

### 3. API გამოყენება

```typescript
import { MCPClient } from '@/lib/mcpClient';

const client = new MCPClient();

// ქონების ძებნა
const properties = await client.searchProperties({
  location: 'ვაკე',
  minPrice: 100000,
  maxPrice: 300000
});

// იპოთეკის გაანგარიშება
const mortgage = await client.calculateMortgage({
  price: 200000,
  downPayment: 40000,
  interestRate: 8.5,
  loanTerm: 20
});
```

## API Endpoints

### POST `/api/mcp`

მთავარი API endpoint MCP ხელსაწყოებისთვის.

**Request Body:**
```json
{
  "tool": "search_properties",
  "params": {
    "location": "ვაკე",
    "minPrice": 100000,
    "maxPrice": 300000
  }
}
```

**Response:**
```json
{
  "results": [...],
  "count": 5,
  "searchCriteria": {...}
}
```

## ტექნიკური დეტალები

### არქიტექტურა

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Chat UI    │────│   MCP Client    │────│   MCP Server    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                              ┌─────────────────┐
                                              │   API Routes    │
                                              └─────────────────┘
```

### ფაილების სტრუქტურა

```
src/
├── lib/
│   ├── mcpServer.ts      # MCP სერვერის იმპლემენტაცია
│   └── mcpClient.ts      # MCP კლიენტი
├── app/
│   ├── api/mcp/
│   │   └── route.ts      # API routes
│   └── properties/components/
│       └── AIChatComponent.tsx  # AI ჩატის კომპონენტი
```

### ტიპები

```typescript
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  // ... სხვა ველები
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  // ... სხვა ველები
}
```

## უსაფრთხოება

- ✅ Input validation Zod-ით
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ Error handling
- ✅ Type safety

## განვითარება

### ახალი ტულის დამატება

1. `mcpServer.ts`-ში დაამატეთ ახალი ტული `setupToolHandlers` მეთოდში
2. `mcpClient.ts`-ში დაამატეთ კლიენტის მეთოდი
3. `route.ts`-ში დაამატეთ API handler
4. განაახლეთ `processAIChatQuery` მეთოდი

### ტესტირება

```bash
# Development server
npm run dev

# ტესტი AI ჩატით
# გახსენით http://localhost:3000/properties
# დააჭირეთ AI ჩატის ღილაკს
```

## მაგალითები

### 1. ქონების ძებნა

```typescript
// ვაკეში ბინების ძებნა
const properties = await client.searchProperties({
  location: 'ვაკე',
  propertyType: 'apartment'
});
```

### 2. იპოთეკის გაანგარიშება

```typescript
// 200,000 ლარიანი ბინისთვის იპოთეკა
const mortgage = await client.calculateMortgage({
  price: 200000,
  downPayment: 40000,
  interestRate: 8.5,
  loanTerm: 20
});
```

### 3. ბაზრის ანალიზი

```typescript
// თბილისის ბაზრის ანალიზი
const insights = await client.getMarketInsights('თბილისი');
```

## მხარდაჭერა

თუ გაქვთ კითხვები ან პრობლემები, გთხოვთ:

1. შეამოწმოთ console logs
2. დარწმუნდით, რომ ყველა dependency დაინსტალირებულია
3. შეამოწმოთ API responses Network tab-ში

## ლიცენზია

MIT License - იხილეთ LICENSE ფაილი დეტალებისთვის. 