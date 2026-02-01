/** CRM Types for Lumina Estate */

export type ContactStatus = 'lead' | 'prospect' | 'client' | 'inactive';
export type ContactSource = 'website' | 'referral' | 'social_media' | 'email' | 'phone' | 'walk_in' | 'other';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: ContactStatus;
  source: ContactSource;
  notes: string | null;
  assignedTo: string | null; // agent ID
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DealStage = 'lead' | 'qualified' | 'property_shown' | 'offer_made' | 'negotiation' | 'closed_won' | 'closed_lost';
export type DealPriority = 'low' | 'medium' | 'high';

export interface Deal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  currency: 'GEL' | 'USD' | 'EUR';
  stage: DealStage;
  probability: number; // 0-100
  priority: DealPriority;
  contactId: string;
  propertyId: string | null;
  assignedTo: string | null; // agent ID
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  assignedTo: string | null; // agent ID
  relatedTo: {
    type: 'contact' | 'deal' | 'property';
    id: string;
  } | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  relatedTo: {
    type: 'contact' | 'deal' | 'property';
    id: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Form data types for creating/updating
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: ContactStatus;
  source: ContactSource;
  notes: string;
}

export interface DealFormData {
  title: string;
  description: string;
  value: number;
  currency: 'GEL' | 'USD' | 'EUR';
  stage: DealStage;
  priority: DealPriority;
  contactId: string;
  propertyId: string | null;
  expectedCloseDate: string | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string | null;
  assignedTo: string | null;
}

export interface NoteFormData {
  content: string;
}
