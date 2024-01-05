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
import {useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';
import {useState} from 'react';
import {toast} from 'react-toastify';
import {motion} from 'framer-motion';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';
import AuthenticateRequired from './components/AuthenticateRequired';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';

type Props = {};

const CartPage = (props: Props) => {
  const {status} = useSession();
  const {fetchWithToken} = useFetch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [transactionProcess, setTransactionProcess] = useState(false);
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

  const totalPayment = cartData.reduce((total: number, data: CartDataType) => {
    return total + parseInt(data.product?.price ?? '0');
  }, 0);

  const groupCartByStore = () => {
    //@ts-ignore
    const hasil = Object.groupBy(cartData, (data: CartDataType) => {
      return data.product?.storeId;
    });

    const result = [];
    for (const data in hasil) {
      result.push({
        storeId: data,
        productsId: hasil[data].map((data: any) => data.productId),
      });
    }

    return result;
  };

  const actionCheckout = async () => {
    const productStore = groupCartByStore();

    const body = {
      paymentTotal: totalPayment.toString(),
      productStore,
    };
    // setTransactionProcess(true);

    await fetchWithToken(
      '/api/user/transactions/buy',
      'POST',
      JSON.stringify(body)
    )
      .then((res) => {
        console.log('success');
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
    <main className={'flex-1 mb-10 ' + s.cart}>
      {transactionProcess && <TransactionSuccess />}
      {isLoading ? (
        <div className="h-full flex-center">
          <Loader size="medium" />
        </div>
      ) : !cartData.length ? (
        <div className="h-full flex-center">
          <div className="flex flex-col items-center gap-5 text-grey-secondary">
            <p>Keranjang Masih Kosong</p>
            <Button
              onClick={() => {
                router.push('/');
              }}
              className="bg-success text-white max-w-max"
            >
              Mulai Belanja
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={'hidden'}
          animate={'show'}
          variants={varianFadeUpListContainer}
          className="container-base space-y-7"
        >
          <motion.p
            variants={varianFadeUpListItem}
            className="flex gap-7 text-grey-secondary font-medium"
          >
            <Link href={'/'}>Home</Link> <span>/</span>{' '}
            <span className="text-black">Cart</span>
          </motion.p>
          <div>
            <motion.div
              variants={varianFadeUpListItem}
              className="grid grid-cols-12 mb-6 max-md:hidden"
            >
              <div className="col-span-3">Image</div>
              <div className="col-span-4">Name & Seller</div>
              <div className="col-span-3">Price</div>
              <div className="col-span-1">Menu</div>
            </motion.div>
            <div className="md:space-y-6 mb-6 max-md:flex max-md:flex-wrap max-md:gap-5">
              {cartData?.length &&
                cartData.map((item: CartDataType, idx: number) => (
                  <motion.div key={idx} variants={varianFadeUpListItem}>
                    <CartItem data={item} />
                  </motion.div>
                ))}
            </div>
            <motion.hr variants={varianFadeUpListItem} />
          </div>
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
            <div className={'space-y-5 ' + s.form}>
              <motion.div
                variants={varianFadeUpListItem}
                className="grid md:grid-cols-2 gap-5"
              >
                <div>
                  <label htmlFor="address1">Address 1</label>
                  <div
                    className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
                    id="address1"
                  >
                    {userProfile?.address1}
                  </div>
                </div>
                <div>
                  <label htmlFor="address2">Address 2</label>
                  <div
                    className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
                    id="address2"
                  >
                    {userProfile?.address2}
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={varianFadeUpListItem}
                className="grid md:grid-cols-3 gap-5"
              >
                <div>
                  <label htmlFor="provice">Provice</label>
                  <div
                    className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
                    id="provice"
                  >
                    {userProfile?.provice}
                  </div>
                </div>
                <div>
                  <label htmlFor="city">City</label>
                  <div
                    className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
                    id="city"
                  >
                    {userProfile?.city}
                  </div>
                </div>
                <div>
                  <label htmlFor="postalCode">Postal Code</label>
                  <div
                    className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
                    id="postalCode"
                  >
                    {userProfile?.postalCode}
                  </div>
                </div>
              </motion.div>
              <motion.div
                variants={varianFadeUpListItem}
                className="grid md:grid-cols-2 gap-5"
              >
                <div>
                  <label htmlFor="country">Country</label>
                  <div
                    className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
                    id="country"
                  >
                    {userProfile?.country}
                  </div>
                </div>
                <div>
                  <label htmlFor="phone">Phone</label>
                  <div
                    className="bg-grey-base p-[10px] min-h-12 rounded-lg flex items-center overflow-hidden"
                    id="phone"
                  >
                    {userProfile?.phone}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="space-y-4">
            <motion.b variants={varianFadeUpListItem}>
              Payment Informations
            </motion.b>
            <motion.div
              variants={varianFadeUpListItem}
              className="grid md:grid-cols-12 max-md:gap-2 items-center"
            >
              {/* <div className="md:col-span-2">
              <p>$10</p>
              <p className="text-sm text-grey-dark">Country Tax</p>
            </div>
            <div className="md:col-span-2">
              <p>$280</p>
              <p className="text-sm text-grey-dark">Product Insurance</p>
            </div>
            <div className="md:col-span-2">
              <p>$580</p>
              <p className="text-sm text-grey-dark">Ship to jakarta</p>
            </div>
            <div className="md:col-span-1">:</div> */}
              <div className="md:col-span-3">
                <b className="text-success">
                  Rp
                  {formatToCurency(totalPayment)}
                </b>
                <p className="text-sm text-grey-dark">Total Payment</p>
              </div>
              <div className="md:col-span-7" />
              <div className="md:col-span-2 flex justify-end">
                <Button
                  onClick={() => {
                    mutationCheckout.mutate(actionCheckout);
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
      {/* <TransactionSuccess /> */}
    </main>
  );
};

export default CartPage;
