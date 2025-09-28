import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { apiService } from './api'

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      })
    ] : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in our system
          const existingUser = await apiService.getUserByEmail(user.email!)
          
          if (!existingUser) {
            // Create new user with Google OAuth data
            const newUser = {
              email: user.email!,
              first_name: user.name?.split(' ')[0] || '',
              last_name: user.name?.split(' ').slice(1).join(' ') || '',
              user_type: 'student' as const,
              profile_picture: user.image || '',
              is_google_user: true,
            }
            
            await apiService.register(newUser)
          }
          
          return true
        } catch (error) {
          console.error('Google OAuth sign in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && user) {
        try {
          // Get user data from our API
          const userData = await apiService.getUserByEmail(user.email!)
          token.user = userData
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
    error: '/signin', // Redirect to signin page on error
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
