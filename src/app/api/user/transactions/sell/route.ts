import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient()

export const GET = async (req: NextRequest) => {

    const { searchParams } = new URL(req.url)
    const userId = req.headers.get('Authorization')
    const page = searchParams.get('page') ?? '1'
    const dataOfPage = 10

    const paginate: { skip: number, take: number } | {} = {
        skip: (parseInt(page) - 1) * dataOfPage,
        take: dataOfPage
    }
    // console.log(paginate);

    if (userId) {
        try {
            const res = await prisma.storeTransaction.findMany({
                where: { ProductsTransaction: { every: { product: { sellerId: userId } } } },
                include: {
                    transaction: {
                        select: {
                            buyer: {
                                select: { fullname: true }
                            },
                            createdAt: true
                        }
                    },
                    ProductsTransaction: {
                        select: {
                            product: {
                                select: {
                                    name: true,
                                    store: {
                                        select: { name: true }
                                    },
                                    thumbnailPath: true
                                }
                            }
                        }
                    },
                },
                orderBy: { transaction: { createdAt: 'desc' } },
                ...paginate
            })
            const countRes = await prisma.storeTransaction.count({
                where: { ProductsTransaction: { every: { product: { sellerId: userId } } } },
            })

            return NextResponse.json({ message: 'success', data: { data: res, total: Math.ceil(countRes / dataOfPage) } })
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 400 })
        }
    }

    return NextResponse.json({ message: '' }, { status: 401 })
}