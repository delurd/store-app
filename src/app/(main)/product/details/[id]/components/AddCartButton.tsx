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
};

const AddCartButton = (props: Props) => {
  const {status} = useSession();
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
    if (status == 'unauthenticated') {
      toast('Please signin first!', {autoClose: 3000});
      return;
    }

    mutation.mutate();
  };

  return (
    <Button onClick={actionAddToCart} className="w-full bg-success text-white">
      {mutation.isPending ? (
        <Loader size="small" theme="light" />
      ) : (
        'Add to Cart'
      )}
    </Button>
  );
};

export default AddCartButton;
