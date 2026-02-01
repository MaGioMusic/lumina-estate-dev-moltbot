"use client";

import * as React from "react";
import { Mail, Phone, MoreHorizontal, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Contact, ContactStatus } from "@/types/crm";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactCardProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
  onView?: (contact: Contact) => void;
  className?: string;
}

const statusColors: Record<ContactStatus, string> = {
  lead: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  prospect: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  client: "bg-green-500/10 text-green-600 border-green-500/20",
  inactive: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const statusLabels: Record<ContactStatus, string> = {
  lead: "Lead",
  prospect: "Prospect",
  client: "Client",
  inactive: "Inactive",
};

export function ContactCard({
  contact,
  onEdit,
  onDelete,
  onView,
  className,
}: ContactCardProps) {
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase();
  const fullName = `${contact.firstName} ${contact.lastName}`;

  const formatLastContacted = (date: string | null) => {
    if (!date) return "Never contacted";
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#D4AF37]/30",
        className
      )}
      onClick={() => onView?.(contact)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-[#D4AF37]/20">
            <AvatarImage src={contact.avatar || undefined} alt={fullName} />
            <AvatarFallback className="bg-[#1E3A8A] text-white text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">
                  {fullName}
                </h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-1 text-xs font-medium",
                    statusColors[contact.status]
                  )}
                >
                  {statusLabels[contact.status]}
                </Badge>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView?.(contact)}>
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit?.(contact)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(contact)}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-3 space-y-1.5">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#D4AF37] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{contact.phone}</span>
                </a>
              )}
            </div>

            {contact.lastContactedAt && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Last contacted: {formatLastContacted(contact.lastContactedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
