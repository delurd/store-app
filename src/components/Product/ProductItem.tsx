'use client';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';
import {Transition} from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  idProduct?: string;
  title?: string;
  price?: string;
  thumbnailPath?: string;
  index?: number;
};

const ProductItem = (props: Props) => {
  const delay = 1000;
  // console.log(props.index);
  // console.log(props.title);

  return (
    <Link href={'/product/details/' + props.idProduct}>
      {/* <Transition
        appear={true}
        show={true}
        enter={`transition-opacity ease-[ease-[cubic-bezier(0.03, 0.98, 0.52, 0.99)]] ${'duration-[1000ms]'}`}
        enterFrom="opacity-0"
        enterTo="opacity-100"
      > */}
      <div className="cursor-pointer  rounded-lg border-b border-transparent group hover:border-grey">
        <Image
          alt=""
          src={
            props.thumbnailPath ? props.thumbnailPath : '/images/noimage.png'
          }
          className="w-60 h-40 object-cover rounded-lg duration-200 group-hover:shadow-xl"
        />
        <div className="my-3">
          <h3>{props.title}</h3>
          <p className="text-warning">Rp{formatToCurency(props.price ?? 0)}</p>
        </div>
      </div>
      {/* </Transition> */}
    </Link>
  );
};

export default ProductItem;
