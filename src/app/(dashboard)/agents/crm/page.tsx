'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  FiRefreshCw, 
  FiPlus, 
  FiAlertCircle,
  FiUsers,
  FiDollarSign,
  FiCheckSquare,
  FiFileText,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { AgentShell } from './components/agentShell';

// CRM Components
import {
  ContactList,
  ContactForm,
  DealPipeline,
  DealForm,
  TaskList,
  TaskForm,
  NoteForm,
} from '@/components/crm';

// CRM Hooks
import {
  useContacts,
  useDeals,
  useTasks,
  useNotes,
} from '@/hooks/crm';

// Types
import { Contact, ContactFormData, Deal, DealFormData, Task, TaskFormData, Note, NoteFormData } from '@/types/crm';

export default function CrmPage() {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState<'contacts' | 'deals' | 'tasks' | 'notes'>('contacts');

  // Modal states
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  // Selected items for editing
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Fetch data from API
  const {
    contacts,
    isLoading: contactsLoading,
    error: contactsError,
    createContact,
    updateContact,
    deleteContact,
    refresh: refreshContacts,
  } = useContacts({ limit: 50 });

  const {
    deals,
    pipeline,
    stats: dealStats,
    isLoading: dealsLoading,
    error: dealsError,
    createDeal,
    updateDeal,
    deleteDeal,
    updateDealStage,
    refresh: refreshDeals,
  } = useDeals({ limit: 50 });

  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refresh: refreshTasks,
  } = useTasks({ limit: 50 });

  const {
    notes,
    isLoading: notesLoading,
    error: notesError,
    createNote,
    updateNote,
    deleteNote,
    refresh: refreshNotes,
  } = useNotes({ limit: 20 });

  // Handlers for Contact operations
  const handleAddContact = () => {
    setSelectedContact(null);
    setContactModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setContactModalOpen(true);
  };

  const handleDeleteContact = async (contact: Contact) => {
    if (confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      await deleteContact(contact.id);
    }
  };

  const handleSubmitContact = async (formData: ContactFormData) => {
    if (selectedContact) {
      await updateContact(selectedContact.id, formData);
    } else {
      await createContact(formData);
    }
    setContactModalOpen(false);
  };

  // Handlers for Deal operations
  const handleAddDeal = () => {
    setSelectedDeal(null);
    setDealModalOpen(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setDealModalOpen(true);
  };

  const handleDeleteDeal = async (deal: Deal) => {
    if (confirm(`Are you sure you want to delete "${deal.title}"?`)) {
      await deleteDeal(deal.id);
    }
  };

  const handleSubmitDeal = async (formData: DealFormData) => {
    if (selectedDeal) {
      await updateDeal(selectedDeal.id, formData);
    } else {
      await createDeal(formData);
    }
    setDealModalOpen(false);
  };

  // Handlers for Task operations
  const handleAddTask = () => {
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleDeleteTask = async (task: Task) => {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      await deleteTask(task.id);
    }
  };

  const handleToggleTask = async (task: Task) => {
    await toggleTaskStatus(task);
  };

  const handleSubmitTask = async (formData: TaskFormData) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, formData);
    } else {
      await createTask(formData);
    }
    setTaskModalOpen(false);
  };

  // Handlers for Note operations
  const handleAddNote = () => {
    setSelectedNote(null);
    setNoteModalOpen(true);
  };

  const handleSubmitNote = async (formData: NoteFormData) => {
    if (selectedNote) {
      await updateNote(selectedNote.id, formData);
    } else {
      await createNote(formData);
    }
    setNoteModalOpen(false);
  };

  const handleRefreshAll = () => {
    refreshContacts();
    refreshDeals();
    refreshTasks();
    refreshNotes();
  };

  // Stats cards data
  const statsCards = [
    {
      label: 'Total Contacts',
      value: contacts.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      onClick: () => setActiveView('contacts'),
    },
    {
      label: 'Pipeline Value',
      value: dealStats ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(dealStats.totalValue) : '$0',
      icon: FiDollarSign,
      color: 'bg-green-500',
      onClick: () => setActiveView('deals'),
    },
    {
      label: 'Pending Tasks',
      value: tasks.filter(t => t.status !== 'completed').length,
      icon: FiCheckSquare,
      color: 'bg-orange-500',
      onClick: () => setActiveView('tasks'),
    },
    {
      label: 'Recent Notes',
      value: notes.length,
      icon: FiFileText,
      color: 'bg-purple-500',
      onClick: () => setActiveView('notes'),
    },
  ];

  const isLoading = contactsLoading || dealsLoading || tasksLoading || notesLoading;
  const hasError = contactsError || dealsError || tasksError || notesError;

  return (
    <AgentShell title="CRM Dashboard">
      <div className={`flex-1 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                CRM Dashboard
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                Manage your contacts, deals, tasks, and notes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefreshAll}
                disabled={isLoading}
                className={`p-2 rounded-lg border ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'} transition-colors disabled:opacity-50`}
                title="Refresh all data"
              >
                <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''} ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {hasError && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">Error loading data</p>
                <p className="text-sm">{contactsError || dealsError || tasksError || notesError}</p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={stat.onClick}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className={`flex items-center gap-2 mb-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            {[
              { id: 'contacts', label: 'Contacts', icon: FiUsers },
              { id: 'deals', label: 'Deals', icon: FiDollarSign },
              { id: 'tasks', label: 'Tasks', icon: FiCheckSquare },
              { id: 'notes', label: 'Notes', icon: FiFileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as typeof activeView)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeView === tab.id
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : `border-transparent ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'contacts' && (
                <ContactList
                  contacts={contacts}
                  isLoading={contactsLoading}
                  onAdd={handleAddContact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  onView={handleEditContact}
                />
              )}

              {activeView === 'deals' && (
                <DealPipeline
                  deals={deals}
                  isLoading={dealsLoading}
                  onAdd={handleAddDeal}
                  onEdit={handleEditDeal}
                  onDelete={handleDeleteDeal}
                  onView={handleEditDeal}
                  onStageChange={(deal, newStage) => updateDealStage(deal.id, newStage)}
                />
              )}

              {activeView === 'tasks' && (
                <TaskList
                  tasks={tasks}
                  isLoading={tasksLoading}
                  onAdd={handleAddTask}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              )}

              {activeView === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        Notes
                      </h2>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Recent notes and activity
                      </p>
                    </div>
                    <button
                      onClick={handleAddNote}
                      className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white rounded-lg transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Note
                    </button>
                  </div>

                  {notesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
                    </div>
                  ) : notes.length === 0 ? (
                    <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <FiFileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No notes yet</p>
                      <button
                        onClick={handleAddNote}
                        className="mt-4 text-[#D4AF37] hover:underline"
                      >
                        Add your first note
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                        >
                          <p className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            {note.content}
                          </p>
                          <div className={`mt-3 flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span>By {note.authorName}</span>
                            <span>•</span>
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <ContactForm
        contact={selectedContact}
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSubmit={handleSubmitContact}
        isLoading={contactsLoading}
      />

      <DealForm
        deal={selectedDeal}
        contacts={contacts.map(c => ({ id: c.id, firstName: c.firstName, lastName: c.lastName }))}
        isOpen={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={handleSubmitDeal}
        isLoading={dealsLoading}
      />

      <TaskForm
        task={selectedTask}
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleSubmitTask}
        isLoading={tasksLoading}
      />

      <NoteForm
        note={selectedNote}
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSubmit={handleSubmitNote}
        isLoading={notesLoading}
      />
    </AgentShell>
  );
}
