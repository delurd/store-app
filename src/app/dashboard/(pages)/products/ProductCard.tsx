import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  title?: string;
  category?: string;
  slug?: string;
  imagePath?: string;
};

const ProductCard = (props: Props) => {
  return (
    <Link href={'products/' + props.slug}>
      <div className="p-3 bg-white rounded-lg hover:shadow-xl duration-300 cursor-pointer w-[238px] overflow-hidden h-full">
        <img
          src={props.imagePath ? props.imagePath : '/images/noimage.png'}
          alt="product-image"
          className="h-40 w-[214px] object-cover rounded-md mb-5"
        />
        <h3>{props.title}</h3>
        <p className="text-grey-dark">{props.category}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
