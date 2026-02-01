"use client";

import * as React from "react";
import { DollarSign, Calendar, User, MoreHorizontal, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Deal, DealStage, DealPriority } from "@/types/crm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DealCardProps {
  deal: Deal;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onView?: (deal: Deal) => void;
  onStageChange?: (deal: Deal, newStage: DealStage) => void;
  className?: string;
}

const stageColors: Record<DealStage, string> = {
  lead: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  qualified: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  property_shown: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  offer_made: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  negotiation: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  closed_won: "bg-green-500/10 text-green-600 border-green-500/20",
  closed_lost: "bg-red-500/10 text-red-600 border-red-500/20",
};

const stageLabels: Record<DealStage, string> = {
  lead: "Lead",
  qualified: "Qualified",
  property_shown: "Property Shown",
  offer_made: "Offer Made",
  negotiation: "Negotiation",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const priorityColors: Record<DealPriority, string> = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

export function DealCard({
  deal,
  onEdit,
  onDelete,
  onView,
  onStageChange,
  className,
}: DealCardProps) {
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  const isClosed = deal.stage === 'closed_won' || deal.stage === 'closed_lost';

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[#D4AF37]/30",
        isClosed && "opacity-75",
        className
      )}
      onClick={() => onView?.(deal)}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {deal.title}
            </h3>
            {deal.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                {deal.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(deal)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(deal)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(deal)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        {/* Value */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(deal.value, deal.currency)}
            </p>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium",
                  stageColors[deal.stage]
                )}
              >
                {stageLabels[deal.stage]}
              </Badge>
              <TrendingUp
                className={cn("h-3 w-3", priorityColors[deal.priority])}
              />
            </div>
          </div>
        </div>

        {/* Probability */}
        {!isClosed && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Probability</span>
              <span className="font-medium">{deal.probability}%</span>
            </div>
            <Progress value={deal.probability} className="h-1.5" />
          </div>
        )}

        {/* Expected Close Date */}
        {deal.expectedCloseDate && !isClosed && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Expected close: {formatDate(deal.expectedCloseDate)}</span>
          </div>
        )}

        {deal.actualCloseDate && isClosed && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Closed: {formatDate(deal.actualCloseDate)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
