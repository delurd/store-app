'use client';
import Button from '@/components/Button/Button';
import Loader from '@/components/Loader/Loader';
import {useFetch} from '@/hooks/fetch/useFetch';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';
import {CartDataType} from '@/utils/interfaces/globalTypes';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useState} from 'react';
import {toast} from 'react-toastify';

type Props = {
  data?: CartDataType;
};

const CartItem = (props: Props) => {
  const product = props.data?.product;

  const {fetchWithToken, fetchData} = useFetch();
  const queryClient = useQueryClient();
  const [ongkir, setOngkir] = useState(0);

  const mutation = useMutation({
    mutationKey: ['cartItem', props.data?.id],
    mutationFn: async () =>
      fetchWithToken(
        '/api/user/cart',
        'DELETE',
        JSON.stringify({id: props.data?.id})
      ),
    onSuccess: async (data) => {
      queryClient.setQueryData(['cart'], (old: CartDataType[]) =>
        old.filter((data) => data.id !== props.data?.id)
      );
      toast('Product deleted from cart!');
    },
    onError: async () => {
      toast('Failed to delete!');
    },
  });

  return (
    <div className="grid md:grid-cols-12 max-md:gap-2 items-center">
      <div className="md:col-span-3">
        <div className="h-[85px] w-[160px] rounded-lg overflow-hidden relative">
          <img
            alt={product?.thumbnailPath ?? ''}
            src={
              product?.thumbnailPath
                ? product.thumbnailPath
                : '/images/noimage.png'
            }
            className="h-full w-full object-cover"
          />
          {props.data?.product?.quantity == 0 ? (
            <div className="absolute inset-0 bg-[#FF71585f] flex-center text-white">
              Out of Stock
            </div>
          ) : null}
        </div>
      </div>
      <div className="md:col-span-4">
        <p>{product?.name}</p>
        <p className="text-sm text-grey-dark">by {product?.store?.name}</p>
      </div>
      <div className="md:col-span-3">
        <p>Rp{formatToCurency(product?.price ?? 0)}</p>
        <p className="text-sm text-grey-dark">IDR</p>
      </div>
      <div className="md:col-span-1">
        <Button
          onClick={() => {
            mutation.mutate();
          }}
          className="bg-pink-pale text-white"
        >
          {mutation.isPending ? (
            <Loader size="medium" theme="light" />
          ) : (
            'Remove'
          )}
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
