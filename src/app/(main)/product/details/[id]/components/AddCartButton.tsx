'use client';
import Button from '@/components/Button/Button';
import Loader from '@/components/Loader/Loader';
import {useFetch} from '@/hooks/fetch/useFetch';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import React from 'react';
import {toast} from 'react-toastify';

type Props = {
  productId?: string;
  quantity?: number;
  isAvailable?: boolean;
  storeId?: string;
  stock?: number;
};

const AddCartButton = (props: Props) => {
  const {
    data: dataUser,
    status,
  }: {data: any; status: 'authenticated' | 'loading' | 'unauthenticated'} =
    useSession();
  const {fetchWithToken} = useFetch();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['addCart'],
    mutationFn: async () =>
      fetchWithToken(
        '/api/user/cart',
        'POST',
        JSON.stringify({productId: props.productId})
      ).then((res) => res.json().then((json) => json.data)),
    onSuccess: async (data) => {
      toast('Added to cart!');
      queryClient.setQueryData(['cart'], (old: []) => [...old, data]);
    },
    onError: async () => {
      toast('Failed!');
    },
  });

  const actionAddToCart = async () => {
    const dataCart: [] | undefined = queryClient.getQueryData(['cart']);

    if (status == 'unauthenticated') {
      toast('Please signin first!', {autoClose: 3000});
      return;
    }

    if (dataCart && props.stock) {
      const getProductFromCart = dataCart.filter(
        (data: any) => data?.productId == props.productId
      );

      if (getProductFromCart.length >= props.stock) {
        toast('Stock limit!');
        return;
      }
      // console.log('CART DATACart', dataCart, props.productId);

      if (props.isAvailable) {
        mutation.mutate();
      }
    } else {
      toast('Wait a moment and try again');
    }
  };

  if (props.storeId == dataUser?.user?.storeId) return <></>;
  return (
    <>
      <Button
        onClick={actionAddToCart}
        className={`w-full text-white ${
          props.isAvailable ? 'bg-success' : 'bg-grey-dark'
        }`}
      >
        {mutation.isPending ? (
          <Loader size="small" theme="light" />
        ) : props.isAvailable ? (
          'Add to Cart'
        ) : (
          'Out of Stock'
        )}
      </Button>
    </>
  );
};

export default AddCartButton;
