import { generateCustomId } from "@/app/api/action";

import { rmSync, unlinkSync } from "fs";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { prisma } from "@/app/api/action";
import DataURIParser from "datauri/parser";
import cloudinary from "@/utils/cloudinary";
import { revalidateFetch } from "@/app/action";

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
    const userId = req.headers.get('Authorizaton') ?? ''
    const formBody = await req.formData()
    const parser = new DataURIParser()

    const image = formBody.get('image') as File ?? ''
    const productId = formBody?.get('productId') as string ?? ''

    if (image.size > 2000000) return NextResponse.json({ message: 'failed', error: ['image must less then 2mb'] }, { status: 400 })

    if (productId) {
        try {
            const product = await prisma.products.findUnique({ where: { id: productId, sellerId: userId } })
            const slug = product?.slug ?? ''

            const byte = await image.arrayBuffer()
            const buffer = Buffer.from(byte)

            const imageType = image.type.split('/')[1]
            const randomId = generateCustomId(1)
            const imageName = `image${randomId}product${slug.replaceAll('-', '')}.${imageType}`
            // const path = join(process.cwd(), 'public/uploads/products/', imageName)
            // const pathUrl = '/uploads/products/' + imageName
            // await writeFile(path, buffer)
            // console.log('upload');

            const base64Image = parser.format(imageName, buffer)
            const contentImageBuffer = base64Image.content as string
            const uploadImage = await cloudinary.v2.uploader.upload(contentImageBuffer)
            // console.log('upload done');
            const uploadId = uploadImage.public_id
            const uploadUrl = uploadImage.url
            // console.log(uploadImage);

            try {
                const res = await prisma.productsImages.create({ data: { id: uploadId, path: uploadUrl, productId }, include: { product: { select: { slug: true } } } })
                // console.log('BERHASIL');
                revalidateFetch(res.product.slug)

                return NextResponse.json({ message: 'success', data: res })
            } catch (error) {
                // console.log(error);
            }

        } catch (error) {
            // console.log(error);
        }
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}

export const DELETE = async (req: NextRequest) => {
    const userId = req.headers.get('Authorizaton') ?? ''
    const body = await req.json()
    const id = body?.id ?? ''

    if (id) {
        try {
            const res = await prisma.productsImages.delete({ where: { id, product: { sellerId: userId } }, include: { product: { select: { slug: true } } } })

            try {
                if (res.path.includes('product')) {
                    // unlinkSync(__dirname + res.path);
                    rmSync(process.cwd() + '\\public' + res?.path.replaceAll('/', '\\'))
                } else {
                    await cloudinary.v2.uploader.destroy(id)
                }
            } catch (error) {
            }


            revalidateFetch(res.product.slug)
            return NextResponse.json({ message: 'success' })
        } catch (error) {

        }
    } else {
        return NextResponse.json({ message: 'Something went wrong ', error: 'body id required' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}