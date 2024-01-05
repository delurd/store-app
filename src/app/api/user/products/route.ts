import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { generateCustomId } from "../../action";

const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const dataEachPage = 8
    const userId = req.headers.get('Authorization') ?? ''

    try {
        const res = await prisma.products.findMany({
            where: { sellerId: userId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {

    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}



export const POST = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''
    const bodyForm = await req.formData()

    const name = bodyForm.get('name') as string ?? ''
    const price = bodyForm.get('price') as string ?? ''
    const category = bodyForm.get('category') as string ?? ''
    const description = bodyForm.get('description') as string ?? ''
    const images = bodyForm.getAll('image') as File[] ?? []
    // console.log(images);


    if (name && price && category && description) {
        const slug = name.replaceAll(' ', '-') + '-' + Math.random().toString(36).substring(2, 7)
        const storeId = await prisma.store.findUnique({ where: { userId }, select: { id: true } })
        const imagesPath = []

        if (storeId) {
            for (const image of images) {
                const byte = await image.arrayBuffer()
                const buffer = Buffer.from(byte)

                const imageType = image.type.split('/')[1]
                const randomId = generateCustomId(1)
                const imageName = `image${randomId}product${slug.replaceAll('-', '')}.${imageType}`

                const path = join(process.cwd(), 'public/uploads/products/', imageName)
                await writeFile(path, buffer)
                // console.log(imageName);

                imagesPath.push('/uploads/products/' + imageName)
            }
            // console.log(imagesPath);

            try {
                const res = await prisma.products.create({ data: { name, price, category, description, slug, thumbnailPath: imagesPath[0], sellerId: userId, storeId: storeId.id } })

                await prisma.productsImages.createMany({ data: imagesPath.map((path) => { return { path, productId: res.id } }) })

                return NextResponse.json({ message: 'success' })
            } catch (error) {
            }
        }

    }

    return NextResponse.json({ message: 'Something went wrong ', error: 'fill all data' }, { status: 400 })
}

export const PUT = async (req: NextRequest) => {
    const body = await req.json()

    const id = body.id ?? ''
    const name = body.name as string
    const price = body.price
    const category = body.category
    const description = body.description
    const thumbnailPath = body.thumbnailPath

    const userId = req.headers.get('Authorization') ?? ''
    // console.log('UPDATE PRODUCT');
    // console.log(body);

    let error = ''

    if (userId) {
        if (id && name && price && category && description) {
            const slug = name.replaceAll(' ', '-') + '-' + Math.random().toString(36).substring(2, 7)

            try {
                const res = await prisma.products.update({ where: { id, sellerId: userId }, data: { name, price, category, description, thumbnailPath, slug } })

                return NextResponse.json({ message: 'success', data: res })
            } catch (error) {
            }
        } else
            error = 'Please fill all data'
    }

    return NextResponse.json({ message: 'Something went wrong ', error }, { status: 400 })
}