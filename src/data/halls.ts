export interface VenueHall {
  id: string;
  name: string;
  city: string;
  locality: string;
  type: 'Heritage Palace' | 'Luxury Banquet' | 'Open Lawn' | 'Community Hall' | 'Resort & Beach';
  capacity: {
    min: number;
    max: number;
  };
  approxCost: {
    vegPerPlate?: number;
    nonVegPerPlate?: number;
    rentalPerDay?: number;
  };
  suitableFor: ('wedding' | 'birthday' | 'community' | 'corporate')[];
  rating: number;
  highlights: string[];
}

export const TOP_INDIAN_CITIES = [
  'Kolkata',
  'Mumbai',
  'Delhi NCR',
  'Bangalore',
  'Hyderabad',
  'Jaipur',
  'Goa',
  'Pune',
  'Chennai',
] as const;

export type TopCity = typeof TOP_INDIAN_CITIES[number];

export const VENUE_HALLS_DATABASE: VenueHall[] = [
  // Kolkata
  {
    id: 'kol-1',
    name: 'PC Chandra Garden (Tulip & Gold Acres)',
    city: 'Kolkata',
    locality: 'EM Bypass',
    type: 'Luxury Banquet',
    capacity: { min: 200, max: 2000 },
    approxCost: { vegPerPlate: 1600, nonVegPerPlate: 1950, rentalPerDay: 250000 },
    suitableFor: ['wedding', 'community', 'birthday'],
    rating: 4.8,
    highlights: ['Lush manicured lawns', 'AC glass banquets', 'Ample parking for 300+ cars', 'Top caterer tie-ups'],
  },
  {
    id: 'kol-2',
    name: 'The Rajbari Bawali',
    city: 'Kolkata',
    locality: 'South 24 Parganas / Nodakhali',
    type: 'Heritage Palace',
    capacity: { min: 50, max: 400 },
    approxCost: { vegPerPlate: 2200, nonVegPerPlate: 2600, rentalPerDay: 350000 },
    suitableFor: ['wedding', 'birthday'],
    rating: 4.9,
    highlights: ['300-year-old Zamindari palace', 'Classical Bengali temple courtyard', 'Royal heritage suite stay'],
  },
  {
    id: 'kol-3',
    name: 'Calcutta Club Lawns & Ballroom',
    city: 'Kolkata',
    locality: 'Bhowanipore / AJC Bose Road',
    type: 'Community Hall',
    capacity: { min: 80, max: 600 },
    approxCost: { vegPerPlate: 900, nonVegPerPlate: 1200, rentalPerDay: 90000 },
    suitableFor: ['wedding', 'birthday', 'community'],
    rating: 4.6,
    highlights: ['Colonial heritage architecture', 'Central South Kolkata location', 'Economical club dining rate'],
  },
  {
    id: 'kol-4',
    name: 'Dhono Dhanyo Auditorium & Community Banquets',
    city: 'Kolkata',
    locality: 'Alipore',
    type: 'Community Hall',
    capacity: { min: 100, max: 800 },
    approxCost: { rentalPerDay: 85000, vegPerPlate: 850, nonVegPerPlate: 1100 },
    suitableFor: ['community', 'birthday', 'wedding'],
    rating: 4.7,
    highlights: ['State-of-the-art acoustics', 'Modern conch-shaped landmark', 'Government-subsidized hall rental rates'],
  },
  {
    id: 'kol-5',
    name: 'Vedic Village Spa Resort Banquet',
    city: 'Kolkata',
    locality: 'Rajarhat / New Town',
    type: 'Resort & Beach',
    capacity: { min: 100, max: 1200 },
    approxCost: { vegPerPlate: 1800, nonVegPerPlate: 2200, rentalPerDay: 200000 },
    suitableFor: ['wedding', 'birthday', 'corporate'],
    rating: 4.7,
    highlights: ['Rustic nature landscape', 'Lakeside amphitheater', 'Resort villas for guest lodging'],
  },

  // Mumbai
  {
    id: 'mum-1',
    name: 'Mayfair Banquets',
    city: 'Mumbai',
    locality: 'Worli Sea Face',
    type: 'Luxury Banquet',
    capacity: { min: 100, max: 800 },
    approxCost: { vegPerPlate: 2400, nonVegPerPlate: 2800, rentalPerDay: 300000 },
    suitableFor: ['wedding', 'birthday', 'corporate'],
    rating: 4.8,
    highlights: ['Sea-view ballroom', 'Celebrity gourmet catering', 'Valet parking & grand foyer'],
  },
  {
    id: 'mum-2',
    name: 'MCA Club The Lounge & Lawns',
    city: 'Mumbai',
    locality: 'Bandra Kurla Complex (BKC)',
    type: 'Community Hall',
    capacity: { min: 150, max: 1500 },
    approxCost: { vegPerPlate: 1400, nonVegPerPlate: 1750, rentalPerDay: 180000 },
    suitableFor: ['wedding', 'community', 'birthday'],
    rating: 4.7,
    highlights: ['Prime BKC central location', 'Sprawling green cricket grounds', 'Renowned banquet service'],
  },
  {
    id: 'mum-3',
    name: 'Cooperage Grounds & Heritage Pavilion',
    city: 'Mumbai',
    locality: 'Colaba, South Mumbai',
    type: 'Open Lawn',
    capacity: { min: 250, max: 2500 },
    approxCost: { rentalPerDay: 220000, vegPerPlate: 1200, nonVegPerPlate: 1500 },
    suitableFor: ['wedding', 'community'],
    rating: 4.5,
    highlights: ['South Bombay historic turf', 'Huge guest capacity', 'Open under the stars layout'],
  },

  // Delhi NCR
  {
    id: 'del-1',
    name: 'Tivoli Grand Resort & Royal Ballroom',
    city: 'Delhi NCR',
    locality: 'GT Karnal Road',
    type: 'Luxury Banquet',
    capacity: { min: 200, max: 2500 },
    approxCost: { vegPerPlate: 2100, nonVegPerPlate: 2500, rentalPerDay: 320000 },
    suitableFor: ['wedding', 'community', 'birthday'],
    rating: 4.7,
    highlights: ['Grand chandelier ballroom', 'Multiple open poolside lawns', 'Dedicated bridal suites'],
  },
  {
    id: 'del-2',
    name: 'India Habitat Centre (IHC) Banquets',
    city: 'Delhi NCR',
    locality: 'Lodhi Road, Central Delhi',
    type: 'Community Hall',
    capacity: { min: 50, max: 500 },
    approxCost: { vegPerPlate: 1100, nonVegPerPlate: 1400, rentalPerDay: 75000 },
    suitableFor: ['community', 'birthday', 'corporate'],
    rating: 4.8,
    highlights: ['Architectural masterpiece', 'Eco-friendly cultural haven', 'Central New Delhi connectivity'],
  },
  {
    id: 'del-3',
    name: 'Zorba Entertainment on MG Road',
    city: 'Delhi NCR',
    locality: 'Sultanpur / MG Road',
    type: 'Open Lawn',
    capacity: { min: 100, max: 800 },
    approxCost: { vegPerPlate: 2000, nonVegPerPlate: 2400, rentalPerDay: 250000 },
    suitableFor: ['wedding', 'birthday'],
    rating: 4.6,
    highlights: ['Boho chic garden amphitheater', 'Spanish villa architecture', 'Fairy light forest setting'],
  },

  // Bangalore
  {
    id: 'blr-1',
    name: 'Palace Grounds (Gayatri Vihar & Sheesh Mahal)',
    city: 'Bangalore',
    locality: 'Bellary Road / Sadashivnagar',
    type: 'Heritage Palace',
    capacity: { min: 300, max: 3500 },
    approxCost: { vegPerPlate: 1500, nonVegPerPlate: 1900, rentalPerDay: 400000 },
    suitableFor: ['wedding', 'community'],
    rating: 4.8,
    highlights: ['Iconic Bangalore royal venue', 'Palatial glass dome', 'Capacity for massive crowds'],
  },
  {
    id: 'blr-2',
    name: 'Templetree Leisure',
    city: 'Bangalore',
    locality: 'Bellandur / Panathur',
    type: 'Open Lawn',
    capacity: { min: 80, max: 600 },
    approxCost: { vegPerPlate: 1600, nonVegPerPlate: 2000, rentalPerDay: 220000 },
    suitableFor: ['wedding', 'birthday'],
    rating: 4.9,
    highlights: ['Balinese eco-luxury pavilion', 'Natural stone & thatch waterbody', 'Sustainable outdoor layout'],
  },
  {
    id: 'blr-3',
    name: 'Jayamahal Palace Hotel Lawns',
    city: 'Bangalore',
    locality: 'Jayamahal Road',
    type: 'Heritage Palace',
    capacity: { min: 150, max: 1500 },
    approxCost: { vegPerPlate: 1400, nonVegPerPlate: 1800, rentalPerDay: 200000 },
    suitableFor: ['wedding', 'birthday', 'community'],
    rating: 4.6,
    highlights: ['Colonial royal architecture', 'Century-old heritage trees', 'Central Bangalore greenery'],
  },

  // Jaipur
  {
    id: 'jai-1',
    name: 'Chomu Palace Heritage Hotel',
    city: 'Jaipur',
    locality: 'Chomu',
    type: 'Heritage Palace',
    capacity: { min: 100, max: 1000 },
    approxCost: { vegPerPlate: 2500, nonVegPerPlate: 2900, rentalPerDay: 350000 },
    suitableFor: ['wedding', 'birthday'],
    rating: 4.9,
    highlights: ['Authentic 300-year-old royal fortress', 'Mughal gardens & frescoes', 'Darbar hall setup'],
  },
  {
    id: 'jai-2',
    name: 'Diggi Palace Cultural Banquets',
    city: 'Jaipur',
    locality: 'Shivaji Marg, C-Scheme',
    type: 'Community Hall',
    capacity: { min: 100, max: 1200 },
    approxCost: { vegPerPlate: 1200, nonVegPerPlate: 1600, rentalPerDay: 150000 },
    suitableFor: ['community', 'wedding', 'birthday'],
    rating: 4.7,
    highlights: ['Home of the Jaipur Lit Fest', 'Rajasthani courtyard design', 'Central location in Jaipur'],
  },

  // Goa
  {
    id: 'goa-1',
    name: 'Riva Beach Resort & Coconut Grove',
    city: 'Goa',
    locality: 'Mandrem Beach, North Goa',
    type: 'Resort & Beach',
    capacity: { min: 50, max: 500 },
    approxCost: { vegPerPlate: 1500, nonVegPerPlate: 1900, rentalPerDay: 180000 },
    suitableFor: ['birthday', 'wedding'],
    rating: 4.8,
    highlights: ['Direct beach sand mandap access', 'River & sea confluence', 'Beach shack afterparty zone'],
  },
  {
    id: 'goa-2',
    name: 'Cidade de Goa (Vainguinim Lawns)',
    city: 'Goa',
    locality: 'Dona Paula, Central Goa',
    type: 'Resort & Beach',
    capacity: { min: 100, max: 900 },
    approxCost: { vegPerPlate: 2200, nonVegPerPlate: 2600, rentalPerDay: 280000 },
    suitableFor: ['wedding', 'birthday', 'corporate'],
    rating: 4.9,
    highlights: ['Portuguese heritage architecture', 'Sunset sea facing lawns', 'Five-star culinary brigade'],
  },

  // Hyderabad
  {
    id: 'hyd-1',
    name: 'JRC Conventions & Trade Fairs',
    city: 'Hyderabad',
    locality: 'Film Nagar / Jubilee Hills',
    type: 'Luxury Banquet',
    capacity: { min: 200, max: 3000 },
    approxCost: { vegPerPlate: 1700, nonVegPerPlate: 2100, rentalPerDay: 350000 },
    suitableFor: ['wedding', 'community', 'birthday'],
    rating: 4.8,
    highlights: ['Pillarless majestic banquet halls', 'VIP film-star suites', 'Jubilee Hills prime location'],
  },
  {
    id: 'hyd-2',
    name: 'Fort Grand Shamshabad',
    city: 'Hyderabad',
    locality: 'Airport Road, Shamshabad',
    type: 'Heritage Palace',
    capacity: { min: 300, max: 4000 },
    approxCost: { vegPerPlate: 1600, nonVegPerPlate: 2000, rentalPerDay: 300000 },
    suitableFor: ['wedding', 'community'],
    rating: 4.7,
    highlights: ['Medieval fortress walls and towers', 'Sprawling equestrian lawns', 'Near RGI Airport'],
  },

  // Pune
  {
    id: 'pun-1',
    name: 'The Corinthians Resort & Club',
    city: 'Pune',
    locality: 'Undri / NIBM Road',
    type: 'Resort & Beach',
    capacity: { min: 100, max: 1500 },
    approxCost: { vegPerPlate: 1500, nonVegPerPlate: 1900, rentalPerDay: 220000 },
    suitableFor: ['wedding', 'birthday', 'community'],
    rating: 4.7,
    highlights: ['Egyptian themed stone architecture', 'Grand ballroom & open poolside', 'Resort guest villas'],
  },
  {
    id: 'pun-2',
    name: 'PYC Hindu Gymkhana Banquets',
    city: 'Pune',
    locality: 'Deccan Gymkhana',
    type: 'Community Hall',
    capacity: { min: 60, max: 400 },
    approxCost: { vegPerPlate: 750, nonVegPerPlate: 950, rentalPerDay: 60000 },
    suitableFor: ['birthday', 'community', 'wedding'],
    rating: 4.6,
    highlights: ['Iconic Pune cultural landmark', 'Affordable traditional Maharashtrian menu', 'Central Deccan connectivity'],
  },
];
