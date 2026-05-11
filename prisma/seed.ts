import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const areas = [
  { name: "Measurement", slug: "measurement", sortOrder: 1 },
  { name: "CAD", slug: "cad", sortOrder: 2 },
  { name: "SAW", slug: "saw", sortOrder: 3 },
  { name: "CNC", slug: "cnc", sortOrder: 4 },
  { name: "Inline (Polishing)", slug: "inline", sortOrder: 5 },
  { name: "Fabrication", slug: "fabrication", sortOrder: 6 },
  { name: "Move", slug: "move", sortOrder: 7 },
  { name: "Installation", slug: "installation", sortOrder: 8 },
];

const errorTypes: Record<string, string[]> = {
  measurement: [
    "Wrong overall measurements",
    "Wall made/moved after measure",
    "Error on cabinet fitting",
    "Tiling changed after measure",
    "Missed overhangs/details",
    "Unlevel cabinets not noted",
    "Centerlines off (sink/cooktop)",
    "Missed electrical/plumbing",
    "Access issues not noted",
    "Customer changed mind on site",
  ],
  cad: [
    "Small font size on project",
    "Measurement error (propagated)",
    "Lack of cutting line",
    "Error on size of slab",
    "Vein matching ignored",
    "Wrong edge profile specified",
    "Wrong sink cutout template",
    "Grain direction wrong",
    "Parts too long for building access",
    "Missing seam placement",
  ],
  saw: [
    "Chipped edge during cut",
    "Cut out of square",
    "Wrong slab used (color/batch)",
    "Blade deflection / inaccurate cut",
    "Cut on the wrong side of the line",
    "Machine breakdown/calibration issue",
    "Slab tension release (cracked during cut)",
    "Parts not labeled correctly",
    "Miter cut angle incorrect",
    "Cut too deep (plunge error)",
  ],
  cnc: [
    "Tool breakage / gouges",
    "Piece shifted (suction cup failure)",
    "Wrong tooling used (bad profile)",
    "Poor water flow / burnt stone",
    "Sink cutout wrong size",
    "Thickness variation issues",
    "Program error / wrong file loaded",
    "Steps/lines left in the edge",
    "Corner radius incorrect",
    "Bottom edge not chamfered/eased",
  ],
  inline: [
    "Uneven polish / wavy edge",
    "Scratched surface during polish",
    "Dull spots / lack of shine",
    "Edge profile inconsistent",
    "Blowout on the edge end",
    "Polishing pads worn out",
    "Watermarks / etching from slurry",
    "Machine pressure too high/low",
    "Conveyor belt marks on back",
    "Edges not washed/cleaned",
  ],
  fabrication: [
    "Miter joint gaps/blowouts",
    "Epoxy/Glue color mismatch",
    "Poor seam quality",
    "Sink dropped/broke during mount",
    "Rodding/reinforcement failure",
    "Lamination lines visible",
    "Undermount reveal is uneven",
    "Scratched during hand polishing",
    "Forgot to drill faucet holes",
    "Backsplash heights don't match",
  ],
  move: [
    "Scratched by A-frame",
    "Snapped in transit (poor strapping)",
    "Dropped by forklift/crane",
    "Stained by dirty suction cups",
    "Chipped during loading/unloading",
    "Material placed in wrong cart",
    "Lost/misplaced pieces",
    "Straps caused edge friction",
    "Exposed to rain/bad weather",
    "A-frame overloaded/failed",
  ],
  installation: [
    "Piece does not fit (too tight)",
    "Seam is unlevel / lippage",
    "Broken during carry-in",
    "Damaged customer property (walls/floors)",
    "Wrong sink/faucet supplied to site",
    "Plumbing/Electrical cutouts don't align",
    "Cabinets not leveled enough to install",
    "Customer refused material/color",
    "Caulking/silicone applied poorly",
    "Job site not ready (delays)",
  ],
};

async function main() {
  console.log("Seeding database…\n");

  const hashed = await bcrypt.hash("stonewatch2025", 12);
  await prisma.user.upsert({
    where: { email: "admin@stonewatch.com" },
    update: {},
    create: {
      email: "admin@stonewatch.com",
      password: hashed,
      name: "Admin",
    },
  });
  console.log("✓ Default user: admin@stonewatch.com / stonewatch2025");

  for (const area of areas) {
    await prisma.area.upsert({
      where: { slug: area.slug },
      update: { name: area.name, sortOrder: area.sortOrder },
      create: area,
    });
  }
  console.log(`✓ ${areas.length} areas`);

  let count = 0;
  for (const [slug, labels] of Object.entries(errorTypes)) {
    const area = await prisma.area.findUnique({ where: { slug } });
    if (!area) continue;
    for (const label of labels) {
      await prisma.errorType.upsert({
        where: { areaId_label: { areaId: area.id, label } },
        update: {},
        create: { areaId: area.id, label },
      });
      count++;
    }
  }
  console.log(`✓ ${count} error types\n`);
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
