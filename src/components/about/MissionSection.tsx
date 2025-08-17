import React from "react";
import Image from "next/image";

const MissionSection = () => {
    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            At Zawa Solar Energy Solutions, we are committed to accelerating
                            the world&apos;s transition to sustainable energy. We provide
                            innovative solar solutions that help businesses and homeowners
                            reduce their carbon footprint while saving on energy costs.
                        </p>
                    </div>
                    <div className="relative h-[400px] rounded-lg overflow-hidden border border-border">
                        <Image
                            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=60"
                            alt="Solar Panels Installation"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionSection;