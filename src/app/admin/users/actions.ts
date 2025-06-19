'use server';

import UserModel from '@/lib/models/user';
import { dbConnect } from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';


const MakeAdminInputSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export async function makeUserAdminAction(
  prevState: { message: string; success: boolean } | null,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const email = formData.get('email') as string;

    const validatedFields = MakeAdminInputSchema.safeParse({ email });

    if (!validatedFields.success) {
      return { success: false, message: 'Invalid email format. Please enter a valid email.' };
    }
    await dbConnect()


    const updateduser = UserModel.findOneAndUpdate({ email: validatedFields.data.email }, { $set: { role: 'admin' } }, { new: true })
    if (!updateduser) {
      return { success: false, message: `User with email ${validatedFields.data.email} not found.` };
    } else {
      console.log(updateduser)
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    } else {
      console.error('Error in makeUserAdminAction:', error);
      return { success: false, message: 'An unexpected error occurred while processing the request.' };
    }

  }

}


export async function makeadmin(Email: string) {
  try {
    console.log("making admin")
    await dbConnect();
    const updateduser = await UserModel.findOneAndUpdate({ email: Email }, { $set: { role: 'admin' } }, { new: true })
    if (!updateduser) {
      return { success: false, message: `User with email ${Email} not found.` };
    } else {
      console.log(updateduser)
      return { success: true, message: `Admin privileges granted to ${Email}.` };
    }
  } catch (error) {
    return { success: false, message: "error in making admin" }
  }
}
export async function removeadmin(id: string) {
  try {
    console.log("removing admin")
    await dbConnect();
    const updateduser = await UserModel.findByIdAndUpdate(id, { $set: { role: 'user' } }, { new: true })
    return { success: true, message: `Admin privileges removed from ${updateduser?.email}.` }
  } catch (error) {
    return { success: false, message: "error in removing admin" }
  }
}
