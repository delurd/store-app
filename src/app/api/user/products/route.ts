 
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { generateCustomId } from "../../action";
import { prisma } from "@/app/api/action";

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
    const getWeight = bodyForm.get('weight') as string
    const getQuantity = bodyForm.get('quantity') as string
    const weight = getWeight ? parseInt(getWeight) : 500
    const quantity = getQuantity ? parseInt(getQuantity) : 1
    // console.log(quantity);

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
                const res = await prisma.products.create({ data: { name, price, category, description, weight, quantity, slug, thumbnailPath: imagesPath[0], sellerId: userId, storeId: storeId.id } })

                await prisma.productsImages.createMany({ data: imagesPath.map((path) => { return { path, productId: res.id } }) })

                return NextResponse.json({ message: 'success' })
            } catch (error) {
                // console.log(error);
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
    const weight = parseInt(body.weight) ?? 500
    const quantity = parseInt(body.quantity) ?? 1
    const category = body.category
    const description = body.description
    const thumbnailPath = body.thumbnailPath

    const userId = req.headers.get('Authorization') ?? ''
    // console.log('UPDATE PRODUCT');

    let error = ''

    if (userId) {
        if (id && name && price && category && description) {

            try {
                const getproduct = await prisma.products.findUnique({ where: { id }, select: { slug: true } })
                const slugId = getproduct?.slug.split('-').find((val, idx, arr) => idx == arr.length - 1)

                const sluging = name.replaceAll(' ', '-') + '-' + slugId


                const res = await prisma.products.update({ where: { id, sellerId: userId }, data: { name, price, category, weight, quantity, description, thumbnailPath, slug: sluging } })

                return NextResponse.json({ message: 'success', data: res })
            } catch (error) {
                error = error
            }
        } else
            error = 'Please fill all data'
    }

    return NextResponse.json({ message: 'Something went wrong ', error }, { status: 400 })
}