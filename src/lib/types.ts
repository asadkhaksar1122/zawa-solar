export interface CompanyCategory {
  id: string;
  name: string;
}

export interface SolarSolution {
  id: string;
  name: string;
  company: string; // Could be an ID referencing a CompanyCategory or just a string
  companyId: string;
  description: string;
  imageUrl: string;
  // Add other relevant attributes like power_output, efficiency, warranty, price_range etc.
  powerOutput?: string;
  efficiency?: string;
  features?: string[];
  warranty?: string; // Added warranty field
}
