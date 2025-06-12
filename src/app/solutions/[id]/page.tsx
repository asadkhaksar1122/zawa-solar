
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { UserHeader } from '@/components/user/Header';
import { UserFooter } from '@/components/user/Footer';
import { useGetSolutionByIdQuery } from '@/lib/redux/api/solutionsApi';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Zap, Tag, ShieldCheck, CheckCircle, Building2, AlertTriangle } from 'lucide-react';

export default function SolutionDetailPage() {
  const params = useParams();
  const solutionId = params?.id as string;

  const { data: solution, error, isLoading } = useGetSolutionByIdQuery(solutionId, {
    skip: !solutionId, // Skip query if no ID is present
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-grow py-12 md:py-20">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-8" /> {/* Back button skeleton */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <Skeleton className="aspect-video w-full rounded-lg shadow-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" /> {/* Title */}
                <Skeleton className="h-6 w-1/2" /> {/* Company */}
                <Skeleton className="h-20 w-full" /> {/* Description */}
                <div className="space-y-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <Skeleton className="h-16 w-full" /> {/* Features */}
              </div>
            </div>
          </div>
        </main>
        <UserFooter />
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-grow py-12 md:py-20 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="font-headline text-3xl font-bold mb-4">Solution Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error ? 'There was an error loading the solution details.' : 'The solar solution you are looking for does not exist or could not be loaded.'}
            </p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Solutions
              </Link>
            </Button>
          </div>
        </main>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow py-12 md:py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <Button variant="outline" asChild className="mb-8 group shadow-sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Solutions
            </Link>
          </Button>

          <Card className="overflow-hidden shadow-xl rounded-xl">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto">
                <Image
                  src={solution.imageUrl}
                  alt={solution.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-l-xl"
                  data-ai-hint="solar panel product shot"
                />
              </div>
              <div className="md:col-span-3">
                <CardHeader className="p-6 md:p-8">
                  <CardTitle className="font-headline text-3xl md:text-4xl mb-2">{solution.name}</CardTitle>
                  <CardDescription className="text-lg text-muted-foreground flex items-center">
                    <Building2 className="mr-2 h-5 w-5 text-primary" />
                    By {solution.company}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 pt-0 space-y-6">
                  <p className="text-base md:text-lg text-foreground/80 leading-relaxed">{solution.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t">
                    {solution.powerOutput && (
                      <div className="flex items-center text-base">
                        <Zap className="mr-3 h-5 w-5 text-accent flex-shrink-0" />
                        <div>
                          <span className="font-semibold">Power Output: </span>
                          {solution.powerOutput}
                        </div>
                      </div>
                    )}
                    {solution.efficiency && (
                      <div className="flex items-center text-base">
                        <Tag className="mr-3 h-5 w-5 text-accent flex-shrink-0" />
                        <div>
                          <span className="font-semibold">Efficiency: </span>
                          {solution.efficiency}
                        </div>
                      </div>
                    )}
                    {solution.warranty && (
                      <div className="flex items-center text-base col-span-1 sm:col-span-2">
                        <ShieldCheck className="mr-3 h-5 w-5 text-accent flex-shrink-0" />
                        <div>
                          <span className="font-semibold">Warranty: </span>
                          {solution.warranty}
                        </div>
                      </div>
                    )}
                  </div>

                  {solution.features && solution.features.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="font-headline text-xl font-semibold mb-3">Key Features</h3>
                      <ul className="space-y-2">
                        {solution.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-base">
                            <CheckCircle className="mr-3 h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="pt-6">
                     <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                        Request a Quote
                     </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <UserFooter />
    </div>
  );
}
