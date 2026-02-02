# ERD Audit Report

Generated: 2026-02-02T06:16:06.806Z

## Entities
- users: id, email, first_name, last_name, avatar, role, account_role, phone, created_at, last_login, is_active, password_hash, email_verification_token, is_email_verified, updated_at
- contacts: id, first_name, last_name, email, phone, status, source, assigned_agent_id, created_at, updated_at
- deals: id, title, contact_id, agent_id, stage, value, currency, probability, expected_close_date, created_at, updated_at
- tasks: id, title, description, assigned_to_id, deal_id, contact_id, due_date, priority, status, created_at, updated_at
- notes: id, content, contact_id, deal_id, created_by_id, created_at, updated_at
- chat_rooms: id, name, type, created_by_id, created_at, updated_at
- chat_messages: id, room_id, sender_id, content, type, created_at, updated_at, is_deleted
- chat_room_members: id, room_id, user_id, role, joined_at

## Relationships


## Issues

_No issues found._


## Mermaid ERD

```mermaid
erDiagram
  users {
    uuid id
    varchar(255) email
    varchar(100) first_name
    varchar(100) last_name
    varchar(500) avatar
    userrole role
    accountrole account_role
    varchar(20) phone
    timestamptz(6) created_at
    timestamptz(6) last_login
    boolean is_active
    varchar(255) password_hash
    varchar(100) email_verification_token
    boolean is_email_verified
    timestamptz(6) updated_at
  }
  contacts {
    uuid id
    varchar(100) first_name
    varchar(100) last_name
    varchar(255) email
    varchar(20) phone
    contactstatus status
    varchar(100) source
    uuid assigned_agent_id
    timestamptz(6) created_at
    timestamptz(6) updated_at
  }
  deals {
    uuid id
    varchar(300) title
    uuid contact_id
    uuid agent_id
    dealstage stage
    decimal(12,2) value
    currencytype currency
    integer probability
    timestamptz(6) expected_close_date
    timestamptz(6) created_at
    timestamptz(6) updated_at
  }
  tasks {
    uuid id
    varchar(300) title
    text description
    uuid assigned_to_id
    uuid deal_id
    uuid contact_id
    timestamptz(6) due_date
    taskpriority priority
    taskstatus status
    timestamptz(6) created_at
    timestamptz(6) updated_at
  }
  notes {
    uuid id
    text content
    uuid contact_id
    uuid deal_id
    uuid created_by_id
    timestamptz(6) created_at
    timestamptz(6) updated_at
  }
  chat_rooms {
    uuid id
    varchar(200) name
    chatroomtype type
    uuid created_by_id
    timestamptz(6) created_at
    timestamptz(6) updated_at
  }
  chat_messages {
    uuid id
    uuid room_id
    uuid sender_id
    text content
    chatmessagetype type
    timestamptz(6) created_at
    timestamptz(6) updated_at
    boolean is_deleted
  }
  chat_room_members {
    uuid id
    uuid room_id
    uuid user_id
    chatroommemberrole role
    timestamptz(6) joined_at
  }
```
## SQL Recommendations

**Favorites (saved properties)**
```sql
ALTER TABLE favorites
  ADD CONSTRAINT favorites_user_property_unique UNIQUE (user_id, property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);
```

**Appointments (viewings)**
```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_unique_slot
  ON appointments(client_id, agent_id, property_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_agent ON appointments(agent_id);
CREATE INDEX IF NOT EXISTS idx_appointments_property ON appointments(property_id);
```

**Property analytics (daily rollups)**
```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_analytics_daily
  ON property_analytics(property_id, analytics_date);
```

**Property search performance**
```sql
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_search
  ON properties(city, property_type, transaction_type, status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
```


## Optional Modules (enable if needed)

**Images table** — richer metadata per property
```sql
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_images_property_sort
  ON images(property_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_images_property ON images(property_id);
```

**Listings history** — re-list same property with new terms
```sql
CREATE TYPE listing_status AS ENUM ('active','expired','withdrawn','sold','rented');
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  date_listed TIMESTAMP NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMP,
  price DECIMAL(12,2) NOT NULL,
  currency currency_type DEFAULT 'GEL',
  status listing_status DEFAULT 'active',
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_listings_property_date
  ON listings(property_id, date_listed DESC);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
```
