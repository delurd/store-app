import { prisma } from "@/app/api/action";
import { NextRequest, NextResponse } from "next/server";


export const PUT = async (req: NextRequest) => {
    const body = await req.json()
    const transactionId = body?.transactionId ?? ''
    const paymentStatus = body?.paymentStatus ?? 'pending'

    try {
        const res = await prisma.transactions.update({ where: { id: transactionId }, data: { paymentStatus }, select: { StoreTransaction: { select: { ProductsTransaction: true } } } })

        for (const data of res.StoreTransaction) {
            for (const product of data.ProductsTransaction) {
                await prisma.products.update({ where: { id: product.id }, data: { quantity: { decrement: 1 } } })
            }
        }

        return NextResponse.json({ message: 'success'})
    } catch (error) {

    }

    return NextResponse.json({ message: 'Something went wrong!' }, { status: 400 })
}