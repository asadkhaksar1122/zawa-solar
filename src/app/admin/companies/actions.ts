
'use server';

import { Company } from '@/lib/models/company';
import { dbConnect } from '@/lib/mongodb';
import type { Company as companytype } from '@/lib/types';
import { revalidatePath } from 'next/cache';
// In a real app, you'd interact with a database here.
// For this prototype, we simulate with console logs and revalidation.
// Note: Modifying the companies array directly in @/lib/data.ts won't persist across requests in a serverless environment.
// This is a simplified example for prototyping.

export async function addCompany(formData: FormData): Promise<{ success: boolean; message: string; }> {
  const newCompany: companytype = {
    _id: `comp-${Date.now()}`, // Temporary ID
    name: formData.get('name') as string,
    logoUrl: formData.get('logoUrl') as string || undefined,
  };

  console.log('Adding company:', newCompany);
  // Simulate database operation: In a real app, you'd add this to companies array/DB.
  // For prototype, this action doesn't modify the in-memory @/lib/data.ts directly in a persistent way.

  revalidatePath('/admin/companies');
  revalidatePath('/admin/solutions'); // Solutions form uses companies
  return { success: true, message: 'Company added successfully (simulated).', };
}

export async function updateCompany(companyId: string, formData: FormData): Promise<{ success: boolean; message: string; company?: companytype }> {
  const updatedCompanyData: Partial<companytype> = {
    name: formData.get('name') as string,
    logoUrl: formData.get('logoUrl') as string || undefined,
  };

  console.log(`Updating company ${companyId}:`, updatedCompanyData);
  // Simulate database operation

  revalidatePath('/admin/companies');
  revalidatePath('/admin/solutions');
  return { success: true, message: 'Company updated successfully (simulated).', company: { _id: companyId, ...updatedCompanyData } as companytype };
}


export async function deleteCompany(companyId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Deleting company:', companyId);

    await dbConnect(); // Ensure database connection

    const deletedCompany = await Company.findByIdAndDelete(companyId);

    if (!deletedCompany) {
      return { success: false, message: 'Company not found.' };
    }

    // Revalidate any static paths depending on company data
    revalidatePath('/admin/companies');
    revalidatePath('/admin/solutions');

    return { success: true, message: 'Company deleted successfully.' };
  } catch (error: any) {
    console.error('Error deleting company:', error);
    return { success: false, message: 'Error deleting company: ' + error.message };
  }
}
