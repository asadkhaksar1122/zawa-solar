
'use client';

import { useState, useMemo } from 'react';
import { UserHeader } from '@/components/user/Header';
import { UserFooter } from '@/components/user/Footer';
import { SolarSolutionCard } from '@/components/user/SolarSolutionCard';
import { FilterPanel } from '@/components/user/FilterPanel';
import type { SolarSolution, Company } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetSolutionsQuery } from '@/lib/redux/api/solutionsApi';
import { useGetCompaniesQuery } from '@/lib/redux/api/companiesApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function HomePage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: solarSolutionsData, isLoading: isLoadingSolutions, error: solutionsError } = useGetSolutionsQuery();
  const { data: companiesData, isLoading: isLoadingCompanies, error: companiesError } = useGetCompaniesQuery();

  const solarSolutions: SolarSolution[] = solarSolutionsData || [];
  const companyList: Company[] = companiesData || [];

  const filteredSolutions = useMemo(() => {
    if (isLoadingSolutions) return [];
    return solarSolutions.filter(solution => {
      const matchesCategory = selectedCompanyId ? solution.companyId === selectedCompanyId : true;
      const matchesSearch = searchTerm
        ? solution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          solution.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          solution.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [selectedCompanyId, searchTerm, solarSolutions, isLoadingSolutions]);

  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary to-blue-400 text-primary-foreground">
          <div className="absolute inset-0">
            <Image
              src="https://placehold.co/1920x1080.png"
              alt="Solar panels background"
              fill 
              objectFit="cover"
              className="opacity-30"
              data-ai-hint="solar panels landscape"
              priority
            />
          </div>
          <div className="container relative z-10 mx-auto text-center px-4">
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Power Your Future with Zawa Energy
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Discover top-tier solar solutions tailored to your needs. Clean, reliable, and sustainable energy starts here.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Explore Solutions
            </Button>
          </div>
        </section>

        {/* Solutions Catalog Section */}
        <section id="solutions" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl font-semibold text-center mb-4">Our Solar Solutions</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Browse our curated selection of high-quality solar panels and systems from leading manufacturers.
            </p>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                {isLoadingCompanies ? (
                  <Card>
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                  </Card>
                ) : companiesError ? (
                   <p className="text-destructive">Failed to load companies.</p>
                ) : (
                  <FilterPanel
                    categories={companyList}
                    selectedCategory={selectedCompanyId}
                    onCategoryChange={setSelectedCompanyId}
                  />
                )}
              </div>
              <div className="md:col-span-3">
                <div className="mb-8 relative">
                  <Input
                    type="text"
                    placeholder="Search solutions by name, company, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-base"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                {isLoadingSolutions ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <Card key={index}>
                        <Skeleton className="aspect-[3/2] w-full" />
                        <CardContent className="p-6 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                           <Skeleton className="h-10 w-full" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : solutionsError ? (
                  <div className="text-center py-10">
                    <p className="text-xl text-destructive">Failed to load solar solutions.</p>
                  </div>
                ) : filteredSolutions.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSolutions.map((solution) => (
                      <SolarSolutionCard key={solution.id} solution={solution} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xl text-muted-foreground">No solutions match your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section (Placeholder) */}
        <section id="about" className="py-16 bg-muted/30">
          <div className="container mx-auto text-center px-4">
            <h2 className="font-headline text-3xl font-semibold mb-4">About Zawa Energy Hub</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              We are dedicated to providing accessible and affordable solar energy solutions to help you reduce your carbon footprint and save on energy costs. Our team of experts is passionate about renewable energy and committed to delivering excellence.
            </p>
            <Button variant="outline">Learn More About Us</Button>
          </div>
        </section>

        {/* Contact Section (Placeholder) */}
        <section id="contact" className="py-16">
          <div className="container mx-auto text-center px-4">
            <h2 className="font-headline text-3xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Have questions or need a custom quote? Contact our friendly team today.
            </p>
            <Button variant="default" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>

      </main>
      <UserFooter />
    </div>
  );
}
