const KEY = 'shopkart:users'

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function createUser({ name, email, password }) {
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'An account with this email already exists' }
  }
  const record = {
    name,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  localStorage.setItem(KEY, JSON.stringify([...users, record]))
  return { user: { name, email } }
}

export async function verifyUser(email, password) {
  const record = getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  )
  if (!record) {
    return { error: 'No account with this email — create one first' }
  }
  if ((await hashPassword(password)) !== record.passwordHash) {
    return { error: 'Incorrect password' }
  }
  return { user: { name: record.name, email: record.email } }
}
