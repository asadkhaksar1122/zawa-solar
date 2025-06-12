'use client'; // This page uses client components for interactivity

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { SolutionTable } from '@/components/admin/SolutionTable';
import { SolutionForm } from '@/components/admin/SolutionForm';
import { solarSolutions, companyCategories } from '@/lib/data'; // Using mock data for now
import type { SolarSolution, CompanyCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';


// In a real app, you'd fetch this data from your backend, e.g., using a Server Component
// and passing it down, or fetching in a useEffect if this remains a client component.
// For this example, we use the static mock data.
// const solutions: SolarSolution[] = solarSolutions;
// const companies: CompanyCategory[] = companyCategories;

export default function AdminSolutionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  // For this example, we continue using static mock data directly.
  // In a real scenario, data fetching logic (server or client) would be here.
  const solutions: SolarSolution[] = solarSolutions;
  const companies: CompanyCategory[] = companyCategories;

  const handleFormSubmit = () => {
    setIsAddModalOpen(false);
    router.refresh(); // Re-fetch data or re-render with new data
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-semibold">Manage Solar Solutions</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Solution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">Add New Solar Solution</DialogTitle>
              <DialogDescription>
                Fill in the details for the new solar solution.
              </DialogDescription>
            </DialogHeader>
            <SolutionForm companies={companies} onFormSubmit={handleFormSubmit} />
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Solutions</CardTitle>
          <CardDescription>
            A list of all solar solutions in the system. You can edit or delete them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SolutionTable solutions={solutions} companies={companies} />
        </CardContent>
      </Card>
    </div>
  );
}
