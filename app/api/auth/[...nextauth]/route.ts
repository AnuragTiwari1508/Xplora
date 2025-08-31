import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// Basic configuration that works without database for deployment
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-demo-deployment-12345",
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        // Simple demo user for deployment
        if (credentials?.email === "demo@xploraa.com" && credentials?.password === "demo123") {
          return {
            id: "1",
            email: "demo@xploraa.com",
            name: "Demo Explorer",
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
      if (token.userId) {
        session.user.id = token.userId
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
