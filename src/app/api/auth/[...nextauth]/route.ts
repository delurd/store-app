import NextAuth from "next-auth"
import { authOptions } from "./action"



const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }