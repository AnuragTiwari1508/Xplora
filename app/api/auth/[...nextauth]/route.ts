import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticateUser } from "@/lib/user-store"

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check demo user first
        if (credentials.email === "demo@xploraa.com" && credentials.password === "demo123") {
          return {
            id: "1",
            email: "demo@xploraa.com",
            name: "Demo Explorer",
            image: null,
          }
        }

        // Check registered users
        const user = authenticateUser(credentials.email, credentials.password)
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: null,
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token.userId && session.user) {
        session.user.id = token.userId
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
