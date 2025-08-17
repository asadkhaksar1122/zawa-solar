import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ContactCTASection = () => {
    return (
        <div className="bg-primary py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6 text-primary-foreground">
                    Ready to Switch to Solar?
                </h2>
                <p className="text-xl mb-8 text-primary-foreground/90">
                    Contact us today for a free consultation
                </p>
                <Button
                    size="lg"
                    variant="secondary"
                    className="font-bold"
                    asChild
                >
                    <Link href="/contact">Get Started</Link>
                </Button>
            </div>
        </div>
    );
};

export default ContactCTASection;