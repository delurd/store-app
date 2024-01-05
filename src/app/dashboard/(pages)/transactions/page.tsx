'use client';

import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import TransactionItem from '../../components/TransactionItem';
import s from './transactions.module.css';
import Link from 'next/link';
import {parseAsInteger, parseAsString, useQueryState} from 'next-usequerystate';
import {useQuery} from '@tanstack/react-query';
import {useFetch} from '@/hooks/fetch/useFetch';
import Loader from '@/components/Loader/Loader';
import {TransactionType} from '@/utils/interfaces/globalTypes';
import PaginationNumber from '@/components/Pagination/PaginationNumber';
import {motion} from 'framer-motion';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';
import TransactionList from '../../components/TransactionList';

type Props = {};

const TransactionPage = (props: Props) => {
  const {fetchWithToken} = useFetch();
  const [navigationUnderline, setNavigationUnderline] = useState({
    position: 0,
    width: 0,
  });

  const [typeTransaction, setTypeTransaction] = useQueryState(
    'type',
    parseAsString.withDefault('sell')
  );
  const [page, setpage] = useQueryState('page', parseAsInteger.withDefault(1));

  useEffect(() => {
    setTypeTransaction((prev) => prev);
  }, []);
  useEffect(() => {
    // console.log('update ' + typeTransaction);
    setpage(1);

    const activeElement = document.querySelector(
      '.transaction-nav ul li.active'
    );
    const element = activeElement as HTMLElement;

    setNavigationUnderline({
      position: element?.offsetLeft,
      width: element?.scrollWidth,
    });
  }, [typeTransaction]);

  const navigateUrl = `transactions/${typeTransaction}/details/`;

  const {data, isLoading}: {data: any | undefined; isLoading: boolean} =
    useQuery({
      queryKey: ['transaction', typeTransaction, page],
      queryFn: async () => {
        const type = typeTransaction;
        return fetchWithToken(
          '/api/user/transactions/' + type + '?page=' + page
        ).then(async (res) => await res.json().then((json) => json.data));
      },
    });

  const listTransaction = data?.data as any[];
  const totalData = data?.total;
  // console.log(totalData);

  return (
    <div className={s.transaction}>
      <Header
        title="Transactions"
        description={<p>Big result start from the small one</p>}
      />
      <div className="relative">
        <div className={'mb-4 transaction-nav ' + s.transactionNav}>
          <ul className="flex gap-10">
            <li
              onClick={(e) => {
                setTypeTransaction('sell');
              }}
              className={typeTransaction == 'sell' ? 'active' : ''}
            >
              <button>Sell Product</button>
            </li>
            <li
              onClick={(e) => {
                setTypeTransaction('buy');
              }}
              className={typeTransaction == 'buy' ? 'active' : ''}
            >
              <button>Buy Product</button>
            </li>
          </ul>
          <div
            className={'h-0.5 bg-black duration-300'}
            style={{
              width: navigationUnderline.width + 'px',
              translate: navigationUnderline.position + 'px',
            }}
          ></div>
        </div>
        <TransactionList typeTransaction={typeTransaction} />
      </div>
    </div>
  );
};

export default TransactionPage;
