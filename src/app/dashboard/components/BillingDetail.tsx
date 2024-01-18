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
import Image from 'next/image';

type Props = {
  data?: any;
};

const BillingDetail = (props: Props) => {
  const {fetchWithToken} = useFetch();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  const mutation = useMutation({
    mutationFn: async (paymentStatus?: 'success' | 'canceled') =>
      await fetchWithToken(
        '/api/user/transactions/payment',
        'PUT',
        JSON.stringify({paymentStatus, transactionId: props.data?.id ?? ''})
      ).then(async (res) => await res.json().then((json) => json.data)),
    onSuccess: async (data) => {
      // console.log(data);
      queryClient.setQueryData(['bill', '1'], (old: any[]) =>
        old.filter((data) => data?.id !== props.data?.id)
      );
      setPaymentStatus(data?.paymentStatus);
      setIsSuccess(true);
    },
    onError: async (data) => {
      toast('Failed to Process!');
    },
  });

  return (
    <>
      {isSuccess ? (
        <motion.div
          initial={'hidden'}
          animate={'show'}
          variants={varianFadeUpListContainer}
          className="flex-center flex-col gap-2 h-full text-center"
        >
          <motion.div
            initial={{y: 50, opacity: 0}}
            animate={{y: 0, opacity: 100}}
            transition={{velocity: -1000}}
          >
            <Image
              alt="Bag-icon"
              src="/icons/bag.svg"
              width={120}
              height={120}
              className="mb-10"
            />
          </motion.div>
          <motion.h1
            initial={{y: 50, opacity: 0}}
            animate={{y: 0, opacity: 100}}
            transition={{delay: 0.1, velocity: 100}}
            className="text-3xl mb-7"
          >
            {paymentStatus == 'canceled'
              ? 'Transaction Canceled!'
              : 'Transaction Processed!'}
          </motion.h1>
          <motion.p
            initial={{y: 50, opacity: 0}}
            animate={{y: 0, opacity: 100}}
            transition={{delay: 0.2, velocity: 100}}
            className="mb-14"
          >
            {paymentStatus == 'canceled'
              ? ''
              : `Terimakasih sudah melakukan pembayaran, kami akan menginformasikan
              resi secepat mungkin!`}
          </motion.p>
        </motion.div>
      ) : (
        <div className="space-y-5 relative h-full">
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
          <div className="flex justify-between absolute bg-white p-2 rounded-xl bottom-0 w-full">
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
