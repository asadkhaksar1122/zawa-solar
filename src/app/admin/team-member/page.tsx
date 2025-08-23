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
import { PlusCircle, Loader2 } from 'lucide-react';
import { TeamMemberTable } from '@/components/admin/TeamMemberTable';
import { TeamMemberForm } from '@/components/admin/TeamMemberForm';
import type { TeamMember } from '@/lib/types';
import { useGetTeamMembersQuery } from '@/lib/redux/api/teamMemberApi';

export default function AdminTeamMemberPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch team members using RTK Query
  const {
    data: teamMembers = [],
    isLoading,
    isError,
    error,
    refetch
  } = useGetTeamMembersQuery();

  const handleFormSubmit = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingTeamMember(null);
    refetch(); // Refetch data after form submission
  };

  const handleEdit = (teamMember: TeamMember) => {
    setEditingTeamMember(teamMember);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTeamMember(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] px-4">
        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" />
        <span className="ml-2 text-sm md:text-base">Loading team members...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px] px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="pb-4">
            <CardTitle className="text-red-600 text-lg">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm md:text-base">Failed to load team members. Please try again.</p>
            <Button onClick={() => refetch()} className="w-full sm:w-auto">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-4 md:space-y-6 px-2 sm:px-4 md:px-6">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words">Team Members</h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base break-words">
            Manage your team members and their information.
          </p>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto text-sm">
              <PlusCircle className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">Add Team Member</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-16px)] max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg md:text-xl">Add New Team Member</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Fill in the details to add a new team member.
              </DialogDescription>
            </DialogHeader>

            <TeamMemberForm onFormSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="w-full min-w-0">
        <CardHeader className="pb-4 px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg md:text-xl break-words">Team Members ({teamMembers.length})</CardTitle>
          <CardDescription className="text-xs sm:text-sm break-words">
            A list of all team members in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6 overflow-x-auto">
          <div className="min-w-0">
            <TeamMemberTable
              teamMembers={teamMembers}
              onEdit={handleEdit}
              onRefetch={refetch}
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="w-[calc(100vw-16px)] max-w-2xl max-h-[90vh] overflow-y-auto mx-2">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg md:text-xl">Edit Team Member</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update the team member information.
            </DialogDescription>
          </DialogHeader>

          {editingTeamMember && (
            <TeamMemberForm
              teamMember={editingTeamMember}
              onFormSubmit={handleFormSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
