import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);
const BACKUP_DIR = path.join(process.cwd(), "backups");

export interface BackupResult {
  success: boolean;
  filename: string;
  size: number;
  timestamp: Date;
  error?: string;
}

export async function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

export async function createDatabaseBackup(): Promise<BackupResult> {
  await ensureBackupDir();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `petsuite-db-${timestamp}.sql`;
  const filepath = path.join(BACKUP_DIR, filename);

  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error("DATABASE_URL not configured");

    // Parse DATABASE_URL for pg_dump
    const url = new URL(databaseUrl);
    const { hostname, port, pathname, username, password } = url;
    const database = pathname.replace("/", "");

    const cmd = `PGPASSWORD="${password}" pg_dump -h ${hostname} -p ${port || "5432"} -U ${username} -d ${database} -f ${filepath}`;
    await execAsync(cmd);

    const stats = fs.statSync(filepath);

    return {
      success: true,
      filename,
      size: stats.size,
      timestamp: new Date(),
    };
  } catch (error) {
    return {
      success: false,
      filename,
      size: 0,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : "Backup failed",
    };
  }
}

export async function listBackups(): Promise<BackupResult[]> {
  await ensureBackupDir();

  const files = fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .reverse();

  return files.map((filename) => {
    const filepath = path.join(BACKUP_DIR, filename);
    const stats = fs.statSync(filepath);
    return {
      success: true,
      filename,
      size: stats.size,
      timestamp: stats.mtime,
    };
  });
}

export async function cleanOldBackups(retentionDays = 30) {
  await ensureBackupDir();

  const files = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith(".sql"));
  const now = Date.now();

  for (const file of files) {
    const filepath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filepath);
    const age = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

    if (age > retentionDays) {
      fs.unlinkSync(filepath);
    }
  }
}