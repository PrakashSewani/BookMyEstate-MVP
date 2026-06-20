import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const LOCATIONS = ["Worli", "Juhu", "Bandra", "Lower Parel", "Andheri", "Thane", "Malabar Hill", "Lonavala"];
const TYPES = ["APARTMENT", "VILLA", "PENTHOUSE", "PLOT"];
const TYPE_LABELS: Record<string, string[]> = {
  APARTMENT: ["Residency", "Heights", "Tower", "Court", "Enclave", "Legacy", "Horizon", "Skyline", "Pinnacle", "Vertex"],
  VILLA: ["Villa", "Manor", "Estate", "Retreat", "Haven", "Grove", "Ridge", "Meadows", "Hills", "Park"],
  PENTHOUSE: ["Penthouse", "Crown", "Summit", "Apex", "Zenith", "Crest", "Pinnacle"],
  PLOT: ["Plot", "Land", "Parcel", "Acres", "Gardens"],
};

const ADJECTIVES = [
  "Grand", "Royal", "Premium", "Elite", "Prestige", "Signature", "Platinum", "Golden", "Silver", "Crystal",
  "Emerald", "Diamond", "Pearl", "Sapphire", "Ruby", "Onyx", "Ivory", "Opal", "Jade", "Amber",
  "The", "New", "Modern", "Classic", "Heritage", "Prime", "Select", "Regal", "Noble", "Royal",
  "Sunset", "Sunrise", "Ocean", "River", "Lake", "Mountain", "Valley", "Forest", "Garden", "Park",
  "Sky", "Cloud", "Star", "Moon", "Sun", "Earth", "Sea", "Wind", "Rain", "Snow",
];

const BHK_RANGES: Record<string, [number, number]> = {
  APARTMENT: [1, 4],
  VILLA: [3, 5],
  PENTHOUSE: [3, 4],
  PLOT: [0, 0],
};

const AREA_RANGES: Record<string, [number, number]> = {
  APARTMENT: [550, 3400],
  VILLA: [2500, 6000],
  PENTHOUSE: [2500, 5000],
  PLOT: [1200, 5000],
};

const PRICE_RANGES: Record<string, [number, number]> = {
  APARTMENT: [3500000, 35000000],
  VILLA: [18000000, 65000000],
  PENTHOUSE: [30000000, 80000000],
  PLOT: [3000000, 15000000],
};

const IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566752229-250ed79470f6?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop",
];

const DESCRIPTIONS = [
  "Premium property with modern amenities and excellent connectivity to major hubs.",
  "Spacious living spaces with abundant natural light and cross ventilation.",
  "Well-planned layout with modular kitchen and contemporary finishes throughout.",
  "Located in a prime area with world-class infrastructure and social amenities.",
  "Thoughtfully designed spaces that blend comfort with modern aesthetics.",
  "Features high-end fittings, smart home integration, and premium flooring.",
  "Set in a tranquil environment with lush greenery and open spaces nearby.",
  "Excellent investment opportunity in a rapidly developing micro-market.",
  "Ready-to-move property with all necessary approvals and clear title.",
  "Luxury living at its finest with a host of recreational facilities.",
  "Strategically located near schools, hospitals, and commercial centers.",
  "Panoramic views from every room with floor-to-ceiling windows.",
  "Private terrace with stunning views and space for outdoor entertaining.",
  "Gated community with 24/7 security, power backup, and maintenance staff.",
  "Vastu-compliant design with optimal space utilization and ventilation.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickImages(): string {
  const count = randInt(2, 4);
  const shuffled = [...IMAGES].sort(() => Math.random() - 0.5);
  return JSON.stringify(shuffled.slice(0, count));
}

async function main() {
  console.log("Clearing existing data...");
  await prisma.lead.deleteMany();
  await prisma.userBehavior.deleteMany();
  await prisma.inferredPreference.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("test123", 10);

  await prisma.user.create({
    data: { name: "Admin", email: "admin@bookmyestate.com", password: adminPass, role: "ADMIN" },
  });
  await prisma.user.create({
    data: { name: "Priya Sharma", email: "user1@test.com", password: userPass, role: "USER" },
  });
  await prisma.user.create({
    data: { name: "Rohan Mehta", email: "user2@test.com", password: userPass, role: "USER" },
  });

  console.log("Seeding 300 properties...");

  const properties = [];
  for (let i = 0; i < 300; i++) {
    const type = pick(TYPES);
    const location = pick(LOCATIONS);
    const [bhkMin, bhkMax] = BHK_RANGES[type];
    const bhk = bhkMin === 0 ? 0 : randInt(bhkMin, bhkMax);
    const [areaMin, areaMax] = AREA_RANGES[type];
    const [priceMin, priceMax] = PRICE_RANGES[type];

    const adj = pick(ADJECTIVES);
    const suffix = pick(TYPE_LABELS[type]);
    const namePool = type === "PLOT" ? [location] : [location, "The"];
    const prefix = pick(namePool);

    properties.push({
      title: bhk > 0 ? `${adj} ${prefix} ${suffix}` : `${adj} ${prefix} ${suffix}`,
      description: pick(DESCRIPTIONS),
      price: Math.round(randInt(priceMin, priceMax) / 100000) * 100000,
      location,
      propertyType: type,
      bhk,
      areaSqFt: Math.round(randInt(areaMin, areaMax) / 10) * 10,
      images: pickImages(),
    });
  }

  await prisma.property.createMany({ data: properties });

  const count = await prisma.property.count();
  console.log(`Seeded ${count} properties and 3 users.`);
  console.log(`Admin: admin@bookmyestate.com / admin123`);
  console.log(`User:  user1@test.com / test123`);
  console.log(`User:  user2@test.com / test123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
