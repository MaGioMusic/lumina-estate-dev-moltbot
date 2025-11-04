# ERD Audit Report

Generated: 2025-11-04T15:14:07.516Z

## Entities
- users: id, email, first_name, last_name, avatar, role, phone, created_at, last_login, is_active, password_hash, email_verification_token, is_email_verified, updated_at
- agents: id, user_id, license_number, experience_years, rating, bio, company_name, company_logo, is_verified, verification_date, commission_rate, created_at, updated_at
- properties: id, agent_id, title, description, price, currency, location, district, city, country, property_type, transaction_type, bedrooms, bathrooms, area, floor, total_floors, construction_year, condition, furnished, latitude, longitude, status, created_at, updated_at, is_featured, featured_until, views_count
- favorites: id, user_id, property_id, created_at
- appointments: id, client_id, agent_id, property_id, scheduled_date, status, notes, type, created_at, updated_at, meeting_location
- reviews: id, author_id, agent_id, property_id, rating, comment, review_type, created_at, is_verified, CHECK
- inquiries: id, user_id, property_id, agent_id, message, contact_phone, contact_email, status, created_at, responded_at
- search_history: id, user_id, search_criteria, results_count, search_date, search_name, is_saved
- transactions: id, property_id, buyer_id, seller_id, agent_id, sale_price, currency, transaction_date, status, commission, notes
- property_analytics: id, property_id, view_count, favorite_count, inquiry_count, appointment_count, analytics_date, view_sources
- notifications: id, user_id, title, message, type, is_read, created_at, metadata
- mortgage_calculations: id, user_id, property_id, loan_amount, interest_rate, loan_term_years, down_payment, monthly_payment, calculated_at, is_saved
- user_preferences: id, user_id, search_preferences, notification_settings, preferred_language, theme, currency, updated_at
- audit_log: id, table_name, operation, old_values, new_values, user_id, timestamp

## Relationships
- 1:N agents.user_id -> users.id
- 1:N properties.agent_id -> agents.id
- 1:1 favorites.user_id -> users.id
- 1:1 favorites.property_id -> properties.id
- 1:N appointments.client_id -> users.id
- 1:N appointments.agent_id -> agents.id
- 1:N appointments.property_id -> properties.id
- 1:N reviews.author_id -> users.id
- 1:N reviews.agent_id -> agents.id
- 1:N reviews.property_id -> properties.id
- 1:N inquiries.user_id -> users.id
- 1:N inquiries.property_id -> properties.id
- 1:N inquiries.agent_id -> agents.id
- 1:N search_history.user_id -> users.id
- 1:N transactions.property_id -> properties.id
- 1:N transactions.buyer_id -> users.id
- 1:N transactions.seller_id -> users.id
- 1:N transactions.agent_id -> agents.id
- 1:1 property_analytics.property_id -> properties.id
- 1:N notifications.user_id -> users.id
- 1:N mortgage_calculations.user_id -> users.id
- 1:N mortgage_calculations.property_id -> properties.id
- 1:N user_preferences.user_id -> users.id
- N:M favorites.user_id -> users.id (via favorites)
- N:M favorites.property_id -> properties.id (via favorites)
- N:M appointments.client_id -> users.id (via appointments)
- N:M appointments.agent_id -> agents.id (via appointments)
- N:M appointments.property_id -> properties.id (via appointments)

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
    user_role role
    varchar(20) phone
    timestamp created_at
    timestamp last_login
    boolean is_active
    varchar(255) password_hash
    varchar(100) email_verification_token
    boolean is_email_verified
    timestamp updated_at
  }
  agents {
    uuid id
    uuid user_id
    varchar(50) license_number
    integer experience_years
    decimal(3,2) rating
    text bio
    varchar(200) company_name
    varchar(500) company_logo
    boolean is_verified
    timestamp verification_date
    decimal(5,2) commission_rate
    timestamp created_at
    timestamp updated_at
  }
  properties {
    uuid id
    uuid agent_id
    varchar(300) title
    text description
    decimal(12,2) price
    currency_type currency
    varchar(300) location
    varchar(100) district
    varchar(100) city
    varchar(100) country
    property_type_enum property_type
    transaction_type_enum transaction_type
    integer bedrooms
    integer bathrooms
    decimal(8,2) area
    integer floor
    integer total_floors
    integer construction_year
    property_condition condition
    furnished_type furnished
    decimal(10,8) latitude
    decimal(11,8) longitude
    property_status status
    timestamp created_at
    timestamp updated_at
    boolean is_featured
    timestamp featured_until
    integer views_count
  }
  favorites {
    uuid id
    uuid user_id
    uuid property_id
    timestamp created_at
  }
  appointments {
    uuid id
    uuid client_id
    uuid agent_id
    uuid property_id
    timestamp scheduled_date
    appointment_status status
    text notes
    appointment_type type
    timestamp created_at
    timestamp updated_at
    varchar(300) meeting_location
  }
  reviews {
    uuid id
    uuid author_id
    uuid agent_id
    uuid property_id
    integer rating
    text comment
    review_type_enum review_type
    timestamp created_at
    boolean is_verified
    ( CHECK
  }
  inquiries {
    uuid id
    uuid user_id
    uuid property_id
    uuid agent_id
    text message
    varchar(20) contact_phone
    varchar(255) contact_email
    inquiry_status status
    timestamp created_at
    timestamp responded_at
  }
  search_history {
    uuid id
    uuid user_id
    jsonb search_criteria
    integer results_count
    timestamp search_date
    varchar(200) search_name
    boolean is_saved
  }
  transactions {
    uuid id
    uuid property_id
    uuid buyer_id
    uuid seller_id
    uuid agent_id
    decimal(12,2) sale_price
    currency_type currency
    timestamp transaction_date
    transaction_status status
    decimal(8,2) commission
    text notes
  }
  property_analytics {
    uuid id
    uuid property_id
    integer view_count
    integer favorite_count
    integer inquiry_count
    integer appointment_count
    date analytics_date
    jsonb view_sources
  }
  notifications {
    uuid id
    uuid user_id
    varchar(200) title
    text message
    notification_type type
    boolean is_read
    timestamp created_at
    jsonb metadata
  }
  mortgage_calculations {
    uuid id
    uuid user_id
    uuid property_id
    decimal(12,2) loan_amount
    decimal(5,2) interest_rate
    integer loan_term_years
    decimal(12,2) down_payment
    decimal(10,2) monthly_payment
    timestamp calculated_at
    boolean is_saved
  }
  user_preferences {
    uuid id
    uuid user_id
    jsonb search_preferences
    jsonb notification_settings
    varchar(5) preferred_language
    theme_type theme
    currency_type currency
    timestamp updated_at
  }
  audit_log {
    uuid id
    varchar(50) table_name
    varchar(10) operation
    jsonb old_values
    jsonb new_values
    uuid user_id
    timestamp timestamp
  }
  users ||--o{ agents : "agents.user_id->users.id"
  agents ||--o{ properties : "properties.agent_id->agents.id"
  users ||--|| favorites : "favorites.user_id->users.id"
  properties ||--|| favorites : "favorites.property_id->properties.id"
  users ||--o{ appointments : "appointments.client_id->users.id"
  agents ||--o{ appointments : "appointments.agent_id->agents.id"
  properties ||--o{ appointments : "appointments.property_id->properties.id"
  users ||--o{ reviews : "reviews.author_id->users.id"
  agents ||--o{ reviews : "reviews.agent_id->agents.id"
  properties ||--o{ reviews : "reviews.property_id->properties.id"
  users ||--o{ inquiries : "inquiries.user_id->users.id"
  properties ||--o{ inquiries : "inquiries.property_id->properties.id"
  agents ||--o{ inquiries : "inquiries.agent_id->agents.id"
  users ||--o{ search_history : "search_history.user_id->users.id"
  properties ||--o{ transactions : "transactions.property_id->properties.id"
  users ||--o{ transactions : "transactions.buyer_id->users.id"
  users ||--o{ transactions : "transactions.seller_id->users.id"
  agents ||--o{ transactions : "transactions.agent_id->agents.id"
  properties ||--|| property_analytics : "property_analytics.property_id->properties.id"
  users ||--o{ notifications : "notifications.user_id->users.id"
  users ||--o{ mortgage_calculations : "mortgage_calculations.user_id->users.id"
  properties ||--o{ mortgage_calculations : "mortgage_calculations.property_id->properties.id"
  users ||--o{ user_preferences : "user_preferences.user_id->users.id"
  users }o--o{ favorites : "favorites via user_id (via favorites)"
  properties }o--o{ favorites : "favorites via property_id (via favorites)"
  users }o--o{ appointments : "appointments via client_id (via appointments)"
  agents }o--o{ appointments : "appointments via agent_id (via appointments)"
  properties }o--o{ appointments : "appointments via property_id (via appointments)"
```
