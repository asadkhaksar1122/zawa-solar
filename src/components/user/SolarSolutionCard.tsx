
import Image from 'next/image';
import type { SolarSolution } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Zap, CheckCircle, Building2, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface SolarSolutionCardProps {
  solution: SolarSolution;
}

export function SolarSolutionCard({ solution }: SolarSolutionCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="aspect-[3/2] relative w-full">
          <Image
            src={solution.imageUrl}
            alt={solution.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="solar panel"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-2">{solution.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-1 flex items-center">
          <Building2 className="mr-2 h-4 w-4 text-primary" /> {solution.company}
        </CardDescription>
        <p className="text-foreground/80 text-sm mb-4 line-clamp-3">{solution.description}</p>
        
        <div className="space-y-2 text-sm">
          {solution.powerOutput && (
            <div className="flex items-center">
              <Zap className="mr-2 h-4 w-4 text-accent" />
              <span>Power Output: {solution.powerOutput}</span>
            </div>
          )}
          {solution.efficiency && (
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4 text-accent" />
              <span>Efficiency: {solution.efficiency}</span>
            </div>
          )}
          {solution.warranty && (
            <div className="flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4 text-accent" />
              <span>Warranty: {solution.warranty}</span>
            </div>
          )}
          {solution.features && solution.features.length > 0 && (
            <div>
              <h4 className="font-semibold mt-2 mb-1">Features:</h4>
              <ul className="list-none pl-0 space-y-1">
                {solution.features.slice(0,2).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/solutions/${solution._id}`}>
            View Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
