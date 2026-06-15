import { PrismaClient, UserRole, ModuleName } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create SUPERADMIN
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@petsuite.com" },
    update: {},
    create: {
      email: "superadmin@petsuite.com",
      password: "$2b$10$placeholder", // Will be set via Supabase Auth
      name: "Super Admin",
      role: "SUPERADMIN" as UserRole,
      phone: "081234567890",
    },
  });
  console.log("✅ SUPERADMIN created:", superadmin.email);

  // Create a default clinic
  const clinic = await prisma.clinic.upsert({
    where: { slug: "klinik-utama" },
    update: {},
    create: {
      name: "Klinik Utama",
      slug: "klinik-utama",
      address: "Jl. Contoh No. 123, Jakarta",
      phone: "02112345678",
      email: "info@klinikutama.com",
      isActive: true,
    },
  });
  console.log("✅ Clinic created:", clinic.name);

  // Assign SUPERADMIN to clinic
  await prisma.clinicUser.upsert({
    where: {
      clinicId_userId: {
        clinicId: clinic.id,
        userId: superadmin.id,
      },
    },
    update: {},
    create: {
      clinicId: clinic.id,
      userId: superadmin.id,
      isActive: true,
    },
  });
  console.log("✅ SUPERADMIN assigned to clinic");

  // Create default modules for clinic
  const defaultModules: ModuleName[] = [
    "APPOINTMENT",
    "MEDICAL_RECORD",
    "POS_BILLING",
  ];

  for (const module of defaultModules) {
    await prisma.clinicModule.upsert({
      where: {
        clinicId_module: {
          clinicId: clinic.id,
          module,
        },
      },
      update: { isActive: true },
      create: {
        clinicId: clinic.id,
        module,
        isActive: true,
      },
    });
  }
  console.log("✅ Default modules activated:", defaultModules.join(", "));

  // Create all other modules as inactive
  const allModules: ModuleName[] = [
    "ONLINE_BOOKING",
    "CUSTOMER_PORTAL",
    "VACCINATION",
    "INPATIENT",
    "GROOMING",
    "INVENTORY",
    "ACCOUNTING",
    "NOTIFICATION_WA",
    "NOTIFICATION_EMAIL",
  ];

  for (const module of allModules) {
    await prisma.clinicModule.upsert({
      where: {
        clinicId_module: {
          clinicId: clinic.id,
          module,
        },
      },
      update: { isActive: false },
      create: {
        clinicId: clinic.id,
        module,
        isActive: false,
      },
    });
  }
  console.log("✅ Other modules created (inactive)");

  // Create sample DOCTOR
  const doctor = await prisma.user.upsert({
    where: { email: "doctor@petsuite.com" },
    update: {},
    create: {
      email: "doctor@petsuite.com",
      password: "$2b$10$placeholder",
      name: "Dr. Andi",
      role: "DOCTOR" as UserRole,
      phone: "081234567891",
    },
  });
  console.log("✅ DOCTOR created:", doctor.email);

  await prisma.clinicUser.upsert({
    where: {
      clinicId_userId: {
        clinicId: clinic.id,
        userId: doctor.id,
      },
    },
    update: {},
    create: {
      clinicId: clinic.id,
      userId: doctor.id,
      isActive: true,
    },
  });

  // Create sample STAFF
  const staff = await prisma.user.upsert({
    where: { email: "staff@petsuite.com" },
    update: {},
    create: {
      email: "staff@petsuite.com",
      password: "$2b$10$placeholder",
      name: "Budi Staff",
      role: "STAFF" as UserRole,
      phone: "081234567892",
    },
  });
  console.log("✅ STAFF created:", staff.email);

  await prisma.clinicUser.upsert({
    where: {
      clinicId_userId: {
        clinicId: clinic.id,
        userId: staff.id,
      },
    },
    update: {},
    create: {
      clinicId: clinic.id,
      userId: staff.id,
      isActive: true,
    },
  });

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });