import { generateCustomId } from "@/app/api/action";
 
import { rmSync, unlinkSync } from "fs";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { prisma } from "@/app/api/action";

export const GET = async (req: NextRequest) => {
    const body = await req.json()

    const id = body?.id ?? ''
    const productId = body?.productId ?? ''

    if (productId) {
        try {
            const res = await prisma.productsImages.findMany({ where: { productId } })

            return NextResponse.json({ message: 'success', data: res })
        } catch (error) {

        }
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}


export const POST = async (req: NextRequest) => {
    const formBody = await req.formData()

    const image = formBody.get('image') as File ?? ''
    const productId = formBody?.get('productId') as string ?? ''
    console.log(productId);

    if (productId) {
        try {
            const product = await prisma.products.findUnique({ where: { id: productId } })
            const slug = product?.slug ?? ''

            const byte = await image.arrayBuffer()
            const buffer = Buffer.from(byte)

            const imageType = image.type.split('/')[1]
            const randomId = generateCustomId(1)
            const imageName = `image${randomId}product${slug.replaceAll('-', '')}.${imageType}`
            const path = join(process.cwd(), 'public/uploads/products/', imageName)

            await writeFile(path, buffer)

            try {
                const res = await prisma.productsImages.create({ data: { path: '/uploads/products/' + imageName, productId } })
                // console.log('BERHASIL');

                return NextResponse.json({ message: 'success', data: res })
            } catch (error) {
                // console.log(error);
            }

            // console.log('GAGAL');

        } catch (error) {
            // console.log(error);
        }
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}

export const DELETE = async (req: NextRequest) => {
    const body = await req.json()
    const id = body?.id ?? ''

    if (id) {
        try {
            const res = await prisma.productsImages.delete({ where: { id } })

            try {
                // unlinkSync(__dirname + res.path);
                rmSync(process.cwd() + '\\public' + res?.path.replaceAll('/', '\\'))
            } catch (error) {
            }

            return NextResponse.json({ message: 'success' })
        } catch (error) {

        }
    } else {
        return NextResponse.json({ message: 'Something went wrong ', error: 'body id required' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}