'use client';

import type { CompanyCategory } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilterPanelProps {
  categories: CompanyCategory[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function FilterPanel({ categories, selectedCategory, onCategoryChange }: FilterPanelProps) {
  return (
    <Card className="shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Filter Solutions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="category-filter" className="text-sm font-medium">Company</Label>
            <Select
              value={selectedCategory || 'all'}
              onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
            >
              <SelectTrigger id="category-filter" className="w-full mt-1">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Add more filters here as needed, e.g., power output range, price range */}
        </div>
      </CardContent>
    </Card>
  );
}
