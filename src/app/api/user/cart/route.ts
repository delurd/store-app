import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''

    if (userId) {
        const res = await prisma.userCart.findMany({ where: { userId }, include: { product: { include: { store: true } } } })

        return NextResponse.json({ message: 'success', data: res })
    } else {
        return NextResponse.json({ message: 'Please sign in' }, { status: 401 })
    }
}

export const POST = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''
    const body = await req.json()
    const productId = body.productId ?? ''

    if (!productId) {
        return NextResponse.json({ message: 'body productId required' }, { status: 400 })
    }

    if (userId) {
        const res = await prisma.userCart.create({ data: { productId, userId } })

        return NextResponse.json({ message: 'success', data: res })
    } else {
        return NextResponse.json({ message: 'Please sign in' }, { status: 401 })
    }

}

export const DELETE = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''
    const body = await req.json()
    const id = body.id ?? ''

    if (!id) {
        return NextResponse.json({ message: 'body id required' }, { status: 400 })
    }

    if (userId) {
        const res = await prisma.userCart.delete({ where: { id } })

        return NextResponse.json({ message: 'success', data: res })
    } else {
        return NextResponse.json({ message: 'Please sign in' }, { status: 401 })
    }

}