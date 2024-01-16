import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/api/action";

export const PUT = async (req: NextRequest, context: { params: { slug: string } }) => {
    const userId = req.headers.get('Authorization') ?? ''
    const slug = context.params.slug ?? ''

    let error = ''

    if (userId) {
        try {
            const getproduct = await prisma.products.findUnique({ where: { id: slug }, select: { published: true } })
            const isPublish = !getproduct?.published

            const res = await prisma.products.update({ where: { id: slug, sellerId: userId }, data: { published: isPublish } })

            return NextResponse.json({ message: 'success', data: res })
        } catch (error) {
            error = error
        }
    }

    return NextResponse.json({ message: 'Something went wrong ', error }, { status: 400 })
}