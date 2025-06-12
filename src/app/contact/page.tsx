
'use client';

import { UserHeader } from '@/components/user/Header';
import { UserFooter } from '@/components/user/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow py-12 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <section className="text-center mb-12 md:mb-16">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;re here to help! Reach out to us through any of the methods below, or visit us at our office.
            </p>
          </section>

          <div className="grid md:grid-cols-3 gap-8 mb-12 md:mb-16">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
              <CardHeader className="items-center text-center pt-6">
                <div className="p-3 bg-green-500 rounded-full inline-block mb-3 shadow-md">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-headline text-xl">WhatsApp</CardTitle>
                <CardDescription>Chat with us directly</CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-grow flex flex-col justify-between">
                <p className="mb-6 text-muted-foreground text-sm">Typically replies within minutes.</p>
                <Button asChild size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <Link href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                    Start Chat
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
              <CardHeader className="items-center text-center pt-6">
                 <div className="p-3 bg-blue-500 rounded-full inline-block mb-3 shadow-md">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-headline text-xl">Email Us</CardTitle>
                <CardDescription>Send us an email</CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-grow flex flex-col justify-between">
                <p className="mb-6 text-muted-foreground text-sm">We aim to respond within 24 hours.</p>
                <Button asChild size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  <Link href="mailto:contact@zawaenergy.com">
                    Send Email
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
              <CardHeader className="items-center text-center pt-6">
                <div className="p-3 bg-primary rounded-full inline-block mb-3 shadow-md">
                  <Phone className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="font-headline text-xl">Call Us</CardTitle>
                <CardDescription>Speak to our team</CardDescription>
              </CardHeader>
              <CardContent className="text-center flex-grow flex flex-col justify-between">
                <p className="mb-6 text-muted-foreground text-sm">Mon-Fri, 9am - 5pm.</p>
                <Button asChild size="lg" className="w-full">
                  <Link href="tel:+1234567890">
                    Call +1 (234) 567-890
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <section className="text-center">
             <h2 className="font-headline text-3xl font-semibold mb-4">Visit Our Office</h2>
             <address className="text-muted-foreground max-w-xl mx-auto mb-8 not-italic">
                123 Solar Street, Energy City, EC 12345, Powerland
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
