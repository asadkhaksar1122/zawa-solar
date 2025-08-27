'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { Menu, UserCircle, LogOut, Pen, Eye, EyeOff, KeyRound, LayoutGrid, Users, Mail, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChangePasswordDialog } from './changepassword';
import { useSiteBranding, useSystemSettings } from '@/contexts/SettingsContext';


// ---------------- CHANGE NAME SCHEMA ----------------
const changeNameSchema = z.object({
  newName: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  password: z.string().min(1, 'Password is required'),
});

type ChangeNameFormValues = z.infer<typeof changeNameSchema>;





// ---------------- MAIN HEADER ----------------
export function UserHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const isLoadingSession = status === 'loading';
  const { enableRegistration } = useSystemSettings();

  // State for dialogs
  const [isChangeNameDialogOpen, setIsChangeNameDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form for changing name
  const form = useForm<ChangeNameFormValues>({
    resolver: zodResolver(changeNameSchema),
    defaultValues: {
      newName: session?.user?.name || '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (session?.user?.name) form.setValue('newName', session.user.name);
  }, [session?.user?.name, form]);

  const onSubmitChangeName = async (data: ChangeNameFormValues) => {
    setIsSubmitting(true); setError(null); setSuccess(null);
    try {
      const response = await fetch('/api/user/change-name', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update name');

      await update({ name: data.newName });
      router.refresh();

      setSuccess('Name updated successfully!');
      form.reset({ newName: data.newName, password: '' });
      setTimeout(() => { setIsChangeNameDialogOpen(false); setSuccess(null); }, 1500);

    } catch (error: any) {
      setError(error.message || 'Error updating your name');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Solutions', icon: LayoutGrid, activeCondition: () => pathname === '/' || pathname.startsWith('/solutions') },
    { href: '/about', label: 'About Us', icon: Users, activeCondition: () => pathname === '/about' },
    { href: '/contact', label: 'Contact', icon: Mail, activeCondition: () => pathname === '/contact' },
    { href: '/privacy', label: 'Privacy Policy', icon: Eye, activeCondition: () => pathname === '/privacy' },
    { href: '/terms', label: 'Term', icon: FileText, activeCondition: () => pathname === '/terms' },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: '/' });
    router.push('/');
    router.refresh();
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Logo iconSize={40} textSize="text-lg sm:text-xl md:text-2xl" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2 overflow-x-auto">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" asChild
              className={cn('hover:bg-primary/10 flex-shrink-0', link.activeCondition() && 'text-primary font-semibold bg-primary/5')}>
              <Link href={link.href} aria-current={link.activeCondition() ? 'page' : undefined}>{link.label}</Link>
            </Button>
          ))}
          <div className="mx-2 h-6 border-l" />
          {isLoadingSession ? (
            <div className="flex gap-2"><div className="h-8 w-20 animate-pulse bg-muted rounded-md"></div><div className="h-8 w-20 animate-pulse bg-muted rounded-md"></div></div>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || ''} />
                    <AvatarFallback>{session.user.name?.charAt(0).toUpperCase() || <UserCircle />}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6 p-0"
                        onClick={() => setIsChangeNameDialogOpen(true)}>
                        <Pen className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsChangePasswordDialogOpen(true)}>
                  <KeyRound className="mr-2 h-4 w-4" />
                  <span>Change Password</span>
                </DropdownMenuItem>
                {(session?.user as any)?.role === "admin" && (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Admin Page</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              {enableRegistration && (
                <Button variant="default" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              )}
            </>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon"><Menu className="h-6 w-6" /><span className="sr-only">Menu</span></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
              <SheetHeader className="p-4 border-b"><SheetTitle><Logo iconSize={40} textSize="text-xl" /></SheetTitle></SheetHeader>
              <div className="flex-grow overflow-y-auto">
                <nav className="flex flex-col gap-1 p-4">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link href={link.href} className={cn('flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium whitespace-nowrap', link.activeCondition() && 'bg-muted text-primary')}>
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
              <Separator />
              <div className="p-4 space-y-2">
                {isLoadingSession ? (
                  <div className="space-y-2"><div className="h-10 w-full animate-pulse bg-muted rounded-md"></div><div className="h-10 w-full animate-pulse bg-muted rounded-md"></div></div>
                ) : session?.user ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{session.user.name}</p>
                          <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0"
                          onClick={() => setIsChangeNameDialogOpen(true)}>
                          <Pen className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setIsChangePasswordDialogOpen(true)}><KeyRound className="h-4 w-4" /><span>Change Password</span></Button>
                    {(session?.user as any)?.role === "admin" && (
                      <SheetClose asChild><Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push('/admin')}><UserCircle className="h-4 w-4" /><span>Admin Page</span></Button></SheetClose>
                    )}
                    <SheetClose asChild>
                      <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleSignOut}><LogOut className="h-4 w-4" /><span>Log Out</span></Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild><Button variant="outline" className="w-full" asChild><Link href="/auth/login">Login</Link></Button></SheetClose>
                    {enableRegistration && (
                      <SheetClose asChild><Button className="w-full" asChild><Link href="/auth/signup">Sign Up</Link></Button></SheetClose>
                    )}
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Change Name Dialog */}
      <Dialog open={isChangeNameDialogOpen} onOpenChange={setIsChangeNameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Your Name</DialogTitle>
            <DialogDescription>Enter your new name and password to update profile.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitChangeName)} className="space-y-4">
              <FormField control={form.control} name="newName" render={({ field }) => (
                <FormItem><FormLabel>New Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} {...field} />
                      <Button type="button" variant="ghost" size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => { setIsChangeNameDialogOpen(false); form.reset(); }}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Update Name"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <ChangePasswordDialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen} />
    </header>
  );
}
