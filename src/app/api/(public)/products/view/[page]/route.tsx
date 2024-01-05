import {PrismaClient} from '@prisma/client';
import {NextRequest, NextResponse} from 'next/server';
const prisma = new PrismaClient();
// UNUSED
export const GET = async (
  req: NextRequest,
  context: {params: {page: number}}
) => {
  const dataOfPage = 2;
  const page = context.params.page ? context.params.page - 1 : 1;

  try {
    const res = await prisma.products.findMany({
      skip: page * dataOfPage,
      take: dataOfPage,
      where: {store: {openStatus: true}, published: true},
      select: {
        name: true,
        price: true,
        id: true,
        slug: true,
        thumbnailPath: true,
      },
      orderBy: {createdAt: 'desc'},
    });
    // console.log(res);

    return NextResponse.json({message: 'success', data: res});
  } catch (error) {}

  return NextResponse.json({message: 'Something went wrong'}, {status: 400});
};
