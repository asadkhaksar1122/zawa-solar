'use server';

import { revalidatePath } from 'next/cache';
import * as z from 'zod';

const MakeAdminInputSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export async function makeUserAdminAction(
  prevState: { message: string; success: boolean } | null,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const email = formData.get('email') as string;

  const validatedFields = MakeAdminInputSchema.safeParse({ email });

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid email format. Please enter a valid email.' };
  }

  // --- Placeholder for actual admin granting logic ---
  // In a real application, you would:
  // 1. Find the user by email in your database.
  // 2. If found, update their role/permissions to 'admin'.
  //    - This might involve checking if they are already an admin.
  // 3. If not found, you might:
  //    a. Return an error "User not found."
  //    b. Or, if the intent is to invite, handle that flow.
  //
  // For this prototype, we'll just log the action and simulate success.
  // This does NOT actually modify user roles in the current NextAuth setup.
  console.log(`Simulating: Granting admin privileges to user with email: ${validatedFields.data.email}`);
  // --- End of Placeholder ---

  revalidatePath('/admin/users'); // In case we list admins on this page later

  return { success: true, message: `Admin privileges request for ${validatedFields.data.email} processed (simulated).` };
}
