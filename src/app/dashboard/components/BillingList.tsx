'use client';
import Modal from '@/components/Modal/Modal';
import React, {useMemo, useState} from 'react';
import BillingDetail from './BillingDetail';
import {useQuery} from '@tanstack/react-query';
import {useFetch} from '@/hooks/fetch/useFetch';
import Loader from '@/components/Loader/Loader';
import {motion} from 'framer-motion';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';
import {formatToCurency} from '@/utils/helper/formatNumberToCurency';
import ButtonCloseModal from '@/components/Modal/ButtonCloseModal';

type Props = {};

const BillingList = (props: Props) => {
  const {fetchWithToken} = useFetch();
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState({});

  const {data, isLoading} = useQuery({
    queryKey: ['bill', '1'],
    queryFn: async () =>
      fetchWithToken('/api/user/bill').then(
        async (res) => await res.json().then((json) => json.data.data)
      ),
  });

  const storesProducts = useMemo(() => {
    if (!data && !data?.length) return [];

    return data?.map((store: any) => {
      let productList = [];

      for (const product of store?.StoreTransaction) {
        for (const item of product?.ProductsTransaction) {
          productList.push(item?.product);
        }
      }
      return productList;
    });
  }, [data]);

  return (
    <>
      {isLoading ? (
        <div className="flex-center p-10">
          <Loader size="medium" />
        </div>
      ) : !data?.length ? (
        <p className="text-center text-grey-dark p-10">No Bill</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={varianFadeUpListContainer}
          className="space-y-3"
        >
          {data?.map((item: any, idx: number) => (
            <motion.div
              variants={varianFadeUpListItem}
              key={idx}
              onClick={() => {
                setIsShowModal(true);
                setSelectedBill(item);
              }}
              className="bg-white flex rounded-lg p-3 cursor-pointer hover:shadow-xl duration-300"
            >
              <div className="flex-1">
                <p className="">
                  {
                    item?.StoreTransaction[0]?.ProductsTransaction[0]?.product
                      .name
                  }
                  {storesProducts[idx]?.length > 1
                    ? `, +${storesProducts[idx]?.length - 1}lainnya`
                    : ''}
                </p>
                <span className="text-grey-dark text-sm">
                  Rp
                  {item?.paymentTotal
                    ? formatToCurency(item.paymentTotal)
                    : '-'}
                </span>
              </div>
              <div className="flex-center px-2">❯</div>
            </motion.div>
          ))}
        </motion.div>
      )}
      <Modal
        onClose={() => {
          setIsShowModal(false);
        }}
        show={isShowModal}
        className="bg-white rounded-lg "
      >
        <div className="flex justify-between items-center p-5">
          <h1>Billing</h1>
          <ButtonCloseModal onClick={() => setIsShowModal(false)} />
        </div>
        <hr />
        <div className="h-[500px] overflow-y-auto p-5 relative">
          <BillingDetail data={selectedBill} />
        </div>
      </Modal>
    </>
  );
};

export default BillingList;
