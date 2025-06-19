'use client';

import { useState } from 'react';
import type { Company } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Edit3, Trash2, Loader2 } from 'lucide-react';
import { CompanyForm } from './CompanyForm';
import { deleteCompany } from '@/app/admin/companies/actions';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useGetCompaniesQuery } from '@/lib/redux/api/companiesApi';

export function CompanyTable() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: companies, isLoading, error, refetch } = useGetCompaniesQuery();

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (companyId: string, companyName: string) => {
    const result = await deleteCompany(companyId);
    refetch()
    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Company Deleted',
        text: `Company "${companyName}" ${result.message}`
      });
      router.refresh();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message
      });
    }
  };

  const handleFormSubmit = async () => {
    console.log(selectedCompany)
    setIsEditModalOpen(false);
    setSelectedCompany(null);
    router.refresh();
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-muted-foreground">Loading companies...</span>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Error loading companies. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px] text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies && companies.length > 0 ? companies.map((company) => (
            <TableRow key={company._id}>
              <TableCell>
                {company.logoUrl ? (
                  <div className="h-10 w-10 overflow-hidden rounded-md">
                    <img
                      src={company.logoUrl}
                      alt={`${company.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {company.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(company)}>
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            company &quot;{company.name}&quot;. Any solar solutions associated with this company might need to be updated.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(company._id, company.name)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : null}
        </TableBody>
      </Table>
      {(!companies || companies.length === 0) && (
        <div className="text-center py-10 text-muted-foreground">
          No companies found. Add your first company to get started.
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={(isOpen) => {
        setIsEditModalOpen(isOpen);
        if (!isOpen) setSelectedCompany(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">Edit Company</DialogTitle>
            <DialogDescription>
              Make changes to the company details below.
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <CompanyForm
              company={selectedCompany}
              onFormSubmit={handleFormSubmit}
              imageUrl={selectedCompany.logoUrl || undefined}
            />
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}