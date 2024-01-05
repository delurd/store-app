import { NextRequest, NextResponse } from "next/server"
import { hash } from 'bcrypt'
import { PrismaClient } from "@prisma/client";
import { generateRandomId } from "../../action";


export const POST = async (req: NextRequest) => {
    const body = await req.json()

    const fullname: string = body.fullname
    const email = body.email
    const password = body.password
    const storeOpenStatus = body.openStatus as number
    const storeName = body.storeName
    const storeCategory = body.storeCategory

    const openStatus = storeOpenStatus == 1 ? true : false
    const id = generateRandomId()

    const prisma = new PrismaClient()

    if (email && password) {
        const cekUniqueEmail = await prisma.user.findUnique({ where: { email } })


        if (!cekUniqueEmail) {
            const hasss = await hash(password, 10);

            if (hasss) {
                try {
                    await prisma.user.create({
                        data: {
                            email,
                            fullname,
                            password: hasss,
                            id
                        }
                    })

                    await prisma.store.create({ data: { userId: id, openStatus, name: storeName, category: storeCategory } })
                    await prisma.userProfile.create({ data: { userId: id } })

                    return NextResponse.json({ message: 'success', data: { id, fullname, email } })
                } catch (error) {
                    // console.log(error);
                }
            }

        }

        return NextResponse.json({ message: 'Something went wrong', errors: [{ email: 'email has been usage' }] }, { status: 400 })

    }

    return NextResponse.json({ message: 'Something went wrong ' }, { status: 400 })
}