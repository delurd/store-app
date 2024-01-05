'use client';
import {CategoriesDatasType} from '@/utils/data/category';
import CategoriesMenuItem from './CategoriesMenuItem';
import {motion} from 'framer-motion';
import {
  varianOpacityListContainer,
  varianOpacityListItem,
} from '@/utils/helper/variants';

type Props = {
  categoriesData?: CategoriesDatasType[];
};

const CategoriesMenu = (props: Props) => {
  return (
    <motion.div
      // variants={varianOpacityListContainer}
      // initial={'hidden'}
      // animate={'show'}
      className="flex gap-10 flex-wrap "
    >
      {props.categoriesData?.map((data, idx) => (
        <motion.div key={idx}>
          <CategoriesMenuItem name={data.title} urlIcons={data.icons} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoriesMenu;
