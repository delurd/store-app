// 'use client';
import Button from '@/components/Button/Button';
import CustomerReview from '@/components/CustomerReview/CustomerReviewItem';
import {host} from '@/utils/variables';
import {useQuery} from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import BackButton from './components/BackButton';
import {ProductDataType} from '@/utils/interfaces/globalTypes';
import ImagesView from './components/ImagesView';
import AddCartButton from './components/AddCartButton';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';

type Props = {};

const getData = async (slug: string) => {
  return await fetch(host + '/api/products/details/' + slug)
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

  // console.log(data);

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
              <h1>{data.name}</h1>
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
            <AddCartButton productId={data.id} />
          </div>
        </div>
        <div className="md:w-2/3">
          <div className="space-y-4">
            <h3>Customer Review (3)</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {Array(5)
                .fill('')
                .map((val, idx) => (
                  <CustomerReview key={idx} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailPage;
