"use client";

import * as React from "react";
import { Plus, Loader2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Deal, DealStage } from "@/types/crm";
import { DealCard } from "./DealCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DealPipelineProps {
  deals: Deal[];
  isLoading?: boolean;
  onAdd?: () => void;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onView?: (deal: Deal) => void;
  onStageChange?: (deal: Deal, newStage: DealStage) => void;
  className?: string;
}

const stages: { value: DealStage; label: string; color: string }[] = [
  { value: 'lead', label: 'Lead', color: 'bg-gray-500' },
  { value: 'qualified', label: 'Qualified', color: 'bg-blue-500' },
  { value: 'property_shown', label: 'Property Shown', color: 'bg-purple-500' },
  { value: 'offer_made', label: 'Offer Made', color: 'bg-orange-500' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-yellow-500' },
  { value: 'closed_won', label: 'Closed Won', color: 'bg-green-500' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'bg-red-500' },
];

export function DealPipeline({
  deals,
  isLoading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onStageChange,
  className,
}: DealPipelineProps) {
  const [filter, setFilter] = React.useState<'all' | 'active' | 'closed'>('active');

  const filteredDeals = React.useMemo(() => {
    if (filter === 'all') return deals;
    if (filter === 'active') return deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
    if (filter === 'closed') return deals.filter(d => d.stage === 'closed_won' || d.stage === 'closed_lost');
    return deals;
  }, [deals, filter]);

  const dealsByStage = React.useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.value] = filteredDeals.filter((deal) => deal.stage === stage.value);
      return acc;
    }, {} as Record<DealStage, Deal[]>);
  }, [filteredDeals]);

  const stageTotals = React.useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.value] = dealsByStage[stage.value].reduce((sum, deal) => sum + deal.value, 0);
      return acc;
    }, {} as Record<DealStage, number>);
  }, [dealsByStage]);

  const totalValue = React.useMemo(() => {
    return filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  }, [filteredDeals]);

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
          <h2 className="text-2xl font-bold text-foreground">Deal Pipeline</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Total pipeline value:{" "}
            <span className="font-semibold text-[#D4AF37]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(totalValue)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as 'all' | 'active' | 'closed')}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="all">All Deals</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={onAdd}
            className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Board */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4 min-w-max">
          {stages.map((stage) => {
            const stageDeals = dealsByStage[stage.value];
            const stageValue = stageTotals[stage.value];

            return (
              <div
                key={stage.value}
                className="w-72 flex-shrink-0"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2.5 w-2.5 rounded-full", stage.color)} />
                    <h3 className="font-semibold text-sm text-foreground">
                      {stage.label}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {stageDeals.length}
                    </Badge>
                  </div>
                </div>

                {stageValue > 0 && (
                  <p className="text-xs text-muted-foreground mb-3">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 0,
                    }).format(stageValue)}
                  </p>
                )}

                {/* Deal Cards */}
                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onView={onView}
                      onStageChange={onStageChange}
                    />
                  ))}
                </div>

                {/* Empty State */}
                {stageDeals.length === 0 && (
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">No deals</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
