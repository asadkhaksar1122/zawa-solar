'use server';

import type { SolarSolution } from '@/lib/types';
import { revalidatePath } from 'next/cache';
// In a real app, you'd interact with a database here.
// For now, we'll simulate with console logs and revalidation.

export async function addSolarSolution(formData: FormData): Promise<{ success: boolean; message: string; solution?: SolarSolution }> {
  // Simulate data processing
  const newSolution: SolarSolution = {
    id: `sol-${Date.now()}`, // Temporary ID
    name: formData.get('name') as string,
    company: formData.get('company') as string,
    companyId: formData.get('companyId') as string,
    description: formData.get('description') as string,
    imageUrl: formData.get('imageUrl') as string || 'https://placehold.co/600x400.png', // Default placeholder
    powerOutput: formData.get('powerOutput') as string || undefined,
    efficiency: formData.get('efficiency') as string || undefined,
    features: (formData.get('features') as string)?.split(',').map(f => f.trim()) || undefined,
  };

  console.log('Adding solar solution:', newSolution);
  // Simulate database operation
  // solarSolutions.push(newSolution); // This won't work on server component without actual DB

  revalidatePath('/admin/solutions');
  revalidatePath('/'); // Also revalidate user page
  return { success: true, message: 'Solar solution added successfully.', solution: newSolution };
}

export async function updateSolarSolution(solutionId: string, formData: FormData): Promise<{ success: boolean; message: string; solution?: SolarSolution }> {
   const updatedSolution: Partial<SolarSolution> = {
    name: formData.get('name') as string,
    company: formData.get('company') as string,
    companyId: formData.get('companyId') as string,
    description: formData.get('description') as string,
    imageUrl: formData.get('imageUrl') as string || undefined,
    powerOutput: formData.get('powerOutput') as string || undefined,
    efficiency: formData.get('efficiency') as string || undefined,
    features: (formData.get('features')as string)?.split(',').map(f => f.trim()) || undefined,
  };
  
  console.log(`Updating solar solution ${solutionId}:`, updatedSolution);
  // Simulate database operation
  // const index = solarSolutions.findIndex(s => s.id === solutionId);
  // if (index !== -1) solarSolutions[index] = { ...solarSolutions[index], ...updatedSolution };


  revalidatePath('/admin/solutions');
  revalidatePath('/');
  return { success: true, message: 'Solar solution updated successfully.', solution: {id: solutionId, ...updatedSolution} as SolarSolution };
}

export async function deleteSolarSolution(solutionId: string): Promise<{ success: boolean; message: string }> {
  console.log('Deleting solar solution:', solutionId);
  // Simulate database operation
  // solarSolutions = solarSolutions.filter(s => s.id !== solutionId);

  revalidatePath('/admin/solutions');
  revalidatePath('/');
  return { success: true, message: 'Solar solution deleted successfully.' };
}
