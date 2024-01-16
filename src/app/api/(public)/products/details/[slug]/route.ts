
import { prisma } from "@/app/api/action";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: { params: { slug: string } }) => {
    const slug = context.params.slug ?? ''

    // console.log(context.params.slug);

    try {
        const res = await prisma.products.findFirst({
            where: { slug, published: true, store: { openStatus: true } },
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                category: true,
                quantity: true,
                store: { select: { name: true, id: true } },
                ProductsImages: { select: { path: true } },
                createdAt: true,
                thumbnailPath: true
            }
        })
        if (res == null) {
            throw res
        }

        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {
        return NextResponse.json({ message: 'Not Found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Something went wrong!' }, { status: 400 })

}