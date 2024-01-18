import { revalidateFetch } from "@/app/action";
import { prisma } from "@/app/api/action";
import { NextRequest, NextResponse } from "next/server";


export const PUT = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''
    const body = await req.json()

    const storeTransactionId = body?.id ?? ''
    const status = body?.status ?? ''
    const receiptCode = body?.receiptCode ? { shippingReceipt: body?.receiptCode } : {}

    try {
        const res = await prisma.storeTransaction.update({
            where: { id: storeTransactionId }, data: {
                shippingStatus: status, ...receiptCode
            },
            include: { ProductsTransaction: { select: { productId: true } } }
        })
        if (status == 'canceled') {
            for (const item of res.ProductsTransaction) {
                await prisma.products.update({ where: { id: item.productId }, data: { quantity: { increment: 1 } } })
            }
        }
        revalidateFetch('product')

        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {

    }

    return NextResponse.json({ message: 'failed' }, { status: 400 })

}