import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import type { Db } from './db.ts'
import { nowIso } from './db.ts'

/* Senhas: scrypt, no mesmo formato do iapi ("scrypt$N$r$p$salt$hash"). */

const PARAMS = { N: 16384, r: 8, p: 1 }
const KEY_LENGTH = 64

const derive = (password: string, salt: Buffer, keyLength: number, N: number, r: number, p: number) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize('NFKC'), salt, keyLength, { N, r, p, maxmem: 64 * 1024 * 1024 }, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  )

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await derive(password, salt, KEY_LENGTH, PARAMS.N, PARAMS.r, PARAMS.p)
  return ['scrypt', PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('base64'), hash.toString('base64')].join('$')
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) {
    // Gasta o mesmo tempo de uma verificacao real: e-mail inexistente nao se distingue pelo tempo.
    await hashPassword(password)
    return false
  }
  const [algorithm, N, r, p, salt, hash] = stored.split('$')
  if (algorithm !== 'scrypt') return false
  const expected = Buffer.from(hash, 'base64')
  const actual = await derive(password, Buffer.from(salt, 'base64'), expected.length, Number(N), Number(r), Number(p))
  return timingSafeEqual(expected, actual)
}

/** Senha aleatoria legivel para donos de unidade e redefinicoes feitas pelo admin. */
export function randomPassword(): string {
  return randomBytes(9).toString('base64url')
}

/* Sessoes: o cookie leva o token, o banco guarda so o hash dele. */

export const SESSION_COOKIE = 'mybox_session'
const SESSION_TTL_MS = 30 * 86_400_000

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export function createSession(db: Db, profileId: string): { token: string; expiresAt: Date } {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  db.prepare('INSERT INTO sessions (id, profile_id, created_at, expires_at) VALUES (?, ?, ?, ?)').run(
    hashToken(token),
    profileId,
    nowIso(),
    expiresAt.toISOString(),
  )
  return { token, expiresAt }
}

export function findSessionProfileId(db: Db, token: string): string | undefined {
  const row = db
    .prepare('SELECT profile_id FROM sessions WHERE id = ? AND expires_at > ?')
    .get(hashToken(token), nowIso()) as { profile_id: string } | undefined
  return row?.profile_id
}

export function deleteSession(db: Db, token: string) {
  db.prepare('DELETE FROM sessions WHERE id = ?').run(hashToken(token))
}

export function deleteProfileSessions(db: Db, profileId: string) {
  db.prepare('DELETE FROM sessions WHERE profile_id = ?').run(profileId)
}

export function purgeExpiredSessions(db: Db) {
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(nowIso())
}
