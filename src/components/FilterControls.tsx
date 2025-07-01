import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Star, Clock, TrendingUp, List, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterControlsProps {
  filterType: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  feedbacks: any[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filterType,
  onFilterChange,
  searchQuery,
  onSearchChange,
  feedbacks
}) => {
  const filterCounts = {
    all: feedbacks.length,
    top5: Math.min(5, feedbacks.length),
    popular: feedbacks.filter(f => f.likes > 15).length,
    recent: feedbacks.filter(f => Date.now() - f.timestamp.getTime() < 24 * 60 * 60 * 1000).length,
    trending: feedbacks.filter(f => f.likes > 20).length,
  };

  const filters = [
    { key: 'all', label: 'Semua', icon: List, count: filterCounts.all },
    { key: 'top5', label: 'Top 5', icon: Star, count: filterCounts.top5 },
    { key: 'popular', label: 'Populer', icon: TrendingUp, count: filterCounts.popular },
    { key: 'recent', label: 'Terbaru', icon: Clock, count: filterCounts.recent },
    { key: 'trending', label: 'Trending', icon: TrendingUp, count: filterCounts.trending },
  ];

  const currentFilter = filters.find(f => f.key === filterType) || filters[0];
  const CurrentIcon = currentFilter.icon;

  return (
    <Card className="backdrop-blur-lg bg-white/50 border-gray-200 transition-all duration-300">
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Cari feedback..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 sm:pl-10 text-sm sm:text-base h-8 sm:h-10 bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700">
            <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Filter Feedback</span>
            <span className="sm:hidden">Filter</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between p-2 sm:p-3 h-auto text-xs sm:text-sm bg-white hover:bg-gray-50 text-gray-700"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <CurrentIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{currentFilter.label}</span>
                  <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                    {currentFilter.count}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              className="w-56 bg-white"
              align="start"
            >
              {filters.map((filter) => {
                const Icon = filter.icon;
                const isActive = filterType === filter.key;
                
                return (
                  <DropdownMenuItem
                    key={filter.key}
                    onClick={() => onFilterChange(filter.key)}
                    className={`flex items-center justify-between cursor-pointer ${
                      isActive 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{filter.label}</span>
                    </div>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {filter.count}
                    </span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active Search Info */}
        {searchQuery && (
          <div className="text-xs sm:text-sm text-gray-600 p-2 rounded-lg bg-gray-100">
            Mencari: <span className="font-medium">"{searchQuery}"</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
