import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const ValuesSection = () => {
    const values = [
        {
            title: "Sustainability",
            description: "We are dedicated to promoting clean, renewable energy solutions that protect our environment for future generations."
        },
        {
            title: "Innovation",
            description: "We continuously strive to improve our technology and services to provide the most efficient solar solutions."
        },
        {
            title: "Customer Focus",
            description: "We prioritize our customers' needs and ensure they receive the highest quality service and support."
        }
    ];

    return (
        <div className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                    Our Core Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <Card key={index} className="border-border/40">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-4 text-foreground">{value.title}</h3>
                                <p className="text-muted-foreground">
                                    {value.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ValuesSection;