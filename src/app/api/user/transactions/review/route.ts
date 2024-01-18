import { prisma } from "@/app/api/action";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
    const body = await req.json()
    const review = body.review ?? ''
    const id = body.id ?? ''
    const name = body.name ?? ''
    const userId = req.headers.get('Authorization') ?? ''

    console.log(userId, review, id, name);

    if (userId) {
        try {
            const res = await prisma.customerReview.create({ data: { review, productTransactionId: id, name, userId } })
            // const res = await prisma.review.create({ data: { name, productId: id, review, userId } })

            return NextResponse.json({ message: 'success', data: res })
        } catch (error) {

        }
    }
    return NextResponse.json({ message: 'failed' }, { status: 400 })
}