'use client';

import {
  varianOpacityListContainer,
  varianOpacityListItem,
} from '@/utils/helper/variants';
import {ProductImageType} from '@/utils/interfaces/globalTypes';
import {motion} from 'framer-motion';
import Image from 'next/image';
import {useState} from 'react';

type Props = {
  productImages: ProductImageType[];
  thumbnailPath?: string;
};

const ImagesView = (props: Props) => {
  const [selectedPreview, setSelectedPreview] = useState<string>(
    props.thumbnailPath ?? '/images/noimage.png'
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
      <motion.div
        initial={'hidden'}
        animate={'show'}
        variants={varianOpacityListContainer}
        className="sm:col-span-9 md:col-span-8 h-[400px]"
      >
        <Image
          alt="Preview"
          src={selectedPreview}
          className="w-full h-full object-cover hover:object-contain rounded-lg"
        />
      </motion.div>
      <div className="sm:col-span-3">
        <motion.div
          initial={'hidden'}
          animate={'show'}
          variants={varianOpacityListContainer}
          className="max-h-[400px] max-w-max overflow-auto flex sm:flex-col gap-5"
        >
          {props.productImages.map((image, idx) => (
            <motion.div
              key={idx}
              className="flex-shrink-0"
              onClick={() => {
                setSelectedPreview(image.path ?? '');
              }}
              variants={varianOpacityListItem}
            >
              <Image
                alt={'product-image' + idx}
                src={image.path ? image.path : '/images/banner.png'}
                className={
                  'h-[85px] aspect-video object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-warning ' +
                  (image.path == selectedPreview ? 'border-warning' : '')
                }
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ImagesView;
