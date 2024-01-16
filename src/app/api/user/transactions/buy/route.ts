
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/action";

type productStoreType = { storeId: string, productsId: [], shippingPrice?: string, totalPrice?: string }

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
                where: { transaction: { buyerId: userId, paymentStatus: 'success' } },
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

    // console.log(typeof (paymentTotal));
    // console.log(buyerId, paymentTotal, productStore);
    // return NextResponse.json({ message: '' }, { status: 401 })

    if (userId) {
        try {
            // console.log('POST transaction buy');
            const user = await prisma.user.findFirst({ where: { id: buyerId }, select: { fullname: true, UserProfile: true } })
            const buyerProfile = user?.UserProfile

            const resTransaction = await prisma.transactions.create({
                data: {
                    paymentTotal,
                    buyerId,
                    buyerName: user?.fullname ?? '',
                    buyerAddress1: buyerProfile?.address1 ?? '',
                    buyerAddress2: buyerProfile?.address2 ?? '',
                    buyerCity: buyerProfile?.city ?? '',
                    buyerCountry: buyerProfile?.country ?? '',
                    buyerProvice: buyerProfile?.provice ?? '',
                    buyerPostalCode: buyerProfile?.postalCode ?? '',
                    buyerPhone: buyerProfile?.phone ?? '',
                    // StoreTransaction: { create: [{ totalPrice: '0', shippingPrice: "0", ProductsTransaction: { create: [{ productId: '' },{productId:''}] } },{totalPrice:''}] }
                }
            })

            const transactionId = resTransaction.id
            // console.log('TransactionID ' + transactionId);

            for (const store of productStore) {
                const totalPrice = store.totalPrice?.toString() ?? ''
                const shippingPrice = store.shippingPrice?.toString() ?? ''

                const resStoreTransaction = await prisma.storeTransaction.create({ data: { totalPrice, transactionId, shippingPrice } })

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