import { host } from "@/utils/variables"
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            id: "login",
            name: "login",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await fetch(host + "/api/auth/login", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })

                const json = await res.json()
                const user = json.data

                if (res.ok, user) {
                    return user
                } else {
                    return null
                }
            }

        }),
        CredentialsProvider({
            id: "register",
            name: "register",
            credentials: {
                fullname: { label: "Fullname", type: "text" },
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                storeName: { label: 'StoreName', type: 'text' },
                openStatus: { label: "OpenStatus", type: 'boolean' },
                storeCategory: { label: 'storeCategory', type: 'text' },
            },
            async authorize(credentials, req) {
                const res = await fetch(host + "/api/auth/register", {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })

                const json = await res.json()
                const user = json.data;

                // console.log(res.ok);

                if (res.ok && user) {
                    return user
                } else {
                    return null
                }

            }

        })
    ],
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            // session.accessToken = token.accessToken
            // console.log("SESSION ", session, user, token);
            const t = token as any

            session.user = {
                ...session.user,
                ...t.user
            }

            return session
        },
        async jwt({ session, token, user }) {
            // console.log("JWT ", user);

            if (typeof user !== "undefined") {
                // user has just signed in so the user object is populated
                token.user = user
            }
            return token
        }
    }
}


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }