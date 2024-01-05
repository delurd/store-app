'use client';

import Header from '@/app/dashboard/components/Header';
import Button from '@/components/Button/Button';
import {useFetch} from '@/hooks/fetch/useFetch';
import {ProductTransactionType} from '@/utils/interfaces/globalTypes';
import {useQuery} from '@tanstack/react-query';
import moment from 'moment';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import React, {useState} from 'react';
import ProductItemTransaction from '../../../components/ProductItemTransaction';
import NotFound from '@/components/Errors/NotFound';

type Props = {};

const statusShipping = {
  pending: 'Pending',
  shipping: 'Shipping',
};

type transactionDetailBuyResponseType = {
  ProductsTransaction: ProductTransactionType[];
  id: string;
  shippingStatus: string;
  totalPrice: string;
  transaction: {createdAt: string; paymentStatus: string};
  transactionId: string;
};

const TransactionDetailsBuy = ({params}: {params: {id: string}}) => {
  const {fetchWithToken} = useFetch();
  const {data}: {data: any} = useSession();

  const {data: accountData, isLoading: loadingAccount} = useQuery({
    queryKey: ['account'],
    queryFn: () =>
      fetchWithToken('/api/user/account').then((data) =>
        data.json().then((json) => json.data)
      ),
  });

  const {data: dataRes, isLoading} = useQuery({
    queryKey: ['transactionDetail', params.id],
    queryFn: async () =>
      fetchWithToken('/api/user/transactions/buy/details/' + params.id).then(
        (res) => res.json().then((json) => json.data)
      ),
  });
  if (isLoading || loadingAccount) return <></>;
  if (!dataRes) return <NotFound />;

  const dataTransaction = dataRes as transactionDetailBuyResponseType;
  const shippingStatus =
    statusShipping[dataTransaction.shippingStatus as 'pending' | 'shipping'];
  const storeName = dataTransaction.ProductsTransaction.length
    ? dataTransaction.ProductsTransaction[0].product.store?.name
    : '';

  // console.log(dataTransaction.ProductsTransaction);

  return (
    <div>
      <Header
        title={'Buying Products'}
        description={
          <p className="flex gap-7 text-grey-secondary font-medium">
            <Link href={'../../'}>Transactions</Link> <span>/</span>{' '}
            <span className="text-black">Details</span>
          </p>
        }
      />
      <div className="bg-white p-9 rounded-lg mb-6 space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          <div>
            <p className="text-grey-dark mb-2">Products</p>
            {/* <div className="w-full aspect-square bg-grey-base rounded-lg"></div> */}
            <div className="flex flex-col gap-2">
              {dataTransaction?.ProductsTransaction.map((data, idx) => (
                <ProductItemTransaction key={idx} product={data.product} />
              ))}
            </div>
          </div>
          <div className="space-y-5 [&>div]:space-y-1">
            <div>
              <p className="text-grey-dark">Store Name</p>
              <h3>{storeName}</h3>
            </div>
            <div>
              <p className="text-grey-dark">Date of Transaction</p>
              <h3>
                {moment(dataTransaction.transaction.createdAt).format(
                  'DD MMMM, YYYY'
                )}
              </h3>
            </div>
            <div>
              <p className="text-grey-dark">Total Amount</p>
              <h3>Rp{dataTransaction.totalPrice}</h3>
            </div>
          </div>
          <div className="space-y-5 [&>div]:space-y-1">
            <div>
              <p className="text-grey-dark">Customer Name</p>
              <h3>{data.user.fullname}</h3>
            </div>

            <div>
              <p className="text-grey-dark">Payment Status</p>
              <h3
                className={
                  shippingStatus == 'Shipping' ? 'text-success' : 'text-alert'
                }
              >
                {shippingStatus == 'Pending' ? shippingStatus : 'Success'}
              </h3>
            </div>
            <div>
              <p className="text-grey-dark">Phone</p>
              <h3>{accountData?.phone ?? '-'}</h3>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-5">Shipping Information</h3>
          <div className="grid md:grid-cols-2 gap-5 [&>div]:space-y-1">
            <div>
              <p className="text-grey-dark">Address 1</p>
              <h3>{accountData?.address1}</h3>
            </div>
            <div>
              <p className="text-grey-dark">Address 2</p>
              <h3>{accountData?.address2}</h3>
            </div>
            <div>
              <p className="text-grey-dark">Provice</p>
              <h3>{accountData?.provice}</h3>
            </div>
            <div>
              <p className="text-grey-dark">City</p>
              <h3>{accountData?.city}</h3>
            </div>
            <div>
              <p className="text-grey-dark">Postal Code</p>
              <h3>{accountData?.postalCode}</h3>
            </div>
            <div>
              <p className="text-grey-dark">Country</p>
              <h3>{accountData?.country}</h3>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-grey-dark">Shipping Status</p>
          <div className="flex max-md:flex-col gap-4">
            {/* <Input
              value={shippingStatus}
              className="max-w-max"
              onChange={() => {}}
            /> */}
            <div className=" md:w-44 p-3 bg-grey-base rounded-lg ">
              {shippingStatus}
            </div>
            {shippingStatus == 'Shipping' ? (
              <div className="bg-grey-base p-2 md:h-12 rounded-lg max-sm:inline-block  flex-center  break-words">
                <span className="mr-3">JNE128371298379124812764</span>
                <button
                  title="copy"
                  className="bg-grey h-8 aspect-square rounded-md duration-200 active:scale-95"
                  onClick={() => {
                    navigator.clipboard.writeText('copied text');
                  }}
                >
                  ❏
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex justify-end">
          {/* <Button className="bg-success text-white px-12">Save Now</Button> */}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsBuy;
