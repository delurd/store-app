import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export const GET = async (req: NextRequest, context: { params: { page: number } }) => {
    const userId = req.headers.get('Authorization') ?? ''

    const dataEachPage = 8
    const page = context.params.page ?? 0

    if (userId) {
        try {
            const res = await prisma.products.findMany({ where: { sellerId: userId }, skip: page * dataEachPage, take: dataEachPage })

            return NextResponse.json({ message: 'success', data: res })
        } catch (error) {
        }
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}