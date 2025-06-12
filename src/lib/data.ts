import type { SolarSolution, Company, ContactSettings } from './types';

export const companies: Company[] = [
  { id: 'comp1', name: 'SunPower' },
  { id: 'comp2', name: 'LG Solar' },
  { id: 'comp3', name: 'Panasonic' },
  { id: 'comp4', name: 'Canadian Solar' },
  { id: 'comp5', name: 'Trina Solar' },
  // Add a new example company
  { id: 'comp6', name: 'JA Solar' },
];

export const solarSolutions: SolarSolution[] = [
  {
    id: 'sol1',
    name: 'Maxeon 3 Series Panel',
    company: 'SunPower',
    companyId: 'comp1',
    description: 'High-efficiency residential solar panel known for durability and performance.',
    imageUrl: 'https://placehold.co/600x400.png',
    powerOutput: '400W',
    efficiency: '22.6%',
    features: ['Industry-leading efficiency', 'Sleek design'],
    warranty: '25-year product & performance',
  },
  {
    id: 'sol2',
    name: 'NeON R ACe Solar Panel',
    company: 'LG Solar',
    companyId: 'comp2',
    description: 'Premium solar module with integrated microinverter for optimized energy production.',
    imageUrl: 'https://placehold.co/600x400.png',
    powerOutput: '375W',
    efficiency: '21.7%',
    features: ['Built-in microinverter', 'Enhanced performance in low light', 'Robust frame'],
    warranty: '25-year product & performance',
  },
  {
    id: 'sol3',
    name: 'EverVolt EVPV370 Panel',
    company: 'Panasonic',
    companyId: 'comp3',
    description: 'High-performance solar panel with all-black aesthetics and superior temperature coefficient.',
    imageUrl: 'https://placehold.co/600x400.png',
    powerOutput: '370W',
    efficiency: '21.2%',
    features: ['All-black design', 'Triple-guard warranty', 'Excellent heat tolerance'],
    warranty: '25-year AllGuard warranty',
  },
  {
    id: 'sol4',
    name: 'HiKu6 CS6W Panel',
    company: 'Canadian Solar',
    companyId: 'comp4',
    description: 'Cost-effective and reliable solar panel for large-scale and residential projects.',
    imageUrl: 'https://placehold.co/600x400.png',
    powerOutput: '545W',
    efficiency: '21.3%',
    features: ['High power output', 'LID/LeTID mitigation', 'Suitable for diverse applications'],
    warranty: '12-year product, 25-year performance',
  },
  {
    id: 'sol5',
    name: 'Vertex S Series',
    company: 'Trina Solar',
    companyId: 'comp5',
    description: 'Advanced solar panel technology delivering high power density and aesthetic appeal.',
    imageUrl: 'https://placehold.co/600x400.png',
    powerOutput: '405W',
    efficiency: '21.1%',
    features: ['Multi-busbar technology', 'Half-cut cell design', 'Excellent value'],
    warranty: '15-year product, 25-year performance',
  },
  {
    id: 'sol6',
    name: 'Performance 3 Panel',
    company: 'SunPower',
    companyId: 'comp1',
    description: 'Reliable and aesthetically pleasing solar panel for residential use.',
    imageUrl: 'https://placehold.co/600x400.png',
    powerOutput: '335W',
    efficiency: '19.9%',
    features: ['Shingled cell technology', 'Enhanced shade tolerance', 'Durable construction'],
    warranty: '25-year complete confidence warranty',
  },
];

// In a real app, this would come from a database or a persistent store.
// For this prototype, it's in-memory.
export let contactSettingsData: ContactSettings = {
  whatsappNumbers: [{ id: `wa-${Date.now()}`, value: '+1122334455' }],
  emailAddresses: [{ id: `em-${Date.now()}`, value: 'info@zawaenergy.com' }],
  phoneNumbers: [{ id: `ph-${Date.now()}`, value: '+1 (555) 123-4567' }],
  facebookUrl: 'https://www.facebook.com/zawaenergy',
  officeAddress: '123 Solar Street, Energy City, EC 12345, Powerland',
};