import Button from '@/components/Button/Button';
import Loader from '@/components/Loader/Loader';
import {useFetch} from '@/hooks/fetch/useFetch';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {motion} from 'framer-motion';
import React, {useState} from 'react';
import {toast} from 'react-toastify';
import ProductItemTransaction from '../(pages)/transactions/components/ProductItemTransaction';

type Props = {
  data?: any;
};

const BillingDetail = (props: Props) => {
  const {fetchWithToken} = useFetch();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async (paymentStatus?: 'success' | 'canceled') =>
      await fetchWithToken(
        '/api/user/transactions/payment',
        'PUT',
        JSON.stringify({paymentStatus, transactionId: props.data?.id ?? ''})
      ),
    onSuccess: async (data) => {
      queryClient.setQueryData(['bill', '1'], (old: any[]) =>
        old.filter((data) => data?.id !== props.data?.id)
      );
      setIsSuccess(true);
      toast('Payment Success');
    },
    onError: async (data) => {
      toast('Payment Failed!');
    },
  });

  return (
    <>
      {isSuccess ? (
        <motion.div
          initial={'hidden'}
          animate={'show'}
          variants={varianFadeUpListContainer}
          className="flex-center flex-col gap-2 h-[230px]"
        >
          <motion.div variants={varianFadeUpListItem} className="flex-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.55 36.85L38.075 51.375L72.55 16.9"
                stroke="#29A867"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M57.2691 9.55C52.1736 6.65395 46.28 5 40 5C20.67 5 5 20.67 5 40C5 59.33 20.67 75 40 75C59.33 75 75 59.33 75 40C75 38.458 74.9003 36.9393 74.7069 35.45"
                stroke="#29A867"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
          <motion.h2 variants={varianFadeUpListItem} className="text-success">
            Success
          </motion.h2>
        </motion.div>
      ) : (
        <div className="space-y-5 relative">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-warning">Payment Code</p>
              <div className="bg-grey-base p-2 md:h-12 rounded-lg max-w-max flex-center break-words overflow-hidden">
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
            <div className="flex ">
              <div className="space-y-2 flex-1">
                <p className="text-warning">Payment Duration</p>
                <h1>23:50:15</h1>
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-warning">Total Payment</p>
                <h1>
                  Rp
                  {props.data?.paymentTotal
                    ? formatToCurency(props.data?.paymentTotal)
                    : '-'}
                </h1>
              </div>
            </div>
          </div>
          <hr />
          <div>
            <p className="text-grey-dark mb-2">Products</p>
            <div className="space-y-2">
              {props.data?.StoreTransaction?.map(
                (productsTransaction: any, index: number) => (
                  <div key={index} className="flex flex-col gap-2">
                    {productsTransaction.ProductsTransaction?.map(
                      (product: any, idx: number) => (
                        <ProductItemTransaction
                          key={idx}
                          product={product?.product}
                        />
                      )
                    )}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex justify-between sticky bg-white p-2 rounded-xl bottom-0">
            <Button
              className="max-h-max text-grey-dark border border-transparent duration-200 hover:text-alert hover:border-alert"
              onClick={() => {
                !mutation.isPending && mutation.mutate('canceled');
              }}
            >
              {mutation.isPending ? <Loader size="small" /> : 'Cancel Purchase'}
            </Button>
            <Button
              className="max-h-max bg-success text-white"
              onClick={() => {
                !mutation.isPending && mutation.mutate('success');
              }}
            >
              {mutation.isPending ? (
                <Loader size="small" theme="light" />
              ) : (
                'Pay'
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BillingDetail;
