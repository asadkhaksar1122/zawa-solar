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
import { CompanyTable } from '@/components/admin/CompanyTable';
import { CompanyForm } from '@/components/admin/CompanyForm';
import { companies as initialCompanies } from '@/lib/data'; // Using mock data
import type { Company } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function AdminCompaniesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  // For this prototype, we use the static mock data directly.
  // Server actions will call revalidatePath, and router.refresh() will help update client-side.
  const companies: Company[] = initialCompanies;

  const handleFormSubmit = () => {
    setIsAddModalOpen(false);
    router.refresh(); 
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-semibold">Manage Companies</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline">Add New Company</DialogTitle>
              <DialogDescription>
                Fill in the details for the new company.
              </DialogDescription>
            </DialogHeader>
            <CompanyForm onFormSubmit={handleFormSubmit} />
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
          <CardTitle>All Companies</CardTitle>
          <CardDescription>
            A list of all companies providing solar solutions. You can edit or delete them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyTable companies={companies} />
        </CardContent>
      </Card>
    </div>
  );
}
