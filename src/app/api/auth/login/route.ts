import { PrismaClient } from "@prisma/client"
import { compare } from "bcrypt"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    const body = await req.json()

    const email = body.email
    const password = body.password
    const prisma = new PrismaClient()

    // console.log(body);

    try {
        const res = await prisma.user.findUnique({ where: { email }, include: { Store: { select: { id: true } } } })
        const pass = res?.password
        const id = res?.id
        const fullname = res?.fullname
        const storeId = res?.Store?.id
        // console.log(res);

        const hasss = await compare(password, pass!);
        if (hasss) {
            return NextResponse.json({ message: 'success', data: { id, fullname, email, storeId } })
        }
    } catch (error) {
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}