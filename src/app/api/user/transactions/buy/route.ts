import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient()

type productStoreType = { storeId: string, productsId: [] }

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const userId = req.headers.get('Authorization')
    const page = searchParams.get('page') ?? '1'
    const dataOfPage = 10

    const paginate: { skip: number, take: number } | {} = {
        skip: (parseInt(page) - 1) * dataOfPage,
        take: dataOfPage
    }

    if (userId) {
        try {
            const res = await prisma.storeTransaction.findMany({
                where: { transaction: { buyerId: userId } },
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
                    }
                },
                orderBy: { transaction: { createdAt: 'desc' } },
                ...paginate
            })

            const countRes = await prisma.storeTransaction.count({
                where: { transaction: { buyerId: userId } },
            })

            return NextResponse.json({ message: 'success', data: { data: res, total: Math.ceil(countRes / dataOfPage) } })
        } catch (error) {
        }
    }

    return NextResponse.json({ message: '' }, { status: 401 })
}

export const POST = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''
    const body = await req.json()

    const paymentTotal = body.paymentTotal ?? ''
    const buyerId = userId
    const productStore: productStoreType[] = body.productStore ?? ''

    // console.log(buyerId, productStore);

    if (userId) {
        try {
            // console.log('POST transaction buy');

            const resTransaction = await prisma.transactions.create({ data: { paymentTotal, buyerId } })

            const transactionId = resTransaction.id
            // console.log('TransactionID ' + transactionId);

            for (const store of productStore) {
                const totalPrice = ''
                // console.log('DATA ' + transactionId);

                const resStoreTransaction = await prisma.storeTransaction.create({ data: { totalPrice, transactionId } })

                for (const productId of store.productsId) {
                    // console.log('PRODUCT ' + resStoreTransaction.id);

                    const productTransaction = await prisma.productsTransaction.create({ data: { storeTransactionId: resStoreTransaction.id, productId } })
                }
            }
            await prisma.userCart.deleteMany({ where: { userId } })

            return NextResponse.json({ message: 'success', data: resTransaction })

        } catch (error) {

        }
    }

    return NextResponse.json({ message: '' }, { status: 401 })
}