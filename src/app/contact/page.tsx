
'use client';

import { UserHeader } from '@/components/user/Header';
import { UserFooter } from '@/components/user/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MessageCircle, Facebook, MapPin, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetContactSettingsQuery } from '@/lib/redux/api/contactApi';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactPage() {
  const { data: contactSettings, isLoading, error } = useGetContactSettingsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-grow py-12 md:py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-12" />
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="items-center text-center pt-6">
                    <Skeleton className="h-14 w-14 rounded-full mb-3" />
                    <Skeleton className="h-6 w-1/2 mb-1" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardHeader>
                  <CardContent className="text-center">
                    <Skeleton className="h-4 w-3/4 mb-6 mx-auto" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-8 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-5 w-1/2 mx-auto mb-8" />
            <Skeleton className="aspect-video max-w-4xl mx-auto rounded-lg" />
          </div>
        </main>
        <UserFooter />
      </div>
    );
  }

  if (error || !contactSettings) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-grow py-12 md:py-20 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="font-headline text-3xl font-bold mb-4">Error Loading Contact Information</h1>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t load the contact details at the moment. Please try again later.
            </p>
          </div>
        </main>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow py-12 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <section className="text-center mb-12 md:mb-16">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;re here to help! Reach out to us through any of the methods below, or visit us.
            </p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {contactSettings.whatsappNumbers.length > 0 && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
                <CardHeader className="items-center text-center pt-6">
                  <div className="p-3 bg-green-500 rounded-full inline-block mb-3 shadow-md">
                    <MessageCircle className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="font-headline text-xl">WhatsApp</CardTitle>
                  <CardDescription>Chat with us directly</CardDescription>
                </CardHeader>
                <CardContent className="text-center flex-grow flex flex-col justify-between">
                  <div className="space-y-2 mb-6">
                  {contactSettings.whatsappNumbers.map(wa => (
                    <Button key={wa.id} asChild size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <Link href={`https://wa.me/${wa.value.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                        Chat on {wa.value}
                      </Link>
                    </Button>
                  ))}
                  </div>
                  <p className="text-muted-foreground text-xs">Typically replies within minutes.</p>
                </CardContent>
              </Card>
            )}

            {contactSettings.emailAddresses.length > 0 && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
                <CardHeader className="items-center text-center pt-6">
                   <div className="p-3 bg-blue-500 rounded-full inline-block mb-3 shadow-md">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="font-headline text-xl">Email Us</CardTitle>
                  <CardDescription>Send us an email</CardDescription>
                </CardHeader>
                <CardContent className="text-center flex-grow flex flex-col justify-between">
                  <div className="space-y-2 mb-6">
                  {contactSettings.emailAddresses.map(email => (
                    <Button key={email.id} asChild size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                      <Link href={`mailto:${email.value}`}>
                        Email {email.value}
                      </Link>
                    </Button>
                  ))}
                  </div>
                   <p className="text-muted-foreground text-xs">We aim to respond within 24 hours.</p>
                </CardContent>
              </Card>
            )}

            {contactSettings.phoneNumbers.length > 0 && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
                <CardHeader className="items-center text-center pt-6">
                  <div className="p-3 bg-primary rounded-full inline-block mb-3 shadow-md">
                    <Phone className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="font-headline text-xl">Call Us</CardTitle>
                  <CardDescription>Speak to our team</CardDescription>
                </CardHeader>
                <CardContent className="text-center flex-grow flex flex-col justify-between">
                  <div className="space-y-2 mb-6">
                    {contactSettings.phoneNumbers.map(phone => (
                      <Button key={phone.id} asChild size="lg" className="w-full">
                        <Link href={`tel:${phone.value}`}>
                          Call {phone.value}
                        </Link>
                      </Button>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-xs">Mon-Fri, 9am - 5pm.</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12 md:mb-16">
            {contactSettings.facebookUrl && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                <CardHeader className="items-center text-center pt-6">
                    <div className="p-3 bg-indigo-500 rounded-full inline-block mb-3 shadow-md">
                    <Facebook className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="font-headline text-xl">Facebook</CardTitle>
                    <CardDescription>Follow us on Facebook</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <Button asChild size="lg" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                    <Link href={contactSettings.facebookUrl} target="_blank" rel="noopener noreferrer">
                        Visit our Page
                    </Link>
                    </Button>
                </CardContent>
                </Card>
            )}

            {contactSettings.officeAddress && (
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                <CardHeader className="items-center text-center pt-6">
                    <div className="p-3 bg-orange-500 rounded-full inline-block mb-3 shadow-md">
                    <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="font-headline text-xl">Our Office</CardTitle>
                    <CardDescription>Find us at our location</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <address className="text-muted-foreground mb-4 not-italic">
                        {contactSettings.officeAddress}
                    </address>
                    <Button asChild variant="outline" size="lg" className="w-full">
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactSettings.officeAddress)}`} target="_blank" rel="noopener noreferrer">
                            Get Directions
                        </Link>
                    </Button>
                </CardContent>
                </Card>
            )}
          </div>


          <section className="text-center">
             <h2 className="font-headline text-3xl font-semibold mb-4">Visit Our Office Location</h2>
             <address className="text-muted-foreground max-w-xl mx-auto mb-8 not-italic">
                {contactSettings.officeAddress || 'Address not available.'}
             </address>
             <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-xl border">
                <Image
                    src="https://placehold.co/1200x675.png"
                    alt="Map placeholder showing office location"
                    width={1200}
                    height={675}
                    className="w-full h-full object-cover"
                    data-ai-hint="city map location"
                />
             </div>
          </section>
        </div>
      </main>
      <UserFooter />
    </div>
  );
}
