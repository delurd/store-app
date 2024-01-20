import { prisma } from "@/app/api/action";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''

    try {
        const getData = await prisma.transactions.groupBy({
            by: ['buyerId'],
            where: {
                paymentStatus: 'success',
                StoreTransaction: {
                    some: {
                        // shippingStatus: 'success',
                        ProductsTransaction: {
                            every: { product: { sellerId: userId } }
                        }
                    }
                }
            }
        })
        // console.log(getData);

        return NextResponse.json({ message: 'success', data: getData.length })
    } catch (error) {
        return NextResponse.json({ message: 'something went wrong', error: error }, { status: 400 })
    }

}