import { createClient } from "@supabase/supabase-js";
import type { SessionUser } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Get the current session user from the request.
 * This is a server-side function to be used in API routes and server components.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    const { data: user } = await supabase
      .from("users")
      .select("id, email, name, role")
      .eq("id", session.user.id)
      .single();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as SessionUser["role"],
    };
  } catch {
    return null;
  }
}

/**
 * Get the current session user with their active clinic context.
 */
export async function getSessionUserWithClinic(): Promise<SessionUser | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return null;
    }

    const { data: user } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        name,
        role,
        clinic_users!inner (
          clinic:clinic_id (
            id,
            slug
          )
        )
      `
      )
      .eq("id", session.user.id)
      .single();

    if (!user) {
      return null;
    }

    const clinicUser = (user as Record<string, unknown>).clinic_users as {
      clinic: { id: string; slug: string };
    }[];

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as SessionUser["role"],
      clinicId: clinicUser?.[0]?.clinic?.id,
      clinicSlug: clinicUser?.[0]?.clinic?.slug,
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication. Returns the session user or throws a redirect.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

/**
 * Require a specific role. Returns the session user or throws.
 */
export async function requireRole(
  allowedRoles: SessionUser["role"][]
): Promise<SessionUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}