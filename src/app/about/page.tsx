"use client"
import React from "react";
import { UserHeader } from "@/components/user/Header";
import {
    HeroSection,
    MissionSection,
    ValuesSection,
    TeamSection,
    ContactCTASection
} from "@/components/about";

const About = () => {
    const teamMembers = [
        {
            name: "Wahid Amin",
            role: "CEO",
            img: "/wahid.png",
            email: "john.smith@zawasolar.com",
            linkedin: "linkedin.com/in/johnsmith",
            education: "Master in te renewable energy, ",
            experience: "10+ years in renewable energy",
            achievements: "Led 500+ solar installations"
        },
        {
            name: "Umair Khan",
            role: "Senior Manager",
            img: "/umair.png",
            email: "sarah.johnson@zawasolar.com",
            linkedin: "linkedin.com/in/sarahjohnson",
            education: "B-tech in the civil engineering",
            experience: "12+ years in solar technology",
            achievements: "30+ patents in solar innovation"
        },
        {
            name: "Sohaib Hassan",
            role: "Lead Engineer",
            img: "/sohaibhassan.jpg",
            email: "michael.chen@zawasolar.com",
            linkedin: "linkedin.com/in/michaelchen",
            education: "Diploma in the electrical engineering,",
            experience: "1+ years in system design",
            achievements: "Certified Solar Professional (CSP)"
        },
        {
            name: "Asad Khan",
            role: "Techninal Manager",
            img: "/asadimg.jpg",
            email: "emily.brown@zawasolar.com",
            linkedin: "linkedin.com/in/emilybrown",
            education: "The software engineer ",
            experience: "1 year experience ",
            achievements: "99% customer satisfaction rate"
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <UserHeader />
            <HeroSection />
            <MissionSection />
            <ValuesSection />
            <TeamSection teamMembers={teamMembers} />
            <ContactCTASection />
        </div>
    );
};

export default About;