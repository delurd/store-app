'use client';
import Button from '@/components/Button/Button';
import Header from '../../components/Header';
import ProductCard from './ProductCard';
import Link from 'next/link';
import {useQuery} from '@tanstack/react-query';
import {useFetch} from '@/hooks/fetch/useFetch';
import Loader from '@/components/Loader/Loader';
import {ProductDataType} from '@/utils/interfaces/globalTypes';
import {motion} from 'framer-motion';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';

type Props = {};

const ProductPage = (props: Props) => {
  const {fetchWithToken} = useFetch();
  const {
    data,
    isLoading,
  }: {data: ProductDataType[] | undefined; isLoading: boolean} = useQuery({
    queryKey: ['products'],
    queryFn: async () =>
      fetchWithToken('/api/user/products').then((res) =>
        res.json().then((json) => json?.data)
      ),
  });

  return (
    <div>
      <Header
        title="My Products"
        description={<p>Manage it well and get money</p>}
      />
      <div>
        <Link href={'products/create'}>
          <Button className="bg-success text-white rounded-md">
            Add New Product
          </Button>
        </Link>
        <>
          {isLoading ? (
            <div className="flex-center p-10 w-full">
              <Loader size="medium" />
            </div>
          ) : (
            data &&
            data?.length && (
              <motion.div
                variants={varianFadeUpListContainer}
                initial={'hidden'}
                animate={'show'}
                className="my-8 flex flex-wrap gap-10"
              >
                {data?.map((data: ProductDataType, idx) => (
                  <motion.div key={idx} variants={varianFadeUpListItem}>
                    <ProductCard
                      category={data?.category}
                      title={data?.name}
                      slug={data?.slug}
                      imagePath={data.thumbnailPath}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
          {!isLoading && !data?.length ? (
            <p className="text-center text-grey-dark">No Products</p>
          ) : null}
          {/* </div> */}
        </>
      </div>
    </div>
  );
};

export default ProductPage;
