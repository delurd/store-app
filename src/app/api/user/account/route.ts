 
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/api/action";



export const GET = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''

    try {
        const profile = await prisma.userProfile.findUnique({ where: { userId } })

        const res = { ...profile }

        return NextResponse.json({ message: 'success', data: res })
    } catch (error) {
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}


export const PUT = async (req: NextRequest) => {
    const userId = req.headers.get('Authorization') ?? ''
    const body = await req.json()

    const address1 = body?.address1
    const address2 = body?.address2
    const city = body?.city
    const cityId = body?.cityId
    const postalCode = body?.postalCode
    const provice = body?.provice
    const proviceId = body?.proviceId
    const country = body?.country
    const phone = body?.phone

    const fullname = body?.fullname
    const email = body?.email


    if (email && fullname) {
        try {
            const res = await prisma.userProfile.update({ where: { userId }, data: { address1, address2, provice, proviceId, city, cityId, country, phone, postalCode } })
            // await prisma.user.update({ where: { id: userId }, data: { email, fullname } })

            return NextResponse.json({ message: 'success', data: res })
        } catch (error) {
        }
    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}