'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  name?: string;
  urlIcons?: string;
  onClick?: () => void;
};

const CategoriesMenuItem = (props: Props) => {
  return (
    <Link
      href={'/categories/' + props.name?.toLowerCase().replaceAll(' ', '-')}
    >
      <div
        onClick={props.onClick}
        className="w-36 h-40 bg-grey-base flex-center flex-shrink-0 flex-col gap-3 rounded-lg hover:shadow-xl duration-200 cursor-pointer"
      >
        <div className="w-20 h-20 p-5 rounded-full flex-center bg-grey">
          <img
            alt="category-icon"
            className="w-full h-full object-contain"
            src={
              props.urlIcons ? props.urlIcons : './icons/categories/goods.svg'
            }
          />
        </div>
        <h3>{props.name}</h3>
      </div>
    </Link>
  );
};

export default CategoriesMenuItem;
