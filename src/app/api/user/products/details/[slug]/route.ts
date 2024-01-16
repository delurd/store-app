
import { rmSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/action";

export const GET = async (req: NextRequest, context: { params: { slug: string } }) => {
    const userId = req.headers.get('Authorization') ?? ''
    const slug = context.params.slug ?? ''
    // console.log(context.params.slug);

    try {
        const res = await prisma.products.findFirst({ where: { id: slug }, include: { ProductsImages: true } })

        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {

    }

    return NextResponse.json({ message: 'Something went wrong!' }, { status: 400 })
}

export const DELETE = async (req: NextRequest, context: { params: { slug: string } }) => {
    const userId = req.headers.get('Authorization') ?? ''
    const slug = context.params.slug ?? ''

    try {
        if (!userId) throw 'Not Authorized'

        //REQUIRED DELETE foreigh key PRODUCTIMAGE | USERCART | PRODUCTTRANSACTION
        const productImage = await prisma.productsImages.findMany({ where: { productId: slug } })
        for (const image of productImage) {
            try {
                rmSync(process.cwd() + '\\public' + image?.path.replaceAll('/', '\\'))
            } catch (error) {
            }
        }

        const res = await prisma.products.delete({ where: { id: slug } })

        return NextResponse.json({ message: 'success', data: res })

    } catch (error) {
        // console.log(error);
    }

    return NextResponse.json({ message: 'Something went wrong!' }, { status: 400 })
}