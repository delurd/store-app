import {prisma} from '@/app/api/action';
import {NextRequest, NextResponse} from 'next/server';

export const GET = async (
  req: NextRequest,
  context: {params: {productId: string}}
) => {
  const productId = context.params.productId;

  try {
    const res = await prisma.customerReview.findMany({
      where: {productTransaction: {productId}},
      select: {id: true, name: true, review: true},
    });

    return NextResponse.json({message: 'success', data: {data: res}});
  } catch (error) {}

  return NextResponse.json({message: 'Something went wrong'}, {status: 400});
};
