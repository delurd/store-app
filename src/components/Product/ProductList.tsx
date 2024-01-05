'use client';
import {useQuery} from '@tanstack/react-query';
import ProductItem from './ProductItem';
import {useFetch} from '@/hooks/fetch/useFetch';
import {ProductViewType} from '@/utils/interfaces/globalTypes';
import Skeleton from '../Skeleton/Skeleton';
import {motion} from 'framer-motion';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';
import {parseAsInteger, useQueryState} from 'next-usequerystate';
import PaginationNumber from '../Pagination/PaginationNumber';
import {useEffect, useState} from 'react';

type Props = {
  query?: string;
  isPaginate?: boolean;
};

const ProductList = (props: Props) => {
  const {fetchData} = useFetch();
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [totalPage, setTotalPage] = useState(1);

  const query = '?page=' + page + (props.query ? `&${props.query}` : '');
  const isPaginate = props.isPaginate ?? true;

  const {
    data,
    isLoading,
  }: {
    data: {data: ProductViewType[]; total: number} | undefined;
    isLoading: boolean;
  } = useQuery({
    queryKey: ['productItem', query],
    queryFn: async () =>
      fetchData('/api/products/view' + query).then(async (res) =>
        res.json().then((json) => json.data)
      ),
  });

  useEffect(() => {
    data?.total && setTotalPage(data?.total);
  }, [data]);

  return (
    <div>
      {isLoading ? (
        <div className="flex gap-9 flex-wrap">
          {Array(4)
            .fill('')
            .map((val, idx) => (
              <div className="w-60 h-60" key={idx}>
                <Skeleton className="h-full" />
              </div>
            ))}
        </div>
      ) : data && data?.data?.length ? (
        <motion.div
          variants={varianFadeUpListContainer}
          initial={'hidden'}
          animate={'show'}
          className="flex gap-9 flex-wrap"
        >
          {data?.data?.map((item, idx: number) => (
            <motion.div key={idx} variants={varianFadeUpListItem}>
              <ProductItem
                idProduct={item.slug ?? ''}
                price={item.price}
                thumbnailPath={item.thumbnailPath}
                title={item.name}
                index={idx}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : null}
      {!isLoading && !data?.data.length && (
        <p className="text-center text-grey-dark">No Products</p>
      )}
      {isPaginate && totalPage > 1 ? (
        <PaginationNumber
          totalPage={totalPage}
          page={page}
          setPage={(val) => {
            setPage(val, {history: 'push'});
          }}
        />
      ) : null}
    </div>
  );
};

export default ProductList;
