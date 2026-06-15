import prisma from "@/lib/db";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export async function recordLoginAttempt(email: string, success: boolean) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  if (success) {
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lastLoginAt: new Date() },
    });
  } else {
    const newAttempts = user.loginAttempts + 1;
    const shouldLock = newAttempts >= MAX_LOGIN_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: newAttempts,
        isLocked: shouldLock,
      },
    });
  }
}

export async function isAccountLocked(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return false;
  if (!user.isLocked) return false;

  if (user.lastLoginAt) {
    const elapsed = Date.now() - user.lastLoginAt.getTime();
    if (elapsed > LOCKOUT_DURATION_MINUTES * 60 * 1000) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isLocked: false, loginAttempts: 0 },
      });
      return false;
    }
  }

  return true;
}

function escapeChar(c: string): string {
  switch (c) {
    case "<": return "&" + "lt" + ";";
    case ">": return "&" + "gt" + ";";
    case '"': return "&" + "quot" + ";";
    case "'": return "&#" + "x27" + ";";
    case "/": return "&#" + "x2F" + ";";
    default: return c;
  }
}

export function sanitizeInput(input: string): string {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    result += escapeChar(input[i]);
  }
  return result;
}

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:;",
};