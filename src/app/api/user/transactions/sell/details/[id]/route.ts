import { prisma } from "@/app/api/action";
 
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: { params: { id: string } }) => {
    const userId = req.headers.get('Authorization')

    const transactionStoreId = context.params.id ?? ''

    if (userId) {
        try {
            const res = await prisma.storeTransaction.findUnique({
                where: { id: transactionStoreId, ProductsTransaction: { every: { product: { sellerId: userId } } } },
                include: {
                    ProductsTransaction: {
                        select: {
                            productId: true,
                            product: {
                                select: {
                                    name: true,
                                    price: true,
                                    thumbnailPath: true,
                                    slug: true,
                                    store: { select: { name: true } }
                                }
                            }
                        }
                    },
                    transaction: {
                        select: {
                            createdAt: true,
                            paymentStatus: true,
                            buyer: { select: { fullname: true, UserProfile: true } }
                        }
                    }
                }
            })

            return NextResponse.json({ message: 'success', data: res })
        } catch (error) {

        }
    }

    return NextResponse.json({ message: '' }, { status: 401 })
}