'use client';
import React from 'react';
import CategoriesMenuItem from './CategoriesMenuItem';
import {categoriesDatas} from '@/utils/data/category';
import {motion} from 'framer-motion';
import {
  varianOpacityListContainer,
  varianOpacityListItem,
} from '@/utils/helper/variants';

type Props = {};

const TrendCategories = (props: Props) => {
  return (
    <motion.div
      variants={varianOpacityListContainer}
      initial={'hidden'}
      animate={'show'}
      className="flex gap-10 flex-wrap "
    >
      {categoriesDatas.slice(0, 6).map((data, idx) => (
        <motion.div key={idx} variants={varianOpacityListItem}>
          <CategoriesMenuItem name={data.title} urlIcons={data.icons} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TrendCategories;
