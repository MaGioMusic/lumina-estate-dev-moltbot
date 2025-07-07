'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { z } from 'zod';

// Language schema for validation
const LanguageSchema = z.enum(['ka', 'en', 'ru']);
type Language = z.infer<typeof LanguageSchema>;

// Translation interface
interface Translations {
  [key: string]: {
    ka: string;
    en: string;
    ru: string;
  };
}

// Complete translations for the entire website
const translations: Translations = {
  // Navigation
  home: {
    ka: 'მთავარი',
    en: 'Home',
    ru: 'Главная'
  },
  properties: {
    ka: 'უძრავი ქონება',
    en: 'Properties',
    ru: 'Недвижимость'
  },
  investors: {
    ka: 'ინვესტორები',
    en: 'Investors',
    ru: 'Инвесторы'
  },
  agents: {
    ka: 'აგენტები',
    en: 'Agents',
    ru: 'Агенты'
  },
  about: {
    ka: 'ჩვენ შესახებ',
    en: 'About',
    ru: 'О нас'
  },
  contact: {
    ka: 'კონტაქტი',
    en: 'Contact',
    ru: 'Контакт'
  },
  
  // Menu items
  login: {
    ka: 'შესვლა',
    en: 'Login',
    ru: 'Войти'
  },
  signup: {
    ka: 'რეგისტრაცია',
    en: 'Sign Up',
    ru: 'Регистрация'
  },
  search: {
    ka: 'ძებნა',
    en: 'Search',
    ru: 'Поиск'
  },
  favorites: {
    ka: 'რჩეულები',
    en: 'Favorites',
    ru: 'Избранное'
  },
  darkMode: {
    ka: 'მუქი რეჟიმი',
    en: 'Dark Mode',
    ru: 'Тёмный режим'
  },
  lightMode: {
    ka: 'ღია რეჟიმი',
    en: 'Light Mode',
    ru: 'Светлый режим'
  },
  language: {
    ka: 'ენა',
    en: 'Language',
    ru: 'Язык'
  },
  
  // Language names
  georgian: {
    ka: 'ქართული',
    en: 'Georgian',
    ru: 'Грузинский'
  },
  english: {
    ka: 'ინგლისური',
    en: 'English',
    ru: 'Английский'
  },
  russian: {
    ka: 'რუსული',
    en: 'Russian',
    ru: 'Русский'
  },

  // Hero Section
  heroTitle: {
    ka: 'იპოვეთ თქვენი სრულყოფილი სახლი',
    en: 'Find Your Perfect Home',
    ru: 'Найдите свой идеальный дом'
  },
  heroSubtitle: {
    ka: 'ლუმინა ესტეითთან ერთად აღმოაცენით პრემიუმ უძრავი ქონების შესაძლებლობები. პროფესიონალური მომსახურება და ექსპერტული რჩევები.',
    en: 'Discover premium real estate opportunities with Lumina Estate. Professional service and expert advice for your dream property.',
    ru: 'Откройте для себя возможности премиальной недвижимости с Lumina Estate. Профессиональное обслуживание и экспертные советы.'
  },
  searchPlaceholder: {
    ka: 'მდებარეობა',
    en: 'Location',
    ru: 'Местоположение'
  },
  propertyType: {
    ka: 'ქონების ტიპი',
    en: 'Property Type',
    ru: 'Тип недвижимости'
  },
  priceRange: {
    ka: 'ფასების დიაპაზონი',
    en: 'Price Range',
    ru: 'Ценовой диапазон'
  },
  searchButton: {
    ka: 'ძებნა',
    en: 'Search',
    ru: 'Поиск'
  },

  // Property Types
  apartment: {
    ka: 'ბინა',
    en: 'Apartment',
    ru: 'Квартира'
  },
  house: {
    ka: 'სახლი',
    en: 'House',
    ru: 'Дом'
  },
  villa: {
    ka: 'ვილა',
    en: 'Villa',
    ru: 'Вилла'
  },
  commercial: {
    ka: 'კომერციული',
    en: 'Commercial',
    ru: 'Коммерческая'
  },
  anyPropertyType: {
    ka: 'ნებისმიერი ტიპი',
    en: 'Any Type',
    ru: 'Любой тип'
  },
  anyPriceRange: {
    ka: 'ნებისმიერი ფასი',
    en: 'Any Price',
    ru: 'Любая цена'
  },

  // Features Section
  featuresTitle: {
    ka: 'რატომ ლუმინა ესტეითი?',
    en: 'Why Lumina Estate?',
    ru: 'Почему Lumina Estate?'
  },
  expertAgents: {
    ka: 'ექსპერტი აგენტები',
    en: 'Expert Agents',
    ru: 'Эксперт агенты'
  },
  expertAgentsDesc: {
    ka: 'ჩვენი გამოცდილი აგენტები დაგეხმარებიან იპოვოთ სრულყოფილი ქონება',
    en: 'Our experienced agents will help you find the perfect property',
    ru: 'Наши опытные агенты помогут вам найти идеальную недвижимость'
  },
  premiumListings: {
    ka: 'პრემიუმ განცხადებები',
    en: 'Premium Listings',
    ru: 'Премиум объявления'
  },
  premiumListingsDesc: {
    ka: 'მხოლოდ საუკეთესო და შემოწმებული უძრავი ქონების შეთავაზებები',
    en: 'Only the best and verified real estate offers',
    ru: 'Только лучшие и проверенные предложения недвижимости'
  },
  smartTechnology: {
    ka: 'ჭკვიანი ტექნოლოგია',
    en: 'Smart Technology',
    ru: 'Умные технологии'
  },
  smartTechnologyDesc: {
    ka: 'AI-ით გაძლიერებული ძებნა და პერსონალიზებული რეკომენდაციები',
    en: 'AI-powered search and personalized recommendations',
    ru: 'Поиск с помощью ИИ и персонализированные рекомендации'
  },

  // Contact Section
  contactTitle: {
    ka: 'დაგვიკავშირდით',
    en: 'Contact Us',
    ru: 'Свяжитесь с нами'
  },
  contactSubtitle: {
    ka: 'მზად ვართ დაგეხმაროთ თქვენი უძრავი ქონების საჭიროებებში',
    en: 'Ready to help you with your real estate needs',
    ru: 'Готовы помочь вам с вашими потребностями в недвижимости'
  },
  phone: {
    ka: 'ტელეფონი',
    en: 'Phone',
    ru: 'Телефон'
  },
  email: {
    ka: 'ელ. ფოსტა',
    en: 'Email',
    ru: 'Эл. почта'
  },
  address: {
    ka: 'მისამართი',
    en: 'Address',
    ru: 'Адрес'
  },
  
  // Properties Page
  allProperties: {
    ka: 'ყველა ქონება',
    en: 'All Properties',
    ru: 'Вся недвижимость'
  },
  filters: {
    ka: 'ფილტრები',
    en: 'Filters',
    ru: 'Фильтры'
  },
  
  // Pagination
  showing: {
    ka: 'ნაჩვენებია',
    en: 'Showing',
    ru: 'Показано'
  },
  of: {
    ka: '-დან',
    en: 'of',
    ru: 'из'
  },
  page: {
    ka: 'გვერდი',
    en: 'Page',
    ru: 'Страница'
  },
  previous: {
    ka: 'წინა',
    en: 'Previous',
    ru: 'Предыдущая'
  },
  next: {
    ka: 'შემდეგი',
    en: 'Next',
    ru: 'Следующая'
  },
  goToPage: {
    ka: 'გვერდზე გადასვლა',
    en: 'Go to page',
    ru: 'Перейти на страницу'
  },
  propertiesCount: {
    ka: 'ქონება',
    en: 'properties',
    ru: 'недвижимость'
  },
  bedrooms: {
    ka: 'საძინებელი',
    en: 'Bedrooms',
    ru: 'Спальни'
  },
  bathrooms: {
    ka: 'სააბაზანო',
    en: 'Bathrooms',
    ru: 'Ванные'
  },
  area: {
    ka: 'ფართობი',
    en: 'Area',
    ru: 'Площадь'
  },
  sqm: {
    ka: 'კვ.მ',
    en: 'sqm',
    ru: 'кв.м'
  },
  price: {
    ka: 'ფასი',
    en: 'Price',
    ru: 'Цена'
  },
  viewDetails: {
    ka: 'დეტალების ნახვა',
    en: 'View Details',
    ru: 'Подробнее'
  },

  // Agents Page
  ourAgents: {
    ka: 'ჩვენი აგენტები',
    en: 'Our Agents',
    ru: 'Наши агенты'
  },
  meetTeam: {
    ka: 'გაიცანით ჩვენი გუნდი',
    en: 'Meet Our Team',
    ru: 'Познакомьтесь с нашей командой'
  },
  experience: {
    ka: 'გამოცდილება',
    en: 'Experience',
    ru: 'Опыт'
  },
  years: {
    ka: 'წელი',
    en: 'years',
    ru: 'лет'
  },
  specialization: {
    ka: 'სპეციალიზაცია',
    en: 'Specialization',
    ru: 'Специализация'
  },
  contactAgent: {
    ka: 'აგენტთან კონტაქტი',
    en: 'Contact Agent',
    ru: 'Связаться с агентом'
  },

  // Footer
  footerDescription: {
    ka: 'ლუმინა ესტეითი - თქვენი სანდო პარტნიორი უძრავი ქონების სფეროში',
    en: 'Lumina Estate - Your trusted partner in real estate',
    ru: 'Lumina Estate - Ваш надежный партнер в сфере недвижимости'
  },
  quickLinks: {
    ka: 'სწრაფი ბმულები',
    en: 'Quick Links',
    ru: 'Быстрые ссылки'
  },
  services: {
    ka: 'მომსახურებები',
    en: 'Services',
    ru: 'Услуги'
  },
  buyProperty: {
    ka: 'ქონების ყიდვა',
    en: 'Buy Property',
    ru: 'Купить недвижимость'
  },
  sellProperty: {
    ka: 'ქონების გაყიდვა',
    en: 'Sell Property',
    ru: 'Продать недвижимость'
  },
  rentProperty: {
    ka: 'ქონების ქირავება',
    en: 'Rent Property',
    ru: 'Арендовать недвижимость'
  },
  propertyManagement: {
    ka: 'ქონების მართვა',
    en: 'Property Management',
    ru: 'Управление недвижимостью'
  },
  followUs: {
    ka: 'გამოგვყევით',
    en: 'Follow Us',
    ru: 'Подписывайтесь'
  },
  allRightsReserved: {
    ka: 'ყველა უფლება დაცულია',
    en: 'All rights reserved',
    ru: 'Все права защищены'
  },

  // Common
  loading: {
    ka: 'იტვირთება...',
    en: 'Loading...',
    ru: 'Загрузка...'
  },
  error: {
    ka: 'შეცდომა',
    en: 'Error',
    ru: 'Ошибка'
  },
  success: {
    ka: 'წარმატება',
    en: 'Success',
    ru: 'Успех'
  },
  save: {
    ka: 'შენახვა',
    en: 'Save',
    ru: 'Сохранить'
  },
  cancel: {
    ka: 'გაუქმება',
    en: 'Cancel',
    ru: 'Отмена'
  },
  submit: {
    ka: 'გაგზავნა',
    en: 'Submit',
    ru: 'Отправить'
  },
  close: {
    ka: 'დახურვა',
    en: 'Close',
    ru: 'Закрыть'
  },

  // Additional translations
  amenities: {
    ka: 'კომფორტი',
    en: 'Amenities',
    ru: 'Удобства'
  },
  applyFilters: {
    ka: 'ფილტრების გამოყენება',
    en: 'Apply Filters',
    ru: 'Применить фильтры'
  },

  // Hero section search form
  searchProperties: {
    ka: 'ქონების ძებნა',
    en: 'Search Properties',
    ru: 'Поиск недвижимости'
  },

  // Common phrases
  discoverYourPerfectProperty: {
    ka: 'აღმოაცენით თქვენი სრულყოფილი ქონება',
    en: 'Discover your perfect property',
    ru: 'Откройте для себя идеальную недвижимость'
  },
  propertyCount: {
    ka: 'ქონება',
    en: 'properties',
    ru: 'объектов'
  },
  propertiesFound: {
    ka: 'ქონება ნაპოვნია',
    en: 'Properties Found',
    ru: 'Найдено объектов'
  },
  searchResultsFor: {
    ka: 'ძებნის შედეგები:',
    en: 'Search results for',
    ru: 'Результаты поиска для'
  },
  noPropertiesFound: {
    ka: 'ქონება ვერ მოიძებნა',
    en: 'No properties found',
    ru: 'Недвижимость не найдена'
  },
  tryAdjustingFilters: {
    ka: 'სცადეთ ძებნის კრიტერიუმების ან ფილტრების შეცვლა მეტი ქონების მოსაძებნად.',
    en: 'Try adjusting your search criteria or filters to find more properties.',
    ru: 'Попробуйте изменить критерии поиска или фильтры, чтобы найти больше объектов.'
  },
  searchAgents: {
    ka: 'აგენტების ძებნა...',
    en: 'Search agents...',
    ru: 'Поиск агентов...'
  },
  noAgentsFound: {
    ka: 'აგენტები ვერ მოიძებნა',
    en: 'No agents found matching your search',
    ru: 'Агенты не найдены'
  },

  // Map related
  loadingMap: {
    ka: 'რუკა იტვირთება...',
    en: 'Loading map...',
    ru: 'Загрузка карты...'
  },
  resetView: {
    ka: 'ნახვის განულება',
    en: 'Reset view',
    ru: 'Сбросить вид'
  },

  // Transaction types
  forLease: {
    ka: 'გირავდება',
    en: 'For Lease',
    ru: 'В аренду'
  },

  // Construction status
  newConstruction: {
    ka: 'ახალი აშენებული',
    en: 'New Construction',
    ru: 'Новостройка'
  },
  underConstruction: {
    ka: 'მშენებარე',
    en: 'Under Construction',
    ru: 'Строится'
  },
  oldConstruction: {
    ka: 'ძველი აშენებული',
    en: 'Old Construction',
    ru: 'Старая постройка'
  },
  renovated: {
    ka: 'რემონტირებული',
    en: 'Renovated',
    ru: 'С ремонтом'
  },

  // Floor options
  firstFloor: {
    ka: 'პირველი სართული',
    en: 'First Floor',
    ru: 'Первый этаж'
  },
  lastFloor: {
    ka: 'ბოლო სართული',
    en: 'Last Floor',
    ru: 'Последний этаж'
  },
  middleFloors: {
    ka: 'შუა სართულები',
    en: 'Middle Floors',
    ru: 'Средние этажи'
  },
  floor15: {
    ka: '1-5 სართული',
    en: '1-5 Floor',
    ru: '1-5 этаж'
  },
  floor610: {
    ka: '6-10 სართული',
    en: '6-10 Floor',
    ru: '6-10 этаж'
  },
  floor1115: {
    ka: '11-15 სართული',
    en: '11-15 Floor',
    ru: '11-15 этаж'
  },
  floor16plus: {
    ka: '16+ სართული',
    en: '16+ Floor',
    ru: '16+ этаж'
  },

  // Furniture status
  furnished: {
    ka: 'ავეჯით',
    en: 'Furnished',
    ru: 'С мебелью'
  },
  partiallyFurnished: {
    ka: 'ნაწილობრივ ავეჯით',
    en: 'Partially Furnished',
    ru: 'Частично меблированная'
  },
  unfurnished: {
    ka: 'ავეჯის გარეშე',
    en: 'Unfurnished',
    ru: 'Без мебели'
  },

  // Filter labels
  transactionType: {
    ka: 'გარიგების ტიპი',
    en: 'Transaction Type',
    ru: 'Тип сделки'
  },
  constructionStatus: {
    ka: 'მშენებლობის სტატუსი',
    en: 'Construction Status',
    ru: 'Статус строительства'
  },
  myLocation: {
    ka: 'ჩემი მდებარეობა',
    en: 'My location',
    ru: 'Моё местоположение'
  },
  propertiesOnMap: {
    ka: 'უძრავი ქონება რუკაზე',
    en: 'properties on map',
    ru: 'объектов на карте'
  },

  // New translations
  warning: {
    ka: 'გაფრთხილება',
    en: 'Warning',
    ru: 'Предупреждение'
  },
  googleMapsApiKeyRequired: {
    ka: 'Google Maps API Key საჭიროა რუქის სწორი მუშაობისთვის',
    en: 'Google Maps API Key is required for proper map functionality',
    ru: 'Для корректной работы карты требуется Google Maps API Key'
  },
  gridView: {
    ka: 'ბადის ხედი',
    en: 'Grid View',
    ru: 'Сетка'
  },
  mapView: {
    ka: 'რუქის ხედი',
    en: 'Map View',
    ru: 'Карта'
  },
  zoomIn: {
    ka: 'გადიდება',
    en: 'Zoom In',
    ru: 'Увеличить'
  },
  zoomOut: {
    ka: 'დაპატარავება',
    en: 'Zoom Out',
    ru: 'Уменьшить'
  },
  typeMessage: {
    ka: 'დაწერეთ შეკითხვა...',
    en: 'Type your message...',
    ru: 'Введите сообщение...'
  },
  askAI: {
    ka: 'AI-ს კითხვა',
    en: 'Ask AI',
    ru: 'Спросить ИИ'
  },
  send: {
    ka: 'გაგზავნა',
    en: 'Send',
    ru: 'Отправить'
  },
  showMore: {
    ka: 'მეტის ნახვა',
    en: 'Show More',
    ru: 'Показать больше'
  },
  showLess: {
    ka: 'ნაკლების ნახვა',
    en: 'Show Less',
    ru: 'Показать меньше'
  },

  // Settings menu
  settings: {
    ka: 'პარამეტრები',
    en: 'Settings',
    ru: 'Настройки'
  },
  notifications: {
    ka: 'შეტყობინებები',
    en: 'Notifications',
    ru: 'Уведомления'
  },
  privacy: {
    ka: 'კონფიდენციალურობა',
    en: 'Privacy',
    ru: 'Конфиденциальность'
  },
  accountSettings: {
    ka: 'ანგარიშის პარამეტრები',
    en: 'Account Settings',
    ru: 'Настройки аккаунта'
  },
  help: {
    ka: 'დახმარება',
    en: 'Help',
    ru: 'Помощь'
  },
  support: {
    ka: 'მხარდაჭერა',
    en: 'Support',
    ru: 'Поддержка'
  },
  theme: {
    ka: 'თემა',
    en: 'Theme',
    ru: 'Тема'
  },
  on: {
    ka: 'ჩართული',
    en: 'On',
    ru: 'Включено'
  },
  off: {
    ka: 'გამორთული',
    en: 'Off',
    ru: 'Выключено'
  },
  account: {
    ka: 'ანგარიში',
    en: 'Account',
    ru: 'Аккаунт'
  },
  tools: {
    ka: 'ხელსაწყოები',
    en: 'Tools',
    ru: 'Инструменты'
  },
  quickSearch: {
    ka: 'სწრაფი ძებნა',
    en: 'Quick Search',
    ru: 'Быстрый поиск'
  },

  // Property Types
  propertyTypes: {
    ka: 'ქონების ტიპები',
    en: 'Property Types',
    ru: 'Типы недвижимости'
  },
  forSale: {
    ka: 'იყიდება',
    en: 'For Sale',
    ru: 'Продается'
  },
  forRent: {
    ka: 'ქირავდება',
    en: 'For Rent',
    ru: 'Сдается'
  },
  newProperty: {
    ka: 'ახალი',
    en: 'New',
    ru: 'Новый'
  },

  // Settings Page
  appearance: {
    ka: 'გარეგნობა',
    en: 'Appearance',
    ru: 'Внешний вид'
  },
  privacySecurity: {
    ka: 'კონფიდენციალურობა და უსაფრთხოება',
    en: 'Privacy & Security',
    ru: 'Конфиденциальность и безопасность'
  },
  applications: {
    ka: 'აპლიკაციები',
    en: 'Applications',
    ru: 'Приложения'
  },
  integrations: {
    ka: 'ინტეგრაციები',
    en: 'Integrations',
    ru: 'Интеграции'
  },
  billingSubscription: {
    ka: 'ბილინგი და გამოწერა',
    en: 'Billing & Subscription',
    ru: 'Биллинг и подписка'
  },
  helpSupport: {
    ka: 'დახმარება და მხარდაჭერა',
    en: 'Help & Support',
    ru: 'Помощь и поддержка'
  },
  themePreferences: {
    ka: 'თემის პარამეტრები',
    en: 'Theme Preferences',
    ru: 'Настройки темы'
  },
  light: {
    ka: 'ღია',
    en: 'Light',
    ru: 'Светлая'
  },
  dark: {
    ka: 'მუქი',
    en: 'Dark',
    ru: 'Темная'
  },
  system: {
    ka: 'სისტემის',
    en: 'System',
    ru: 'Системная'
  },
  highContrastMode: {
    ka: 'მაღალი კონტრასტის რეჟიმი',
    en: 'High Contrast Mode',
    ru: 'Режим высокого контраста'
  },
  increaseContrast: {
    ka: 'კონტრასტის გაზრდა უკეთესი ხილვადობისთვის',
    en: 'Increase contrast for better visibility',
    ru: 'Увеличить контрастность для лучшей видимости'
  },
  fontSize: {
    ka: 'შრიფტის ზომა',
    en: 'Font Size',
    ru: 'Размер шрифта'
  },
  small: {
    ka: 'მცირე',
    en: 'Small',
    ru: 'Маленький'
  },
  editProfile: {
    ka: 'პროფილის რედაქტირება',
    en: 'Edit Profile',
    ru: 'Редактировать профиль'
  },
  personalInformation: {
    ka: 'პირადი ინფორმაცია',
    en: 'Personal Information',
    ru: 'Личная информация'
  },
  updatePersonalDetails: {
    ka: 'თქვენი პირადი მონაცემების განახლება',
    en: 'Update your personal details',
    ru: 'Обновите ваши личные данные'
  },
  fullName: {
    ka: 'სრული სახელი',
    en: 'Full Name',
    ru: 'Полное имя'
  },
  emailAddress: {
    ka: 'ელ. ფოსტის მისამართი',
    en: 'Email Address',
    ru: 'Адрес электронной почты'
  },
  phoneNumber: {
    ka: 'ტელეფონის ნომერი',
    en: 'Phone Number',
    ru: 'Номер телефона'
  },
  saveChanges: {
    ka: 'ცვლილებების შენახვა',
    en: 'Save Changes',
    ru: 'Сохранить изменения'
  },
  password: {
    ka: 'პაროლი',
    en: 'Password',
    ru: 'Пароль'
  },
  updatePassword: {
    ka: 'პაროლის განახლება',
    en: 'Update your password',
    ru: 'Обновить ваш пароль'
  },
  currentPassword: {
    ka: 'მიმდინარე პაროლი',
    en: 'Current Password',
    ru: 'Текущий пароль'
  },
  newPassword: {
    ka: 'ახალი პაროლი',
    en: 'New Password',
    ru: 'Новый пароль'
  },
  confirmNewPassword: {
    ka: 'ახალი პაროლის დადასტურება',
    en: 'Confirm New Password',
    ru: 'Подтвердить новый пароль'
  },
  updatePasswordBtn: {
    ka: 'პაროლის განახლება',
    en: 'Update Password',
    ru: 'Обновить пароль'
  },
  twoFactorAuth: {
    ka: 'ორფაქტორიანი ავტენტიფიკაცია',
    en: 'Two-Factor Authentication',
    ru: 'Двухфакторная аутентификация'
  },
  extraSecurity: {
    ka: 'დამატებითი უსაფრთხოების დონის დამატება თქვენს ანგარიშზე',
    en: 'Add an extra layer of security to your account',
    ru: 'Добавьте дополнительный уровень безопасности к вашему аккаунту'
  },
  enableTwoFactor: {
    ka: 'ორფაქტორიანი ავტენტიფიკაციის ჩართვა',
    en: 'Enable Two-Factor Authentication',
    ru: 'Включить двухфакторную аутентификацию'
  },
  secure2FA: {
    ka: 'ანგარიშის უსაფრთხოება 2FA-ით',
    en: 'Secure your account with 2FA',
    ru: 'Защитите ваш аккаунт с помощью 2FA'
  },
  connectedAccounts: {
    ka: 'დაკავშირებული ანგარიშები',
    en: 'Connected Accounts',
    ru: 'Подключенные аккаунты'
  },
  connectAccounts: {
    ka: 'ანგარიშების დაკავშირება მარტივი შესვლისთვის',
    en: 'Connect your accounts for easier sign-in',
    ru: 'Подключите ваши аккаунты для упрощения входа'
  },
  google: {
    ka: 'Google',
    en: 'Google',
    ru: 'Google'
  },
  apple: {
    ka: 'Apple',
    en: 'Apple',
    ru: 'Apple'
  },
  facebook: {
    ka: 'Facebook',
    en: 'Facebook',
    ru: 'Facebook'
  },
  connected: {
    ka: 'დაკავშირებული',
    en: 'Connected',
    ru: 'Подключен'
  },
  notConnected: {
    ka: 'არ არის დაკავშირებული',
    en: 'Not connected',
    ru: 'Не подключен'
  },
  disconnect: {
    ka: 'გათიშვა',
    en: 'Disconnect',
    ru: 'Отключить'
  },
  connect: {
    ka: 'დაკავშირება',
    en: 'Connect',
    ru: 'Подключить'
  },

  // Agent Dashboard translations
  'agents.dashboard.title': {
    ka: 'აგენტების დაშბორდი',
    en: 'Agent Dashboard',
    ru: 'Панель Агента'
  },
  'agents.dashboard.subtitle': {
    ka: 'მართეთ თქვენი ქონება, კლიენტები და შეხვედრები',
    en: 'Manage your properties, clients, and appointments',
    ru: 'Управляйте недвижимостью, клиентами и встречами'
  },
  'agents.stats.totalProperties': {
    ka: 'სულ ქონება',
    en: 'Total Properties',
    ru: 'Всего Объектов'
  },
  'agents.stats.activeClients': {
    ka: 'აქტიური კლიენტები',
    en: 'Active Clients',
    ru: 'Активные Клиенты'
  },
  'agents.stats.pendingDeals': {
    ka: 'მიმდინარე გარიგებები',
    en: 'Pending Deals',
    ru: 'Текущие Сделки'
  },
  'agents.stats.monthlyRevenue': {
    ka: 'ყოველთვიური შემოსავალი',
    en: 'Monthly Revenue',
    ru: 'Месячный Доход'
  },
  'agents.list.title': {
    ka: 'ჩვენი აგენტები',
    en: 'Our Agents',
    ru: 'Наши Агенты'
  },
  'agents.search.placeholder': {
    ka: 'ძებნა აგენტებში...',
    en: 'Search agents...',
    ru: 'Поиск агентов...'
  },
  'agents.filter.all': {
    ka: 'ყველა აგენტი',
    en: 'All Agents',
    ru: 'Все Агенты'
  },
  'agents.filter.luxury': {
    ka: 'ლუქსის სპეციალისტები',
    en: 'Luxury Specialists',
    ru: 'Специалисты по Люксу'
  },
  'agents.filter.commercial': {
    ka: 'კომერციული ექსპერტები',
    en: 'Commercial Experts',
    ru: 'Коммерческие Эксперты'
  },
  'agents.filter.residential': {
    ka: 'საცხოვრებელი აგენტები',
    en: 'Residential Agents',
    ru: 'Жилые Агенты'
  },
  'agents.properties': {
    ka: 'ქონება',
    en: 'properties',
    ru: 'объектов'
  },
  'agents.call': {
    ka: 'დარეკვა',
    en: 'Call',
    ru: 'Звонок'
  },
  'agents.email': {
    ka: 'იმეილი',
    en: 'Email',
    ru: 'Почта'
  },
  'agents.tasks.title': {
    ka: 'დღევანდელი ამოცანები',
    en: 'Tasks Due Today',
    ru: 'Задачи на Сегодня'
  },
  'agents.tasks.propertyViewing': {
    ka: 'ქონების ნახვა მაიკლ ბრაუნთან',
    en: 'Property viewing with Michael Brown',
    ru: 'Просмотр недвижимости с Майклом Брауном'
  },
  'agents.tasks.followUp': {
    ka: 'ემას შეთავაზების თვალყურისდევნება',
    en: "Follow up on Emma's offer",
    ru: 'Отследить предложение Эммы'
  },
  'agents.tasks.updatePhotos': {
    ka: 'ლისტინგის ფოტოების განახლება',
    en: 'Update listing photos',
    ru: 'Обновить фото объявления'
  },
  'agents.tasks.clientMeeting': {
    ka: 'კლიენტთან შეხვედრის მომზადება',
    en: 'Client meeting preparation',
    ru: 'Подготовка к встрече с клиентом'
  },
  'agents.appointments.title': {
    ka: 'მომავალი შეხვედრები',
    en: 'Upcoming Appointments',
    ru: 'Предстоящие Встречи'
  },
  'agents.appointments.propertyViewing': {
    ka: 'ქონების ნახვა',
    en: 'Property Viewing',
    ru: 'Просмотр Недвижимости'
  },
  'agents.appointments.clientMeeting': {
    ka: 'კლიენტთან შეხვედრა',
    en: 'Client Meeting',
    ru: 'Встреча с Клиентом'
  },
  'agents.appointments.propertyInspection': {
    ka: 'ქონების ინსპექცია',
    en: 'Property Inspection',
    ru: 'Инспекция Недвижимости'
  },
  'agents.messages.title': {
    ka: 'ბოლო შეტყობინებები',
    en: 'Recent Messages',
    ru: 'Последние Сообщения'
  },
  'agents.messages.lookingForward': {
    ka: 'ველოდები ხვალინდელ ნახვას!',
    en: 'Looking forward to the viewing tomorrow!',
    ru: 'Жду завтрашнего просмотра!'
  },
  'agents.messages.discussOffer': {
    ka: 'როდის შეგვიძლია შეთავაზების განხილვა?',
    en: 'When can we discuss the offer?',
    ru: 'Когда можем обсудить предложение?'
  },
  'agents.messages.thanksDetails': {
    ka: 'მადლობა ქონების დეტალებისთვის',
    en: 'Thanks for the property details',
    ru: 'Спасибо за детали недвижимости'
  },
  resultsUpdateAutomatically: {
    ka: 'შედეგები განახლდება ავტომატურად',
    en: 'Results update automatically',
    ru: 'Результаты обновляются автоматически'
  },
  min: {
    ka: 'მინ',
    en: 'Min',
    ru: 'Мин'
  },
  max: {
    ka: 'მაქს',
    en: 'Max',
    ru: 'Макс'
  },
  clearSelection: {
    ka: 'არჩევანის გასუფთავება',
    en: 'Clear selection',
    ru: 'Очистить выбор'
  },
  selected: {
    ka: 'არჩეული',
    en: 'selected',
    ru: 'выбрано'
  },
  
  // Districts
  tbilisi: {
    ka: 'თბილისი',
    en: 'Tbilisi',
    ru: 'Тбилиси'
  },
  vake: {
    ka: 'ვაკე',
    en: 'Vake',
    ru: 'Ваке'
  },
  mtatsminda: {
    ka: 'მთაწმინდა',
    en: 'Mtatsminda',
    ru: 'Мтацминда'
  },
  saburtalo: {
    ka: 'საბურთალო',
    en: 'Saburtalo',
    ru: 'Сабуртало'
  },
  isani: {
    ka: 'ისანი',
    en: 'Isani',
    ru: 'Исани'
  },
  gldani: {
    ka: 'გლდანი',
    en: 'Gldani',
    ru: 'Глдани'
  },
  didube: {
    ka: 'დიდუბე',
    en: 'Didube',
    ru: 'Дидубе'
  },
  vera: {
    ka: 'ვერა',
    en: 'Vera',
    ru: 'Вера'
  },
  ortachala: {
    ka: 'ორთაჭალა',
    en: 'Ortachala',
    ru: 'Ортачала'
  },
  samgori: {
    ka: 'სამგორი',
    en: 'Samgori',
    ru: 'Самгори'
  },
  varketili: {
    ka: 'ვარკეთილი',
    en: 'Varketili',
    ru: 'Варкетили'
  },
  oldTown: {
    ka: 'ძველი ქალაქი',
    en: 'Old Town',
    ru: 'Старый город'
  },
  rike: {
    ka: 'რიყე',
    en: 'Rike',
    ru: 'Рике'
  },
  mtkvariRiver: {
    ka: 'მტკვარი',
    en: 'Mtkvari River',
    ru: 'Река Мтквари'
  },
  tbilisiMap: {
    ka: 'თბილისის რუქა',
    en: 'Tbilisi Map',
    ru: 'Карта Тбилиси'
  },
  items: {
    ka: 'ნივთი',
    en: 'items',
    ru: 'объектов'
  },
  staticMapWithInteractivePins: {
    ka: 'სტატიკური რუქა ინტერაქტიული pin-ებით',
    en: 'Static map with interactive pins',
    ru: 'Статическая карта с интерактивными маркерами'
  },
  
  // Property types
  penthouse: {
    ka: 'პენტჰაუსი',
    en: 'Penthouse',
    ru: 'Пентхаус'
  },
  
  // Property titles
  luxuryVillaInVake: {
    ka: 'ვაკეში ძვირადღირებული ვილა',
    en: 'Luxury Villa in Vake',
    ru: 'Роскошная вилла в Ваке'
  },
  modernPenthouseInCenter: {
    ka: 'თანამედროვე პენტჰაუსი ცენტრში',
    en: 'Modern Penthouse in Center',
    ru: 'Современный пентхаус в центре'
  },
  propertyDetails: {
    ka: 'ქონების დეტალები',
    en: 'Property Details',
    ru: 'Детали недвижимости'
  },
  
  // Street names
  rustaveliAvenue: {
    ka: 'რუსთაველის გამზირი',
    en: 'Rustaveli Avenue',
    ru: 'Проспект Руставели'
  },
  
  // Country
  georgia: {
    ka: 'საქართველო',
    en: 'Georgia',
    ru: 'Грузия'
  },
  
  // Business districts
  downtownFinancialDistrict: {
    ka: 'ცენტრალური ფინანსური უბანი',
    en: 'Downtown Financial District',
    ru: 'Центральный финансовый район'
  },
  techHubArea: {
    ka: 'ტექნოლოგიური ცენტრი',
    en: 'Tech Hub Area',
    ru: 'Технологический центр'
  },
  shoppingDistrict: {
    ka: 'სავაჭრო უბანი',
    en: 'Shopping District',
    ru: 'Торговый район'
  },
  
  // Georgian cities
  batumi: {
    ka: 'ბათუმი',
    en: 'Batumi',
    ru: 'Батуми'
  },
  kutaisi: {
    ka: 'ქუთაისი',
    en: 'Kutaisi',
    ru: 'Кутаиси'
  },
  rustavi: {
    ka: 'რუსთავი',
    en: 'Rustavi',
    ru: 'Рустави'
  },
  zugdidi: {
    ka: 'ზუგდიდი',
    en: 'Zugdidi',
    ru: 'Зугдиди'
  },
  telavi: {
    ka: 'თელავი',
    en: 'Telavi',
    ru: 'Телави'
  },
  gori: {
    ka: 'გორი',
    en: 'Gori',
    ru: 'Гори'
  },
  poti: {
    ka: 'ფოთი',
    en: 'Poti',
    ru: 'Поти'
  },
  samtredia: {
    ka: 'სამტრედია',
    en: 'Samtredia',
    ru: 'Самтредиа'
  },
  kobuleti: {
    ka: 'ქობულეთი',
    en: 'Kobuleti',
    ru: 'Кобулети'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Secure storage class for language preference
class SecureLanguageStorage {
  private static readonly STORAGE_KEY = 'lumina_language';
  
  static get(): Language {
    try {
      if (typeof window === 'undefined') return 'ka'; // Default to Georgian on server
      
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return 'ka';
      
      // Validate stored language
      const parsed = LanguageSchema.safeParse(stored);
      return parsed.success ? parsed.data : 'ka';
    } catch (error) {
      console.warn('Failed to get language from storage:', error);
      return 'ka';
    }
  }
  
  static set(language: Language): void {
    try {
      if (typeof window === 'undefined') return;
      
      // Validate before storing
      const validated = LanguageSchema.parse(language);
      localStorage.setItem(this.STORAGE_KEY, validated);
    } catch (error) {
      console.error('Failed to set language in storage:', error);
    }
  }
  
  static clear(): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear language from storage:', error);
    }
  }
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('ka');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize language from storage
  useEffect(() => {
    const storedLanguage = SecureLanguageStorage.get();
    setLanguageState(storedLanguage);
    setIsLoading(false);
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      // Validate language
      const validated = LanguageSchema.parse(lang);
      setLanguageState(validated);
      SecureLanguageStorage.set(validated);
    } catch (error) {
      console.error('Invalid language:', error);
    }
  };

  // Translation function
  const t = (key: string): string => {
    try {
      const translation = translations[key];
      if (!translation) {
        console.warn(`Translation key "${key}" not found`);
        return key; // Return key as fallback
      }
      return translation[language] || translation.en || key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export type { Language };
export { translations }; 