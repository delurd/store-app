'use client';
import Header from '@/app/dashboard/components/Header';
import {useFetch} from '@/hooks/fetch/useFetch';
import {
  ProductTransactionType,
  UserAccountType,
} from '@/utils/interfaces/globalTypes';
import {useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import ProductItemTransaction from '../../../components/ProductItemTransaction';
import moment from 'moment';
import Button from '@/components/Button/Button';
import Select from '@/components/Select/Select';
import Input from '@/components/Input';
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
  transaction: {
    createdAt: string;
    paymentStatus: string;
    buyer: {fullname: string; UserProfile: UserAccountType};
  };
  transactionId: string;
};

const TransactionDetailsSell = ({params}: {params: {id: string}}) => {
  const {fetchWithToken} = useFetch();
  const {data}: {data: any} = useSession();
  const [shippingStatus, setShippingStatus] = useState('Pending');

  const {data: dataRes, isLoading} = useQuery({
    queryKey: ['transactionDetail', params.id],
    queryFn: async () =>
      fetchWithToken('/api/user/transactions/sell/details/' + params.id).then(
        (res) => res.json().then((json) => json.data)
      ),
  });

  useEffect(() => {
    dataRes &&
      setShippingStatus(
        statusShipping[dataRes.shippingStatus as 'pending' | 'shipping']
      );
  }, [dataRes]);

  // console.log(dataRes);

  if (isLoading) return <></>;
  if (!dataRes) return <NotFound />;

  const dataTransaction = dataRes as transactionDetailBuyResponseType;

  const storeName = dataTransaction.ProductsTransaction.length
    ? dataTransaction.ProductsTransaction[0].product.store?.name
    : '';
  const buyerName = dataTransaction.transaction.buyer.fullname;
  const buyerProfile = dataTransaction.transaction.buyer.UserProfile;

  // console.log(dataTransaction);

  return (
    <div>
      <Header
        title={'Selling Products'}
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
              <p className="text-grey-dark">Customer Name</p>
              <h3>{buyerName}</h3>
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
              <h3>{buyerProfile.phone}</h3>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-5">Shipping Information</h3>
          <div className="grid md:grid-cols-2 gap-5 [&>div]:space-y-1">
            <div>
              <p className="text-grey-dark">Address 1</p>
              <h3>{buyerProfile?.address1}</h3>
            </div>
            <div>
              <p className="text-grey-dark">Address 2</p>
              <h3>{buyerProfile?.address2}</h3>
            </div>
            <div>
              <p className="text-grey-dark">Provice</p>
              <h3>{buyerProfile?.provice}</h3>
            </div>
            <div>
              <p className="text-grey-dark">City</p>
              <h3>{buyerProfile?.city}</h3>
            </div>
            <div>
              <p className="text-grey-dark">Postal Code</p>
              <h3>{buyerProfile?.postalCode}</h3>
            </div>
            <div>
              <p className="text-grey-dark">Country</p>
              <h3>{buyerProfile?.country}</h3>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-grey-dark">Shipping Status</p>
          <div className="flex max-md:flex-col gap-4">
            <Select
              data={[
                {name: 'Pending', value: 'pending'},
                {name: 'Shipping', value: 'shipping'},
              ]}
              selectWidth="w-44"
              defaultValue={{
                name: shippingStatus,
                value: shippingStatus.toLowerCase(),
              }}
              getValue={(val) => {
                setShippingStatus(val.name);
              }}
            />
            {shippingStatus == 'Shipping' ? (
              <Input className="max-w-max" placeholder="Receipt code" />
            ) : null}
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="bg-success text-white px-12">Save Now</Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsSell;
