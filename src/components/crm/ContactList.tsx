"use client";

import * as React from "react";
import { Search, Plus, Filter, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Contact, ContactStatus } from "@/types/crm";
import { ContactCard } from "./ContactCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactListProps {
  contacts: Contact[];
  isLoading?: boolean;
  onAdd?: () => void;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
  onView?: (contact: Contact) => void;
  className?: string;
}

const statusOptions: { value: ContactStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'lead', label: 'Leads' },
  { value: 'prospect', label: 'Prospects' },
  { value: 'client', label: 'Clients' },
  { value: 'inactive', label: 'Inactive' },
];

export function ContactList({
  contacts,
  isLoading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  className,
}: ContactListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<ContactStatus | 'all'>('all');

  const filteredContacts = React.useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        `${contact.firstName} ${contact.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.phone && contact.phone.includes(searchQuery));

      const matchesStatus =
        statusFilter === 'all' || contact.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  const contactCountByStatus = React.useMemo(() => {
    return contacts.reduce((acc, contact) => {
      acc[contact.status] = (acc[contact.status] || 0) + 1;
      return acc;
    }, {} as Record<ContactStatus, number>);
  }, [contacts]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contacts</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your leads, prospects, and clients
          </p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        {(['lead', 'prospect', 'client', 'inactive'] as ContactStatus[]).map(
          (status) => (
            <Badge
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              className={cn(
                "cursor-pointer capitalize",
                statusFilter === status && "bg-[#1E3A8A]"
              )}
              onClick={() =>
                setStatusFilter(statusFilter === status ? 'all' : status)
              }
            >
              {status}s ({contactCountByStatus[status] || 0})
            </Badge>
          )
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as ContactStatus | 'all')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contact Grid */}
      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            {searchQuery || statusFilter !== 'all'
              ? "No contacts found"
              : "No contacts yet"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {searchQuery || statusFilter !== 'all'
              ? "Try adjusting your search or filters"
              : "Get started by adding your first contact"}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button
              onClick={onAdd}
              variant="outline"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
      {filteredContacts.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </p>
      )}
    </div>
  );
}
