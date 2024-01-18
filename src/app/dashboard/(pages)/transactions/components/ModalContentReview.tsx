'use client';
import Button from '@/components/Button/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader/Loader';
import {useFetch} from '@/hooks/fetch/useFetch';
import {useMutation} from '@tanstack/react-query';
import {motion} from 'framer-motion';
import {useSession} from 'next-auth/react';
import React, {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';

type Props = {
  productList?: any[];
};

const ModalContentReview = (props: Props) => {
  const {fetchWithToken} = useFetch();
  const [selectedProduct, setSelectedProduct] = useState<any>({});
  const [review, setReview] = useState('');
  const {data}: {data: any} = useSession();
  const [productList, setProductList] = useState(props.productList);

  const filterProduct = useMemo(() => {
    return productList
      ? // ? props.productList?.filter((item) => item.CustomerReview == null)
        productList
      : [];
  }, [productList]);

  const mutation = useMutation({
    mutationFn: async (body: string) =>
      fetchWithToken('/api/user/transactions/review', 'POST', body).then(
        async (res) => await res.json().then((json) => json.data)
      ),
    onSuccess: async (data) => {
      setProductList(
        productList?.map((item) => {
          if (item?.id !== selectedProduct?.id) return item;
          console.log(item);

          return {...item, CustomerReview: {review}};
        })
      );
      setSelectedProduct({});
      toast('Review Accepted!');
    },
    onError: async () => {
      toast('Failed!');
    },
  });

  const actionSendReview = async () => {
    if (selectedProduct?.id && review) {
      const body = JSON.stringify({
        name: data?.user?.fullname,
        review,
        id: selectedProduct?.id,
      });

      mutation.mutate(body);
    }
  };

  useEffect(() => {
    if (selectedProduct?.id && selectedProduct?.CustomerReview?.review) {
      setReview(selectedProduct?.CustomerReview?.review);
    } else setReview('');
  }, [selectedProduct]);

  return (
    <motion.div
      className="h-80 overflow-y-auto overflow-x-hidden relative"
      initial={false}
      animate={selectedProduct?.id ? 'page2' : 'page1'}
    >
      {/* {selectedProduct?.id ? ( */}
      <motion.div
        className="absolute bg-white inset-0 z-10 p-5"
        variants={{
          page1: {
            opacity: 0,
            transitionEnd: {
              display: 'none',
            },
          },
          page2: {
            opacity: 1,
            display: 'block',
          },
        }}
      >
        <motion.div
          variants={{
            page1: {
              opacity: 0,
              x: 500,
            },
            page2: {
              opacity: 1,
              x: 0,
            },
          }}
          className="h-full flex flex-col justify-between"
        >
          <div className="mb-4">
            <p className="text-grey-dark">Product</p>
            <h3 className="mb-2">{selectedProduct?.product?.name}</h3>

            <label
              htmlFor="review"
              className="mb-2 inline-block text-grey-dark"
            >
              Review
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full bg-grey-base rounded-lg min-h-28 focus:outline-success p-3"
            ></textarea>
          </div>
          <div className="flex justify-between">
            <button
              className="px-3 active:scale-95 flex items-center"
              onClick={() => setSelectedProduct({})}
            >
              <span className="text-xs inline-block mr-2 pt-0.5">❮</span> Back
            </button>
            {!selectedProduct?.CustomerReview && (
              <Button
                className="bg-success text-white px-12"
                onClick={actionSendReview}
              >
                {mutation.isPending ? (
                  <Loader size="small" theme="light" />
                ) : (
                  'Send Review'
                )}
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
      {/* ) : ( */}
      <div>
        <div className="space-y-2 p-5">
          <p className="text-grey-dark">Select Product</p>
          {filterProduct.map((item, idx) => (
            <button
              key={idx}
              className={`p-3 border-2 rounded-lg flex justify-between items-center w-full duration-200 active:scale-95`}
              onClick={() => setSelectedProduct(item)}
            >
              {item?.product?.name}
              <p className="px-2 text-grey">❯</p>
            </button>
          ))}
        </div>
      </div>
      {/* )} */}
    </motion.div>
  );
};

export default ModalContentReview;
