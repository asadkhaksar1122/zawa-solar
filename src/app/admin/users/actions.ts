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
    await dbConnect();

    const normalized = validatedFields.data.email.trim().toLowerCase();

    // Find the user to check role and verification status
    const user = await UserModel.findOne({ email: normalized });
    if (!user) {
      return { success: false, message: `User with email ${validatedFields.data.email} not found.` };
    }

    // If already admin, do not proceed
    if (user.role === 'admin') {
      return { success: false, message: `User with email ${validatedFields.data.email} is already an admin.` };
    }

    // If email not verified, do not promote
    if (!user.isEmailVerified) {
      return { success: false, message: `Email for ${validatedFields.data.email} is not verified. Please verify the email before granting admin privileges.` };
    }

    // Promote to admin
    const updateduser = await UserModel.findOneAndUpdate(
      { email: normalized },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (!updateduser) {
      return { success: false, message: `Failed to grant admin privileges to ${validatedFields.data.email}.` };
    }

    revalidatePath('/admin/users'); // update any cached admin listings

    return { success: true, message: `Admin privileges granted to ${validatedFields.data.email}.` };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0].message };
    } else {
      console.error('Error in makeUserAdminAction:', error);
      return { success: false, message: 'An unexpected error occurred while processing the request.' };
    }

  }

}


export async function makeadmin(email: string) {
  try {
    console.log("making admin");
    await dbConnect();

    const normalized = email?.trim().toLowerCase();
    if (!normalized) {
      return { success: false, message: "Email is required." };
    }
    // Find the user first so we can check role and verification status
    const user = await UserModel.findOne({ email: normalized });

    if (!user) {
      return { success: false, message: `User with email ${email} not found.` };
    }

    // If user is already an admin, inform the caller
    if (user.role === 'admin') {
      return { success: false, message: `User with email ${email} is already an admin.` };
    }

    // If user's email is not verified, do not promote
    if (!user.isEmailVerified) {
      return { success: false, message: `Email for ${email} is not verified. Please verify the email before granting admin privileges.` };
    }

    // Passed checks — promote to admin
    const result = await UserModel.updateOne(
      { email: normalized },
      { $set: { role: "admin" } },
      { upsert: false }
    );

    console.log("update result:", result);

    if (result.matchedCount === 0) {
      return { success: false, message: `User with email ${email} not found.` };
    }

    return { success: true, message: `Admin privileges granted to ${email}.` };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error in making admin." };
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
