'use client';

import Header from '@/app/dashboard/components/Header';
import Button from '@/components/Button/Button';
import {useFetch} from '@/hooks/fetch/useFetch';
import {ProductTransactionType} from '@/utils/interfaces/globalTypes';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import moment from 'moment';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import React, {useState} from 'react';
import ProductItemTransaction from '../../../components/ProductItemTransaction';
import NotFound from '@/components/Errors/NotFound';
import Loader from '@/components/Loader/Loader';
import {statusShippingType} from '@/app/dashboard/action';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';
import Modal from '@/components/Modal/Modal';
import ButtonCloseModal from '@/components/Modal/ButtonCloseModal';
import ModalContentReview from '../../../components/ModalContentReview';

type Props = {};

type transactionDetailBuyResponseType = {
  ProductsTransaction: ProductTransactionType[];
  id: string;
  shippingStatus: string;
  shippingReceipt: string;
  shippingPrice: string;
  totalPrice: string;
  transaction: {createdAt: string; paymentStatus: string};
  transactionId: string;
};

const TransactionDetailsBuy = ({params}: {params: {id: string}}) => {
  const queryClient = useQueryClient();
  const {fetchWithToken} = useFetch();
  const {data}: {data: any} = useSession();
  const [isShowModalReview, setIsShowModalReview] = useState(false);

  const mutationStatus = useMutation({
    mutationFn: async (id: string) =>
      fetchWithToken(
        '/api/user/transactions/sell/shipping',
        'PUT',
        JSON.stringify({
          status: 'success',
          id,
        })
      ).then((res) => res.json().then((json) => json.data)),
    onSuccess: async (data) => {
      queryClient.setQueryData(['transactionDetail', params.id], (old: any) => {
        return {...old, shippingStatus: 'success'};
      });
    },
  });

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

  const dataTransaction = dataRes as transactionDetailBuyResponseType;
  const shippingStatus =
    statusShippingType[
      dataTransaction?.shippingStatus as 'pending' | 'shipping'
    ];
  const storeName = dataTransaction?.ProductsTransaction.length
    ? dataTransaction?.ProductsTransaction[0].product.store?.name
    : '';

  // console.log(dataTransaction);

  return (
    <div className="min-h-full flex flex-col">
      <Header
        title={'Buying Products'}
        description={
          <p className="flex gap-7 text-grey-secondary font-medium">
            <Link href={'../../'}>Transactions</Link> <span>/</span>{' '}
            <span className="text-black">Details</span>
          </p>
        }
      />
      {isLoading ? (
        <div className="flex-center flex-1">
          <Loader size="medium" />
        </div>
      ) : !dataRes ? (
        <div className="flex-center flex-1">
          <NotFound />
        </div>
      ) : (
        <>
          <div className="bg-white p-9 rounded-lg mb-6 space-y-6">
            {dataTransaction?.transaction?.paymentStatus !== 'success' ? (
              <>
                <div className="mb-10 relative flex max-md:flex-col gap-2 justify-between">
                  <div className="flex max-lg:flex-col gap-y-5 gap-x-10">
                    <div className="space-y-2">
                      <p className="text-warning">Payment Bill</p>
                      <div className="bg-grey-base p-2 md:h-12 rounded-lg max-w-max  flex-center  break-words overflow-hidden">
                        <span className="mr-3">BNI128371298379124812764</span>
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
                    </div>
                    <div className="space-y-2">
                      <p className="text-warning">Payment Duration</p>
                      <h1>23:50:15</h1>
                    </div>
                  </div>
                  <div className="flex justify-end flex-shrink-0">
                    <div>
                      <Button className="max-h-max text-grey-dark border border-transparent duration-200 hover:text-alert hover:border-alert">
                        Cancel Purchase
                      </Button>
                    </div>
                  </div>
                </div>
                <hr />
              </>
            ) : null}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              <div>
                <p className="text-grey-dark mb-2">Products</p>
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
                    {moment(dataTransaction?.transaction.createdAt).format(
                      'DD MMMM, YYYY'
                    )}
                  </h3>
                </div>
                <div>
                  <p className="text-grey-dark">Total Amount</p>
                  <h3>
                    Rp
                    {dataTransaction?.totalPrice
                      ? formatToCurency(dataTransaction?.totalPrice)
                      : '-'}
                  </h3>
                </div>
              </div>
              <div className="space-y-5 [&>div]:space-y-1">
                <div>
                  <p className="text-grey-dark">Customer Name</p>
                  <h3>{data?.user.fullname}</h3>
                </div>

                <div>
                  <p className="text-grey-dark">Payment Status</p>
                  <h3
                    className={
                      dataTransaction?.transaction?.paymentStatus == 'success'
                        ? 'text-success'
                        : 'text-alert'
                    }
                  >
                    {dataTransaction?.transaction?.paymentStatus}
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
                <div className=" md:w-44 p-3 bg-grey-base rounded-lg ">
                  {shippingStatus}
                </div>
                {shippingStatus == 'Shipping' || shippingStatus == 'Success' ? (
                  <div className="bg-grey-base p-2 md:h-12 rounded-lg max-sm:inline-block  flex-center  break-words">
                    <span className="mr-3">
                      {dataTransaction?.shippingReceipt}
                    </span>
                    <button
                      title="copy"
                      className="bg-grey h-8 aspect-square rounded-md duration-200 active:scale-95"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          dataTransaction?.shippingReceipt
                        );
                      }}
                    >
                      ❏
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex justify-end">
              {dataTransaction?.shippingStatus == 'shipping' && (
                <Button
                  className="bg-success text-white px-12"
                  onClick={() => {
                    mutationStatus.mutate(dataTransaction.id);
                  }}
                >
                  {mutationStatus.isPending ? (
                    <Loader size="small" theme="light" />
                  ) : (
                    'Done'
                  )}
                </Button>
              )}
              {dataTransaction?.shippingStatus == 'success' && (
                <Button
                  className="bg-success text-white px-12"
                  onClick={() => {
                    setIsShowModalReview(true);
                  }}
                >
                  Review
                </Button>
              )}
            </div>
          </div>
          <Modal
            onClose={() => {
              setIsShowModalReview(false);
            }}
            show={isShowModalReview}
            className="bg-white rounded-lg "
          >
            <div className="flex justify-between items-center p-5">
              <h1>Review</h1>
              <ButtonCloseModal onClick={() => setIsShowModalReview(false)} />
            </div>
            <hr />
            <ModalContentReview
              productList={dataTransaction?.ProductsTransaction}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default TransactionDetailsBuy;
