
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
import { motion } from "framer-motion";
import Link from 'next/link';
import { useGetSolutionsQuery } from '@/lib/redux/api/solutionsApi';
import { useGetCompaniesQuery } from '@/lib/redux/api/companiesApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useSiteBranding, useMaintenanceMode } from '@/contexts/SettingsContext';


const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
export default function HomePage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get website settings
  const { siteName, siteDescription } = useSiteBranding();
  const { isMaintenanceMode, maintenanceMessage } = useMaintenanceMode();

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

  // Show maintenance mode if enabled
  if (isMaintenanceMode) {
    return (
      <div className="flex flex-col min-h-screen">
        <UserHeader />
        <main className="flex-grow flex items-center justify-center bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto bg-background rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Maintenance Mode</h1>
                <p className="text-muted-foreground">
                  {maintenanceMessage}
                </p>
              </div>
            </div>
          </div>
        </main>
        <UserFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary to-blue-400 text-primary-foreground">
          <div className="absolute inset-0">
            <Image
              src="https://i.pinimg.com/736x/11/87/0f/11870f17a2386a6f021649c40b68fd16.jpg"
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
              Power Your Future with {siteName}
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {siteDescription}
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
                      <SolarSolutionCard key={solution._id} solution={solution} />
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
        <motion.section
          id="about"
          className="relative py-20 sm:py-24 bg-muted/30 overflow-hidden"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {/* Soft animated glow orbs */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-400/30 blur-3xl"
            animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-sky-400/25 blur-3xl"
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Subtle grid overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.18] dark:opacity-[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.25)_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <motion.div className="container mx-auto px-4" variants={stagger}>
            <motion.div
              className="mx-auto max-w-3xl text-center relative rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-8 sm:p-10"
              variants={fadeUp}
            >
              {/* Small pill badge */}
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border bg-white/60 dark:bg-white/10 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur"
                variants={fadeUp}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Clean energy for everyone
              </motion.span>

              <motion.h2
                className="font-headline mt-4 text-3xl sm:text-4xl font-semibold tracking-tight"
                variants={fadeUp}
              >
                <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500 bg-clip-text text-transparent">
                  About {siteName}
                </span>
              </motion.h2>

              <motion.p
                className="mt-4 text-muted-foreground leading-relaxed"
                variants={fadeUp}
              >
                We are dedicated to providing accessible and affordable solar energy solutions to help you reduce your carbon footprint and save on energy costs. Our team of experts is passionate about renewable energy and committed to delivering excellence.
              </motion.p>

              <motion.div
                className="mt-6 flex items-center justify-center"
                variants={fadeUp}
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/about" className="group">
                    <Button variant="outline" className="relative overflow-hidden">
                      <span className="relative z-10">Learn More About Us</span>
                      <motion.span
                        className="relative z-10 ml-2 inline-block"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      >
                        →
                      </motion.span>

                      {/* Shine sweep on hover (no custom keyframes needed) */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                      >
                        <span className="absolute -inset-10 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Contact Section (Placeholder) */}
        <motion.section
          id="contact"
          className="relative py-20 sm:py-24 overflow-hidden"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          {/* Animated background glows */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-400/25 blur-3xl"
            animate={{ y: [0, -18, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -left-28 h-96 w-96 rounded-full bg-sky-400/25 blur-3xl"
            animate={{ y: [0, 18, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Subtle grid overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16] dark:opacity-[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.22)_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <motion.div className="container mx-auto px-4" variants={stagger}>
            <motion.div
              className="mx-auto max-w-3xl text-center relative rounded-2xl border bg-white/60 dark:bg-neutral-900/60 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10 p-8 sm:p-10"
              variants={fadeUp}
            >
              {/* Tiny badge */}
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border bg-white/60 dark:bg-white/10 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur"
                variants={fadeUp}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                We reply within 24 hours
              </motion.span>

              <motion.h2
                className="font-headline mt-4 text-3xl sm:text-4xl font-semibold tracking-tight"
                variants={fadeUp}
              >
                <span className="bg-gradient-to-r from-emerald-500 via-amber-500 to-sky-500 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </motion.h2>

              <motion.p
                className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto"
                variants={fadeUp}
              >
                Have questions or need a custom quote? Contact our friendly team today.
              </motion.p>

              <motion.div
                className="mt-6 flex items-center justify-center"
                variants={fadeUp}
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="default"
                    size="lg"
                    className="relative overflow-hidden bg-accent text-accent-foreground hover:bg-accent/90 group"
                    asChild
                  >
                    <Link href="/contact" className="inline-flex items-center gap-2">
                      <span className="relative z-10">Contact Us</span>
                      <motion.span
                        className="relative z-10 inline-block"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      >
                        →
                      </motion.span>

                      {/* Shine sweep on hover */}
                      <span aria-hidden className="pointer-events-none absolute inset-0">
                        <span className="absolute -inset-10 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
                      </span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Small reassurance line */}
              <motion.p
                className="mt-3 text-xs text-muted-foreground"
                variants={fadeUp}
              >
                No hard sales. Just helpful answers.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.section>

      </main>
      <UserFooter />
    </div>
  );
}
