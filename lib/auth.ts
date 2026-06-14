import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.lozinkaHash)
        if (!isValid) return null

        if (user.statusNaloga === 'SUSPENDOVAN' || user.statusNaloga === 'OBRISAN') {
          throw new Error('Nalog je suspendovan')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.ime,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && user) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              ime: user.name || 'Google Korisnik',
              email: user.email!,
              lozinkaHash: '',
              role: 'SLUSALAC',
            },
          })
        }

        token.id = dbUser.id
        token.role = dbUser.role
      }

      if (account?.provider === 'credentials' && user) {
        token.id = user.id
        token.role = (user as any).role
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}