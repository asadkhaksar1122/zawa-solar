export interface Company {
  id: string;
  name: string;
  // Add other relevant fields like logoUrl, description if needed in the future
}

export interface SolarSolution {
  id: string;
  name:string;
  company: string; 
  companyId: string; // This ID should correspond to a Company's id
  description: string;
  imageUrl: string;
  powerOutput?: string;
  efficiency?: string;
  features?: string[];
  warranty?: string;
}

// New types for Contact Settings
export interface ContactItem {
  id: string; // For React keys, can be temp, e.g., uuid or timestamp based
  value: string;
}

export interface ContactSettings {
  whatsappNumbers: ContactItem[];
  emailAddresses: ContactItem[];
  phoneNumbers: ContactItem[];
  facebookUrl: string;
  officeAddress: string;
}