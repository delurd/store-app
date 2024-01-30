// 'use client';
import {host} from '@/utils/variables';
import Link from 'next/link';
import React from 'react';
import BackButton from './components/BackButton';
import {ProductDataType} from '@/utils/interfaces/globalTypes';
import ImagesView from './components/ImagesView';
import AddCartButton from './components/AddCartButton';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';
import CustomerReviewList from '@/components/CustomerReview/CustomerReviewList';

type Props = {};

const getData = async (slug: string) => {
  return await fetch(host + '/api/products/details/' + slug, {
    // cache: 'no-store',
    next: {
      tags: ['product', slug],
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      return res;
    })
    .catch((res) => res);
};

const ProductDetailPage = async ({params}: {params: {id: string}}) => {
  const slug = params.id;

  const resData = await getData(slug);

  if (!resData.ok) {
    return (
      <main className="flex-1 flex-center">
        <div className="flex flex-col justify-center">
          <p>Product Not Found</p>
          <BackButton />
        </div>
      </main>
    );
  }

  const data: ProductDataType = await resData
    .json()
    .then((json: any) => json.data);

  return (
    <main className="flex-1">
      <div className="container-base mb-10 space-y-7">
        <p className="flex gap-7 text-grey-secondary font-medium">
          <Link href={'/'}>Home</Link> <span>/</span>{' '}
          <span className="text-black">Product Details</span>
        </p>
        <ImagesView
          productImages={data.ProductsImages ?? []}
          thumbnailPath={data.thumbnailPath}
        />
        <div className="grid lg:grid-cols-12 gap-5">
          <div className="md:col-span-8">
            <div className="space-y-1 mb-2">
              <div className="flex justify-between items-center">
                <h1>{data.name}</h1>
                <p className="text-grey-secondary">Stock {data.quantity}</p>
              </div>
              <p className="text-grey-secondary">By {data.store?.name}</p>
              <h3 className="font-medium text-warning">
                Rp{formatToCurency(data.price ?? 0)}
              </h3>
            </div>
            <p>
              {data.description}
              <br />
            </p>
          </div>
          <div className="md:col-span-2 max-lg:order-first max-lg:flex max-lg:justify-end ">
            <AddCartButton
              isAvailable={data?.quantity ? data?.quantity > 0 : false}
              productId={data.id}
              storeId={data.store?.id}
              stock={data.quantity}
            />
          </div>
        </div>
        <div className="md:w-2/3">
          <div className="space-y-4">
            <CustomerReviewList productId={data.id} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
