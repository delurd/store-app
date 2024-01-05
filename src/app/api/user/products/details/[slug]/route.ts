import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient()

export const GET = async (req: NextRequest, context: { params: { slug: string } }) => {
    const userId = req.headers.get('Authorization') ?? ''
    const slug = context.params.slug ?? ''

    // console.log(context.params.slug);

    try {
        const res = await prisma.products.findFirst({ where: { slug }, include: { ProductsImages: true } })

        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {

    }

    return NextResponse.json({ message: 'Something went wrong!' }, { status: 400 })

}