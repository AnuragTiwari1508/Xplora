// Simple in-memory user store for demo purposes
// In production, this would be a database
export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
}

let registeredUsers: User[] = []

export function getRegisteredUsers(): User[] {
  return registeredUsers
}

export function addUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    id: "user-" + Date.now(),
    ...user,
    createdAt: new Date()
  }
  
  registeredUsers.push(newUser)
  return newUser
}

export function findUserByEmail(email: string): User | undefined {
  return registeredUsers.find(user => user.email === email)
}

export function authenticateUser(email: string, password: string): User | null {
  const user = registeredUsers.find(u => u.email === email && u.password === password)
  return user || null
}
