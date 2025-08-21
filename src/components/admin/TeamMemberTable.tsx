'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import type { TeamMember } from '@/lib/types';
import { useDeleteTeamMemberMutation } from '@/lib/redux/api/teamMemberApi';
import Swal from 'sweetalert2';

interface TeamMemberTableProps {
  teamMembers: TeamMember[];
  onEdit: (teamMember: TeamMember) => void;
  onRefetch: () => void;
}

export function TeamMemberTable({ teamMembers, onEdit, onRefetch }: TeamMemberTableProps) {
  const [deleteTeamMember, { isLoading: isDeleting }] = useDeleteTeamMemberMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (teamMember: TeamMember) => {
    try {
      setDeletingId(teamMember._id);

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete ${teamMember.name}. This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        await deleteTeamMember(teamMember._id).unwrap();

        Swal.fire({
          title: 'Deleted!',
          text: `${teamMember.name} has been deleted successfully.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        onRefetch();
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      Swal.fire({
        title: 'Error!',
        text: error?.data?.message || 'Failed to delete team member. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setDeletingId(null);
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No team members found.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Add your first team member to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden lg:table-cell">Education</TableHead>
              <TableHead className="hidden lg:table-cell">Experience</TableHead>
              <TableHead className="hidden xl:table-cell">Achievements</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member._id}>
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border">
                    <Image
                      src={member.img || '/placeholder-avatar.png'}
                      alt={member.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-avatar.png';
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{member.role}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-[200px]">
                  {member.education ? truncateText(member.education) : 'N/A'}
                </TableCell>
                <TableCell className="hidden lg:table-cell max-w-[200px]">
                  {member.experience ? truncateText(member.experience) : 'N/A'}
                </TableCell>
                <TableCell className="hidden xl:table-cell max-w-[200px]">
                  {member.achievements ? truncateText(member.achievements) : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isDeleting && deletingId === member._id}
                        >
                          {isDeleting && deletingId === member._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete{' '}
                            <strong>{member.name}</strong> from the team members list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(member)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {teamMembers.map((member) => (
          <Card key={member._id} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border flex-shrink-0">
                <Image
                  src={member.img || '/placeholder-avatar.png'}
                  alt={member.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-avatar.png';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg truncate">{member.name}</h3>
                    <Badge variant="secondary" className="mt-1">{member.role}</Badge>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(member)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={isDeleting && deletingId === member._id}
                        >
                          {isDeleting && deletingId === member._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete{' '}
                            <strong>{member.name}</strong> from the team members list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(member)}
                            className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Additional info for mobile */}
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {member.education && (
                    <div>
                      <span className="font-medium">Education:</span> {truncateText(member.education, 60)}
                    </div>
                  )}
                  {member.experience && (
                    <div>
                      <span className="font-medium">Experience:</span> {truncateText(member.experience, 60)}
                    </div>
                  )}
                  {member.achievements && (
                    <div>
                      <span className="font-medium">Achievements:</span> {truncateText(member.achievements, 60)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
