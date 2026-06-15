import prisma from "@/lib/db";
import type { UserRole } from "@prisma/client";

const DEFAULT_PERMISSIONS: { key: string; name: string; group: string; roles: UserRole[] }[] = [
  { key: "customer.view", name: "View Customer", group: "Customer", roles: ["SUPERADMIN", "STAFF", "DOCTOR"] },
  { key: "customer.create", name: "Create Customer", group: "Customer", roles: ["SUPERADMIN", "STAFF"] },
  { key: "customer.update", name: "Update Customer", group: "Customer", roles: ["SUPERADMIN", "STAFF"] },
  { key: "customer.delete", name: "Delete Customer", group: "Customer", roles: ["SUPERADMIN"] },
  { key: "pet.view", name: "View Pet", group: "Pet", roles: ["SUPERADMIN", "STAFF", "DOCTOR"] },
  { key: "pet.create", name: "Create Pet", group: "Pet", roles: ["SUPERADMIN", "STAFF"] },
  { key: "pet.update", name: "Update Pet", group: "Pet", roles: ["SUPERADMIN", "STAFF"] },
  { key: "pet.delete", name: "Delete Pet", group: "Pet", roles: ["SUPERADMIN"] },
  { key: "appointment.view", name: "View Appointment", group: "Appointment", roles: ["SUPERADMIN", "STAFF", "DOCTOR"] },
  { key: "appointment.create", name: "Create Appointment", group: "Appointment", roles: ["SUPERADMIN", "STAFF", "DOCTOR"] },
  { key: "appointment.update", name: "Update Appointment", group: "Appointment", roles: ["SUPERADMIN", "STAFF", "DOCTOR"] },
  { key: "appointment.delete", name: "Delete Appointment", group: "Appointment", roles: ["SUPERADMIN", "STAFF"] },
  { key: "medical_record.view", name: "View Medical Record", group: "Medical Record", roles: ["SUPERADMIN", "DOCTOR", "STAFF"] },
  { key: "medical_record.create", name: "Create Medical Record", group: "Medical Record", roles: ["SUPERADMIN", "DOCTOR"] },
  { key: "medical_record.update", name: "Update Medical Record", group: "Medical Record", roles: ["SUPERADMIN", "DOCTOR"] },
  { key: "inventory.view", name: "View Inventory", group: "Inventory", roles: ["SUPERADMIN", "STAFF"] },
  { key: "inventory.manage", name: "Manage Inventory", group: "Inventory", roles: ["SUPERADMIN", "STAFF"] },
  { key: "pos.transact", name: "POS Transaction", group: "POS", roles: ["SUPERADMIN", "STAFF"] },
  { key: "invoice.view", name: "View Invoice", group: "Invoice", roles: ["SUPERADMIN", "STAFF"] },
  { key: "invoice.manage", name: "Manage Invoice", group: "Invoice", roles: ["SUPERADMIN", "STAFF"] },
  { key: "report.view", name: "View Reports", group: "Report", roles: ["SUPERADMIN", "STAFF"] },
  { key: "clinic.manage", name: "Manage Clinics", group: "Clinic", roles: ["SUPERADMIN"] },
  { key: "user.manage", name: "Manage Users", group: "User", roles: ["SUPERADMIN"] },
  { key: "module.manage", name: "Manage Modules", group: "Module", roles: ["SUPERADMIN"] },
  { key: "accounting.view", name: "View Accounting", group: "Accounting", roles: ["SUPERADMIN", "STAFF"] },
  { key: "accounting.manage", name: "Manage Accounting", group: "Accounting", roles: ["SUPERADMIN", "STAFF"] },
];

export async function seedPermissions() {
  for (const perm of DEFAULT_PERMISSIONS) {
    const permission = await prisma.permission.upsert({
      where: { key: perm.key },
      update: { name: perm.name, group: perm.group },
      create: { key: perm.key, name: perm.name, group: perm.group },
    });

    for (const role of perm.roles) {
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role, permissionId: permission.id } },
        update: {},
        create: { role, permissionId: permission.id },
      });
    }
  }
}

export async function checkPermission(userId: string, permissionKey: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userPermissions: { include: { permission: true } },
    },
  });

  if (!user) return false;
  if (user.role === "SUPERADMIN") return true;

  // Check user-specific permissions first
  const userPerm = user.userPermissions.find((up) => up.permission.key === permissionKey);
  if (userPerm) return userPerm.granted;

  // Check role-based permissions
  const rolePerm = await prisma.rolePermission.findFirst({
    where: {
      role: user.role,
      permission: { key: permissionKey },
    },
  });

  return !!rolePerm;
}

export async function getUserPermissions(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userPermissions: { include: { permission: true } },
    },
  });

  if (!user) return [];

  const rolePerms = await prisma.rolePermission.findMany({
    where: { role: user.role },
    include: { permission: true },
  });

  const roleKeys = rolePerms.map((rp) => rp.permission.key);
  const userOverrides = user.userPermissions.map((up) => ({
    key: up.permission.key,
    granted: up.granted,
  }));

  // Merge: user overrides take precedence
  const result = [...roleKeys];
  for (const override of userOverrides) {
    if (override.granted && !result.includes(override.key)) {
      result.push(override.key);
    } else if (!override.granted) {
      const idx = result.indexOf(override.key);
      if (idx >= 0) result.splice(idx, 1);
    }
  }

  return result;
}