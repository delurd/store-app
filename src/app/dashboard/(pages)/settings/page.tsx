'use client';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import Input from '@/components/Input';
import Button from '@/components/Button/Button';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useFetch} from '@/hooks/fetch/useFetch';
import {toast} from 'react-toastify';
import Loader from '@/components/Loader/Loader';

type Props = {};

const StoreSettings = (props: Props) => {
  const {fetchWithToken} = useFetch();
  const queryClient = useQueryClient();
  const [storeStatus, setStoreStatus] = useState(0);

  const getData = async () => {
    return fetchWithToken('/api/user/store').then(async (res) =>
      res.json().then((json) => json.data)
    );
  };

  const {isPending, error, data} = useQuery({
    queryKey: ['storeData'],
    queryFn: getData,
  });

  const mutation = useMutation({
    mutationKey: ['storeData'],
    mutationFn: (e: {}) =>
      fetchWithToken('/api/user/store', 'PUT', JSON.stringify(e)).then((res) =>
        res.json().then((json) => json.data)
      ),
    onSuccess: async (data) => {
      queryClient.setQueryData(['storeData'], data);
      toast('saved!');
    },
    onError: async () => {
      toast('error saving!');
    },
  });

  useEffect(() => {
    // console.log(data);
    data && setStoreStatus(data?.openStatus ? 1 : 0);
  }, [data]);

  const actionUpdate = async (formData: FormData) => {
    const rawFormData = {
      name: formData.get('name'),
      category: formData.get('category'),
      openStatus: formData.get('store'),
    };
    // console.log(rawFormData);

    mutation.mutate(rawFormData);
  };

  return (
    <div className="h-full flex flex-col">
      <Header title="Store Settings" description="Make store that profitable" />
      <form
        action={actionUpdate}
        className="bg-white p-9 rounded-lg flex-1 flex flex-col gap-10 mb-10 justify-between"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <label htmlFor="name">Store Name</label>
              <Input defaultValue={data?.name ?? ''} id="name" name="name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Input
                defaultValue={data?.category ?? ''}
                id="category"
                name="category"
              />
            </div>
          </div>
          <div>
            <p>Store Status</p>
            <p className="text-grey-secondary mb-2">
              Apakah saat ini toko anda buka?
            </p>
            <div className="flex max-sm:flex-col gap-5">
              <div className="space-x-2">
                <input
                  type="radio"
                  id="storeTrue"
                  defaultValue={1}
                  name="store"
                  checked={!!storeStatus}
                  onChange={(e) => {
                    setStoreStatus(parseInt(e.target.value));
                  }}
                />
                <label htmlFor="storeTrue">Buka</label>
              </div>
              <div className="space-x-2">
                <input
                  type="radio"
                  id="storeFalse"
                  defaultValue={0}
                  name="store"
                  checked={!storeStatus}
                  onChange={(e) => {
                    setStoreStatus(parseInt(e.target.value));
                  }}
                />
                <label htmlFor="storeFalse">Sementara Tutup</label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-success text-white px-12 w-36">
            {mutation.isPending ? (
              <Loader size="small" theme="light" />
            ) : (
              'Save Now'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettings;
