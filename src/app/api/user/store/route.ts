 
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/action";

export const GET = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''

    try {
        const res = await prisma.store.findUnique({ where: { userId } })

        return NextResponse.json({ message: 'success', data: res, userId })
    } catch (error) {
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}

export const POST = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''

    const body = await req.json()

    const name = body.name
    const category = body.category
    const openStatus = body.openStatus

    const cekUniqueName = await prisma.store.findUnique({ where: name })

    if (!cekUniqueName) {

        try {
            await prisma.store.create({ data: { userId } })

            return NextResponse.json({ message: 'success' })
        } catch (error) {

        }
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}


export const PUT = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''
    console.log(userId);

    const body = await req.json()

    const name = body.name
    const category = body.category
    const openStatus = body.openStatus as number

    const cekStore = await prisma.store.findUnique({ where: { userId } })
    // console.log(body);

    if (cekStore) {
        try {
            const res = await prisma.store.update({ where: { userId }, data: { name, category, openStatus: !!openStatus } })

            return NextResponse.json({ message: 'success', data: res })
        } catch (error) {

        }
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}