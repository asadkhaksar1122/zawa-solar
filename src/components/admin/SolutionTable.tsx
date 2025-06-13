
'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { SolarSolution, Company } from '@/lib/types'; 
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
import { MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import { SolutionForm } from './SolutionForm';
import { deleteSolarSolution } from '@/app/admin/solutions/actions';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import Swal from 'sweetalert2';

interface SolutionTableProps {
  solutions: SolarSolution[];
  companies: Company[]; 
}

export function SolutionTable({ solutions, companies }: SolutionTableProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<SolarSolution | null>(null);

  const handleEdit = (solution: SolarSolution) => {
    setSelectedSolution(solution);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (solutionId: string) => {
    const result = await deleteSolarSolution(solutionId);
    if (result.success) {
      Swal.fire({ 
        icon: 'success', 
        title: 'Solution Deleted', 
        text: result.message 
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
  
  const handleFormSubmit = () => {
    setIsEditModalOpen(false);
    setSelectedSolution(null);
    router.refresh();
  }


  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solutions.map((solution) => (
            <TableRow key={solution._id}>
              <TableCell className="hidden sm:table-cell">
                <Image
                  alt={solution.name}
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={solution.imageUrl || 'https://placehold.co/64x64.png'}
                  width="64"
                  data-ai-hint="solar panel small"
                />
              </TableCell>
              <TableCell className="font-medium">{solution.name}</TableCell>
              <TableCell>{solution.company}</TableCell>
              <TableCell className="hidden md:table-cell max-w-xs truncate">
                {solution.description}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEdit(solution)}>
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
                            solar solution &quot;{solution.name}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(solution._id)} variant="destructive">
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {solutions.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No solar solutions found.
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={(isOpen) => {
          setIsEditModalOpen(isOpen);
          if (!isOpen) setSelectedSolution(null);
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">Edit Solar Solution</DialogTitle>
            <DialogDescription>
              Make changes to the solar solution details below.
            </DialogDescription>
          </DialogHeader>
          {selectedSolution && (
            <ScrollArea className="max-h-[70vh] pr-6">
              <SolutionForm solution={selectedSolution} companies={companies} onFormSubmit={handleFormSubmit} />
            </ScrollArea>
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
