import { prisma } from "@/app/api/action";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''

    try {
        const getData = await prisma.storeTransaction.findMany({
            where: {
                transaction: { paymentStatus: 'success' },
                // shippingStatus: 'success',
                ProductsTransaction: {
                    every: { product: { sellerId: userId } }
                }
            }
        })
        const total = getData.length

        return NextResponse.json({ message: 'success', data: total })
    } catch (error) {
        return NextResponse.json({ message: 'something went wrong', error: error }, { status: 400 })
    }

}