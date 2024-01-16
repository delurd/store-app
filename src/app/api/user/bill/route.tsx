import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/app/api/action';

export const GET = async (req: NextRequest) => {
  const {searchParams} = new URL(req.url);
  const userId = req.headers.get('Authorization');
  const page = searchParams.get('page') ?? '1';
  const dataOfPage = 10;

  const paginate: {skip: number; take: number} | {} = {
    skip: (parseInt(page) - 1) * dataOfPage,
    take: dataOfPage,
  };

  if (userId) {
    try {
      const res = await prisma.transactions.findMany({
        where: {buyerId: userId, paymentStatus: 'pending'},
        select: {
          id: true,
          paymentTotal: true,
          StoreTransaction: {
            select: {
              ProductsTransaction: {
                select: {
                  product: {
                    select: {name: true, slug: true, thumbnailPath: true},
                  },
                },
              },
            },
          },
        },
        ...paginate,
      });

      const countRes = await prisma.transactions.count({
        where: {buyerId: userId, paymentStatus: 'pending'},
      });

      return NextResponse.json({
        message: 'success',
        data: {data: res, total: Math.ceil(countRes / dataOfPage)},
      });
    } catch (error) {}
  }

  return NextResponse.json({message: ''}, {status: 401});
};
