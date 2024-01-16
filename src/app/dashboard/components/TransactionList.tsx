'use client';
import TransactionItem from '@/app/dashboard/components/TransactionItem';
import Loader from '@/components/Loader/Loader';
import PaginationNumber from '@/components/Pagination/PaginationNumber';
import {useFetch} from '@/hooks/fetch/useFetch';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';
import {host} from '@/utils/variables';
import {useQuery} from '@tanstack/react-query';
import {motion} from 'framer-motion';
import {parseAsInteger, useQueryState} from 'next-usequerystate';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';

type Props = {
  typeTransaction: string; //'sell' | 'buy'
  query?: string;
  isPaginate?: boolean;
};

const TransactionList = (props: Props) => {
  const {fetchWithToken} = useFetch();
  const [page, setpage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [totalPage, setTotalPage] = useState(1);

  const query = '?page=' + page + (props.query ? `&${props.query}` : '');
  const isPaginate = props.isPaginate ?? true;
  const type = props.typeTransaction ?? 'sell';
  const navigateUrl = `/dashboard/transactions/${type}/details/`;

  const {data, isLoading}: {data: any | undefined; isLoading: boolean} =
    useQuery({
      queryKey: ['transaction', type, page],
      queryFn: async () =>
        fetchWithToken('/api/user/transactions/' + type + query).then(
          async (res) => await res.json().then((json) => json.data)
        ),
    });

  const listTransaction = data?.data as any[];

  useEffect(() => {
    data?.total && setTotalPage(data?.total);
  }, [data]);

  return (
    <>
      <>
        {isLoading ? (
          <div className="flex-center p-10">
            <Loader size="medium" />
          </div>
        ) : (
          <>
            {listTransaction && listTransaction?.length ? (
              <motion.div
                variants={varianFadeUpListContainer}
                initial={'hidden'}
                animate={'show'}
                className="flex flex-col gap-2"
              >
                {listTransaction.map((store, idx) => (
                  <motion.div key={idx} variants={varianFadeUpListItem}>
                    <Link href={navigateUrl + store.id}>
                      <TransactionItem
                        typetransaction={type}
                        products={
                          store.ProductsTransaction?.length
                            ? store.ProductsTransaction
                            : null
                        }
                        status={store.shippingStatus}
                        buyer={store.transaction.buyer?.fullname}
                        date={store.transaction.createdAt}
                      />
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </>
        )}
      </>
      {!isLoading && !listTransaction?.length && (
        <p className="text-center text-grey-dark p-10">No Transaction</p>
      )}
      <div className="mt-5">
        {isPaginate && totalPage > 1 ? (
          <PaginationNumber
            page={page}
            setPage={(page) => {
              setpage(page);
            }}
            totalPage={totalPage}
          />
        ) : null}
      </div>
    </>
  );
};

export default TransactionList;
