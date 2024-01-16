import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/api/action";

export const PUT = async (req: NextRequest, context: { params: { slug: string } }) => {
    const userId = req.headers.get('Authorization') ?? ''
    const body = await req.json()
    const slug = context.params.slug ?? ''
    const thumbnailPath = body.thumbnailPath

    let error = ''

    if (userId) {
        if (slug) {
            try {
                const res = await prisma.products.update({ where: { id: slug, sellerId: userId }, data: { thumbnailPath } })

                return NextResponse.json({ message: 'success', data: res })
            } catch (error) {
                error = error
            }
        } else
            error = 'Product id required'
    }

    return NextResponse.json({ message: 'Something went wrong ', error }, { status: 400 })
}