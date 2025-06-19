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
// Using mock data
import type { Company } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary';

export default function AdminCompaniesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>('');
  const router = useRouter();

  // For this prototype, we use the static mock data directly.
  // Server actions will call revalidatePath, and router.refresh() will help update client-side.


  const handleFormSubmit = () => {
    setIsAddModalOpen(false);
    router.refresh();
  };

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    // if (result?.info?.secure_url) {
    //   setImageUrl(result.info.secure_url);
    //   console.log('Upload success:', result.info.secure_url);
    // }
    console.log("hello sir ")
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

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium">Company Logo</label>
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                      <img
                        src={imageUrl}
                        alt="Company logo"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <CldUploadWidget
                    uploadPreset="zawa-soler"
                    options={{
                      cloudName: 'dojbopnb7',
                      multiple: false,
                      sources: ['local', 'url', 'camera'],
                      maxFiles: 1
                    }}
                    onSuccess={handleUploadSuccess}
                    onError={(error) => {
                      console.error("Upload error:", error);
                    }}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                      >
                        {imageUrl ? 'Change Image' : 'Upload Image'}
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>

              <CompanyForm onFormSubmit={handleFormSubmit} imageUrl={imageUrl} />
            </div>

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
          <CompanyTable />
        </CardContent>
      </Card>
    </div>
  );
}
