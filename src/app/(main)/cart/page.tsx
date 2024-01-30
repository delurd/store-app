'use client';
import Link from 'next/link';
import CartItem from './components/CartItem';
import Button from '@/components/Button/Button';
import s from './cart.module.css';
import TransactionSuccess from './components/TransactionSuccess';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useFetch} from '@/hooks/fetch/useFetch';
import {CartDataType, UserAccountType} from '@/utils/interfaces/globalTypes';
import Loader from '@/components/Loader/Loader';
import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {motion} from 'framer-motion';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';
import AuthenticateRequired from './components/AuthenticateRequired';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';
import ShippingAddress from './components/ShippingAddress';
import CartEmpty from './components/CartEmpty';

type Props = {};

const CartPage = (props: Props) => {
  const {status} = useSession();
  const {fetchWithToken} = useFetch();
  const queryClient = useQueryClient();
  const [transactionProcess, setTransactionProcess] = useState(false);
  const serviceFee = 1000;

  const mutationCheckout = useMutation({
    mutationKey: ['checkout'],
    mutationFn: async (func: () => Promise<void>) => func(),
  });

  const {data: userProfile}: {data: UserAccountType | undefined} = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () =>
      fetchWithToken('/api/user/account').then((res) =>
        res.json().then((json) => json.data)
      ),
  });

  const {
    data: cartData = [],
    isLoading,
  }: {data: CartDataType[] | undefined; isLoading: boolean} = useQuery({
    queryKey: ['cart'],
    queryFn: async () =>
      fetchWithToken('/api/user/cart').then((res) =>
        res.json().then((json) => json.data)
      ),
  });

  const totalPrice = cartData.reduce((total: number, data: CartDataType) => {
    return total + parseInt(data.product?.price ?? '0');
  }, 0);

  const groupCartByStore = (data?: any[]) => {
    const result: any[] = [];

    if (cartData.length) {
      //@ts-ignore
      const hasil = Object.groupBy(cartData, (data: CartDataType) => {
        return data.product?.storeId;
      });

      for (const data in hasil) {
        result.push(hasil[data]);
      }
    }

    return result;
  };

  const fetchOngkir = async (
    originId: string,
    destinationId: string,
    weight?: number
  ) => {
    return await fetchWithToken(
      '/api/ongkir/cost',
      'POST',
      JSON.stringify({
        origin: originId,
        destination: destinationId,
        weight,
      })
    )
      .then(async (res) => await res.json().then((json) => json.data))
      .catch((res) => 0);
  };

  const [cartList, setCartList] = useState<any[]>([]);
  const [listOngkir, setListOngkir] = useState<any[]>([]);
  const totalOngkir = listOngkir.length
    ? listOngkir.reduce((total, data) => total + data)
    : 0;

  useEffect(() => {
    cartData.length && setCartList(groupCartByStore(cartData));
  }, [cartData.length]);

  useEffect(() => {
    const buyerCityId = userProfile?.cityId ?? '';

    async function ongkir() {
      const _listOngkir: any[] = [];

      for (const cart of cartList) {
        const _sellerCityId = cart[0]?.product?.seller?.UserProfile.cityId;
        const _weight = cart?.reduce(
          (total: number, data: any) => total + data?.product?.weight,
          0
        );

        const ongkir = await queryClient.fetchQuery({
          queryKey: ['ongkir', _sellerCityId, buyerCityId],
          queryFn: async () =>
            await fetchOngkir(_sellerCityId ?? '', buyerCityId ?? '', _weight),
        });

        _listOngkir.push(await ongkir);
      }

      setListOngkir(_listOngkir);
    }

    if (cartList.length && userProfile?.cityId) {
      ongkir();
    }
  }, [cartList.length, userProfile?.cityId]);

  const groupProductStore = () => {
    const hasil = groupCartByStore();

    const result = [];
    for (let i = 0; i < hasil.length; i++) {
      const data = hasil[i];

      result.push({
        storeId: data[0]?.product?.storeId,
        productsId: data?.map((data: any) => data.productId),
        shippingPrice: listOngkir[i] ?? 0,
        totalPrice: data?.reduce(
          (total: number, item: any) => total + parseInt(item.product.price),
          0
        ),
      });
    }

    return result;
  };

  const actionCheckout = async () => {
    if (cartData && cartData.find((data) => data.product?.quantity == 0)) {
      toast.warning('Some items are out of stock, please remove first!', {
        theme: 'colored',
        autoClose: 5000,
      });

      return;
    }

    const productStore = groupProductStore();

    const body = {
      paymentTotal: (totalPrice + totalOngkir + serviceFee).toString(),
      productStore,
    };

    await fetchWithToken(
      '/api/user/transactions/buy',
      'POST',
      JSON.stringify(body)
    )
      .then((res) => {
        // console.log('success');
        setTransactionProcess(true);
        queryClient.setQueryData(['cart'], (old: any[]) => []);
        return res;
      })
      .catch((err) => {
        toast('Failed to checkout!');
        return err;
      });
  };

  if (status == 'unauthenticated') {
    return (
      <main className={'flex-1 flex-center ' + s.cart}>
        <AuthenticateRequired />
      </main>
    );
  }

  return (
    <main className={'flex-1 flex flex-col mb-10 ' + s.cart}>
      {transactionProcess && <TransactionSuccess />}
      {isLoading ? (
        <div className="flex-1 flex-center">
          <Loader size="medium" />
        </div>
      ) : !cartData.length ? (
        <div className="flex-1 h-full flex-center">
          <CartEmpty />
        </div>
      ) : (
        <motion.div
          initial={'hidden'}
          animate={'show'}
          variants={varianFadeUpListContainer}
          className="container-base space-y-7 "
        >
          <motion.p
            variants={varianFadeUpListItem}
            className="flex gap-7 text-grey-secondary font-medium"
          >
            <Link href={'/'}>Home</Link> <span>/</span>{' '}
            <span className="text-black">Cart</span>
          </motion.p>
          <>
            <motion.div
              variants={varianFadeUpListItem}
              className="grid grid-cols-12 mb-6 max-md:hidden"
            >
              <div className="col-span-3">Image</div>
              <div className="col-span-4">Name & Seller</div>
              <div className="col-span-3">Price</div>
              <div className="col-span-1">Menu</div>
            </motion.div>
            <motion.div
              variants={varianFadeUpListItem}
              className="md:space-y-6 mb-6 max-md:flex max-md:flex-wrap max-md:gap-5"
            >
              {cartList.length
                ? cartList.map((cartByStore: any[], indexStore) => (
                    <div className="space-y-5 pb-5" key={indexStore}>
                      {cartByStore.map((item, indexProduct) => (
                        <CartItem data={item} key={indexProduct} />
                      ))}
                      <div className="flex gap-5 lg:pr-10 items-center text-grey-dark">
                        <hr className="flex-1 border-base" />
                        <p>Shipping</p>
                        <p>:</p>
                        <p>
                          Rp
                          {listOngkir[indexStore]
                            ? formatToCurency(listOngkir[indexStore])
                            : '-'}
                        </p>
                      </div>
                    </div>
                  ))
                : null}
            </motion.div>
            <motion.hr variants={varianFadeUpListItem} />
          </>
          <div className="space-y-4">
            <motion.div
              variants={varianFadeUpListItem}
              className="flex justify-between items-end"
            >
              <b>Shipping Details</b>
              <Link
                href={'/dashboard/account'}
                className="text-grey-dark hover:text-warning text-sm"
              >
                Edit
              </Link>
            </motion.div>
            <ShippingAddress data={userProfile} />
          </div>
          <div className="space-y-4">
            <motion.b variants={varianFadeUpListItem}>
              Payment Informations
            </motion.b>
            <motion.div
              variants={varianFadeUpListItem}
              className="grid md:grid-cols-12 gap-2 items-center"
            >
              <div className="md:col-span-2">
                <p>Rp{formatToCurency(totalPrice)}</p>
                <p className="text-sm text-grey-dark">Total Price</p>
              </div>
              <div className="md:col-span-2">
                <p>Rp{totalOngkir ? formatToCurency(totalOngkir) : '-'}</p>
                <p className="text-sm text-grey-dark">
                  Ship to {userProfile?.city}
                </p>
              </div>
              <div className="md:col-span-2">
                <p>Rp1.000</p>
                <p className="text-sm text-grey-dark">Service</p>
              </div>
              <div className="md:col-span-1">:</div>
              <div className="md:col-span-3">
                <b className="text-success">
                  Rp
                  {formatToCurency(totalPrice + totalOngkir + serviceFee)}
                </b>
                <p className="text-sm text-grey-dark">Total Payment</p>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button
                  onClick={() => {
                    mutationCheckout.mutate(actionCheckout);
                    // actionCheckout();
                  }}
                  className="bg-success text-white w-44"
                >
                  {mutationCheckout.isPending ? (
                    <Loader size="small" theme="light" />
                  ) : (
                    'Checkout Now'
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default CartPage;
