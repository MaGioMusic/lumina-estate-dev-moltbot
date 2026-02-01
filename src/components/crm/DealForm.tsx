"use client";

import * as React from "react";
import { Loader2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Deal, DealFormData, DealStage, DealPriority } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DealFormProps {
  deal?: Deal | null;
  contacts?: { id: string; firstName: string; lastName: string }[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DealFormData) => void;
  isLoading?: boolean;
  className?: string;
}

const stageOptions: { value: DealStage; label: string }[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'property_shown', label: 'Property Shown' },
  { value: 'offer_made', label: 'Offer Made' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'closed_won', label: 'Closed Won' },
  { value: 'closed_lost', label: 'Closed Lost' },
];

const priorityOptions: { value: DealPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const currencyOptions = [
  { value: 'GEL', label: 'GEL (₾)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
];

export function DealForm({
  deal,
  contacts = [],
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  className,
}: DealFormProps) {
  const isEditing = !!deal;

  const [formData, setFormData] = React.useState<DealFormData>({
    title: "",
    description: "",
    value: 0,
    currency: "GEL",
    stage: "lead",
    priority: "medium",
    contactId: "",
    propertyId: null,
    expectedCloseDate: null,
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof DealFormData, string>>>({});

  React.useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        description: deal.description || "",
        value: deal.value,
        currency: deal.currency,
        stage: deal.stage,
        priority: deal.priority,
        contactId: deal.contactId,
        propertyId: deal.propertyId,
        expectedCloseDate: deal.expectedCloseDate,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        value: 0,
        currency: "GEL",
        stage: "lead",
        priority: "medium",
        contactId: contacts.length > 0 ? contacts[0].id : "",
        propertyId: null,
        expectedCloseDate: null,
      });
    }
    setErrors({});
  }, [deal, isOpen, contacts]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof DealFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }

    if (formData.value < 0) {
      newErrors.value = "Value must be positive";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof DealFormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[550px]", className)}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Deal" : "Add New Deal"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the deal information below."
              : "Fill in the details to create a new deal."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Property sale to John Doe"
              disabled={isLoading}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add details about this deal..."
              rows={2}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactId">
                Contact <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.contactId}
                onValueChange={(value) => handleChange("contactId", value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.contactId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.firstName} {contact.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contactId && (
                <p className="text-xs text-destructive">{errors.contactId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value) => handleChange("stage", value as DealStage)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="value">Value</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="value"
                  type="number"
                  min="0"
                  value={formData.value}
                  onChange={(e) => handleChange("value", parseFloat(e.target.value) || 0)}
                  disabled={isLoading}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleChange("currency", value as 'GEL' | 'USD' | 'EUR')}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleChange("priority", value as DealPriority)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
              <Input
                id="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString().slice(0, 10) : ""}
                onChange={(e) => handleChange("expectedCloseDate", e.target.value ? new Date(e.target.value).toISOString() : null)}
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? "Update Deal" : "Create Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
