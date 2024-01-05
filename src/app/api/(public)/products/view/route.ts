import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();

export const GET = async (
    req: NextRequest,
) => {
    const { searchParams } = new URL(req.url)

    const page = searchParams.get('page') as unknown as number
    const category = searchParams.get('category') ?? ''
    const dataOfPage = searchParams.get('totalOnPage') ? parseInt(searchParams.get('totalOnPage') as string) : 8;

    try {
        if (Number.isNaN(page * 1) || Number.isNaN(dataOfPage * 1)) throw Error('query page validation error')

        const paginate: { skip: number, take: number } | {} = page ? {
            skip: (page - 1) * dataOfPage,
            take: dataOfPage,
        } : {}
        const categoryWhere: { category: string } | {} = category ? { category } : {}

        const res = await prisma.products.findMany({
            where: { store: { openStatus: true }, published: true, ...categoryWhere },
            select: {
                name: true,
                price: true,
                id: true,
                slug: true,
                thumbnailPath: true,
            },
            orderBy: { createdAt: 'desc' },
            ...paginate
        });
        const totalProduct = await prisma.products.count({ where: { store: { openStatus: true }, published: true, ...categoryWhere }, })

        // console.log(res);

        return NextResponse.json({ message: 'success', data: { data: res, total: Math.ceil(totalProduct / dataOfPage) } });
    } catch (error) { }

    return NextResponse.json({ message: 'Something went wrong' }, { status: 400 });
};
