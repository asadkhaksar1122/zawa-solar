
'use client';

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
// Using mock data, renamed companyCategories
import type { SolarSolution, Company } from '@/lib/types'; // Renamed CompanyCategory
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetSolutionsQuery } from '@/lib/redux/api/solutionsApi';
import { useGetCompaniesQuery } from '@/lib/redux/api/companiesApi';


export default function AdminSolutionsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();
  const { data } = useGetCompaniesQuery()

  // For this example, we continue using static mock data directly.



  const companies: Company[] = data || []; // Use renamed 'companies'

  const handleFormSubmit = () => {
    setIsAddModalOpen(false);
    router.refresh();
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
            <ScrollArea className="max-h-[70vh] pr-6">
              <SolutionForm companies={companies} onFormSubmit={handleFormSubmit} />
            </ScrollArea>
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
          <SolutionTable />
        </CardContent>
      </Card>
    </div>
  );
}
