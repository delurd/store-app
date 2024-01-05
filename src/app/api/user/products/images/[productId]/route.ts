import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
const prisma = new PrismaClient()

export const GET = async (req: NextRequest, context: { params: { productId: string } }) => {
    const productId = context.params.productId ?? ''

    if (productId) {
        try {
            const res = await prisma.productsImages.findMany({ where: { productId } })

            return NextResponse.json({ message: 'success', data: res })
        } catch (error) {

        }
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}