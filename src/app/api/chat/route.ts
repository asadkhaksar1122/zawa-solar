import { NextResponse } from 'next/server';
import axios from 'axios';

interface Solution {
    _id: string;
    name: string;
    company: string;
    companyId: string;
    description: string;
    imageUrl: string;
    powerOutput: string;
    efficiency: string;
    features: string[];
    warranty: string;
}

interface Company {
    _id: string;
    name: string;
}

interface ContactSettings {
    _id: string;
    whatsappNumbers: { value: string; _id: string }[];
    emailAddresses: { value: string; _id: string }[];
    phoneNumbers: { value: string; _id: string }[];
    facebookUrl: string;
    officeAddress: string;
}

interface TeamMember {
    name: string;
    role: string;
    img: string;
    education: string;
    experience: string;
    achievements: string;
}

// Remove dummy data - will fetch from API

async function fetchCompanyData() {
    try {
        // Fetch all data from your APIs with individual error handling
        const [solutionsRes, companiesRes, contactRes, teamMembersRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/solutions`).catch(() => null),
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/companies`).catch(() => null),
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/contact-settings`).catch(() => null),
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/team-member`).catch(() => null)
        ]);

        let solutions = [];
        let companies = [];
        let contact = null;
        let teamMembers = [];

        // Handle solutions
        if (solutionsRes && solutionsRes.ok) {
            const solutionsData = await solutionsRes.json();
            solutions = Array.isArray(solutionsData) ? solutionsData : [];
        }

        // Handle companies with error checking
        if (companiesRes && companiesRes.ok) {
            const companiesData = await companiesRes.json();
            console.log('Raw companies response:', JSON.stringify(companiesData));

            if (companiesData.error) {
                console.log('Companies API returned error:', companiesData.error);
                companies = [];
            } else if (Array.isArray(companiesData)) {
                companies = companiesData;
                console.log('Successfully fetched companies from API:', companies.length);
            } else {
                console.log('Unexpected companies data structure:', companiesData);
                companies = [];
            }
        } else {
            console.log('Companies API failed or not ok:', companiesRes?.status, companiesRes?.statusText);
        }

        // Handle contact
        if (contactRes && contactRes.ok) {
            const contactData = await contactRes.json();
            contact = Array.isArray(contactData) ? contactData[0] : contactData;
        }

        // Handle team members
        if (teamMembersRes && teamMembersRes.ok) {
            const teamMembersData = await teamMembersRes.json();
            teamMembers = Array.isArray(teamMembersData) ? teamMembersData : [];
            console.log('Successfully fetched team members from API:', teamMembers.length);
        } else {
            console.log('Team members API failed or not ok:', teamMembersRes?.status, teamMembersRes?.statusText);
        }

        console.log('Final companies array:', companies);
        console.log('Companies length:', companies?.length);

        return { solutions, companies, contact, teamMembers };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { solutions: [], companies: [], contact: null, teamMembers: [] };
    }
}

function createSystemPrompt(data: any) {
    if (!data) return 'You are a helpful assistant for Zawa Solar Energy.';

    const { solutions, companies, contact, teamMembers } = data;

    console.log('Creating system prompt with companies:', companies);
    console.log('Is companies array?', Array.isArray(companies));
    console.log('Companies data:', JSON.stringify(companies));

    return `You are a helpful assistant for Zawa Solar Energy. Here is the current information about our company:

CONTACT INFORMATION:
- WhatsApp Numbers: ${contact?.whatsappNumbers?.map((w: any) => w.value).join(', ') || 'Not available'}
- Email Addresses: ${contact?.emailAddresses?.map((e: any) => e.value).join(', ') || 'Not available'}
- Phone Numbers: ${contact?.phoneNumbers?.map((p: any) => p.value).join(', ') || 'Not available'}
- Office Address: ${contact?.officeAddress || 'Not available'}
- Facebook: ${contact?.facebookUrl || 'Not available'}

BUSINESS HOURS:
- Office Visiting Hours: Monday to Thursday: 9:00 AM to 6:00 PM, Saturday: 9:00 AM to 6:00 PM
- Friday: Closed
- WhatsApp/Phone Contact Hours: Same as office hours (9:00 AM to 6:00 PM, Monday-Thursday & Saturday)
- Email Response: Available during business hours, but responses may be delayed

OUR TEAM:
${Array.isArray(teamMembers) && teamMembers.length > 0 ? teamMembers.map((member: TeamMember) => `
![${member.name}](${member.img})

**${member.name}** - ${member.role}
- Education: ${member.education || 'Not specified'}
- Experience: ${member.experience || 'Not specified'}
- Achievements: ${member.achievements || 'Not specified'}
`).join('\n---\n') : 'Our team information is currently being updated.'}

TEAM EXPERTISE:
- Combined 20+ years of experience in renewable energy
- Over 500 successful solar installations completed
- 30+ patents in solar innovation
- 99% customer satisfaction rate
- Certified Solar Professionals on staff

COMPANIES WE WORK WITH:
${Array.isArray(companies) && companies.length > 0 ? companies.map((c: Company) => `- ${c.name}`).join('\n') : 'Currently no companies are listed in our database.'}

PRODUCTS/SOLUTIONS:
${Array.isArray(solutions) ? solutions.map((s: Solution) => `
Product: ${s.name}
- Company: ${s.company}
- Description: ${s.description}
- Power Output: ${s.powerOutput}
- Efficiency: ${s.efficiency}
- Features: ${Array.isArray(s.features) ? s.features.join(', ') : 'No features listed'}
- Warranty: ${s.warranty}
`).join('\n---\n') : 'No products listed'}

Instructions:
- Answer questions based on this information
- Be helpful and professional
- Always use Pakistan Standard Time (PST) for any time references
- When someone asks about location, create a Google Maps link using the office address: https://www.google.com/maps/place/Zawa+Solar+Energy+Solution/@34.0607541,72.4641581,18z/data=!3m1!4b1!4m6!3m5!1s0x38dee523b830a255:0x7f549a4c52804c6e!8m2!3d34.0607519!4d72.4654456!16s%2Fg%2F11n7__jxxc?entry=ttu&g_ep=EgoyMDI1MDYyNi4wIKXMDSoASAFQAw%3D%3D
- NEVER mention prices unless specifically asked
- If asked about prices, provide them in Pakistani Rupees (PKR) and ALWAYS add a disclaimer: "Please note: These prices are subject to change and may not be current. Please contact us for the latest pricing."
- When discussing contact hours, emphasize that Friday is closed
- Mention that email responses might be delayed compared to WhatsApp or phone calls
- If someone asks for contact info, provide all relevant details including business hours
- When discussing products, mention key specifications
- When asked about companies, always check the COMPANIES WE WORK WITH section above and list the exact companies shown there
- When asked about the team, provide relevant information about team members, their expertise, and achievements. ALWAYS include the team member images using the exact markdown format shown in the team section above.
- Highlight the team's collective experience and qualifications when relevant
- Keep responses concise but informative
- Always consider the Pakistani context (time zone, currency, working days, etc.)
- When showing team information, always include the team member photos using the markdown image format provided`;
}

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        // Fetch latest company data
        const companyData = await fetchCompanyData();
        const systemPrompt = createSystemPrompt(companyData);

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'deepseek/deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                    'X-Title': 'Zawa Solar Chatbot',
                    'Content-Type': 'application/json'
                }
            }
        );

        return NextResponse.json({
            reply: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to get response' },
            { status: 500 }
        );
    }
}