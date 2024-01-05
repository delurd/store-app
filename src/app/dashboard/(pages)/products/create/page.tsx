'use client';
import Header from '@/app/dashboard/components/Header';
import Button from '@/components/Button/Button';
import Input from '@/components/Input';
import Loader from '@/components/Loader/Loader';
import Select from '@/components/Select/Select';
import {useFetch} from '@/hooks/fetch/useFetch';
import {categoriesDatas} from '@/utils/data/category';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useSession} from 'next-auth/react';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

type Props = {};

const CreateProduct = (props: Props) => {
  const {fetchWithToken} = useFetch();
  const [images, setImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const {data: storeData} = useQuery({
    queryKey: ['storeData'],
    queryFn: async () =>
      fetchWithToken('/api/user/store').then(async (res) =>
        res.json().then((json) => json.data)
      ),
  });

  const mutation = useMutation({
    mutationFn: (body: any) =>
      fetchWithToken('/api/user/products', 'POST', body),
    onSuccess: async () => {
      toast('New Product Created!', {autoClose: 3000});
      document.querySelectorAll('input').forEach((input) => {
        input.value = '';
      });
      document
        .querySelectorAll('textarea')
        .forEach((input) => (input.value = ''));
      setImages([]);
      setThumbnail(null);
    },
    onError: async (error: any) => {
      toast('failed!');
    },
  });

  const actionCreate = async (formData: FormData) => {
    if (!storeData?.name && !storeData?.category) {
      console.log('Please fill all store data!');
    }

    thumbnail && formData.append('image', thumbnail);
    for (const image of images) {
      image !== thumbnail && formData.append('image', image);
    }
    formData.append('category', formData.get('category[name]') ?? '');

    mutation.mutate(formData);
  };

  return (
    <div>
      <Header
        title={'Create New Product'}
        description={<p>Create your own product</p>}
      />
      <form action={actionCreate} className="form">
        <div className="bg-white p-9 rounded-lg mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name">Product Name</label>
              <Input type="text" id="name" name="name" />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <Input type="text" id="price" name="price" />
            </div>
          </div>
          <div>
            <label htmlFor="category">Category</label>
            {/* <Input type="text" id="category" name="category" /> */}
            <Select
              data={categoriesDatas.map((data) => {
                return {name: data.title};
              })}
              selectWidth="w-full"
              defaultValue={''}
              getValue={(val) => {
                console.log(val);
              }}
              name="category"
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="w-full bg-grey-base rounded-lg min-h-28 focus:outline-success p-3"
            ></textarea>
          </div>
          <div>
            <p className="mb-[6px]">Product Image</p>
            <div className="flex max-sm:flex-col gap-4">
              <div className="h-12 p-[10px] w-full bg-grey-base rounded-lg overflow-hidden text-nowrap">
                <p>{images.map((image) => image.name).join(', ')}</p>
              </div>
              <div className="bg-grey-dark text-white rounded-lg relative flex-center px-12 h-12 overflow-hidden active:scale-95 duration-200">
                Select
                <input
                  type="file"
                  id="thumbnail"
                  className="h-28 w-full absolute cursor-pointer opacity-0"
                  title=""
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setImages([...images, e.target.files[0]]);
                      // console.log(e.target.files[0].type);

                      !images.length && setThumbnail(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
            <div className="my-4 flex flex-wrap gap-5">
              {images.map((image, idx) => (
                <div
                  key={idx}
                  className="w-[214px] h-40 relative cursor-default group"
                  onClick={() => {
                    setThumbnail(image);
                  }}
                >
                  <Image
                    alt=""
                    src={image ? URL.createObjectURL(image) : ''}
                    className="w-full h-full object-cover hover:object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImages(images.filter((file) => file !== image));
                    }}
                    className="w-7 h-7 flex-center rounded-full opacity-70 hover:opacity-100 bg-alert text-white absolute top-0 right-0 translate-x-1/3 -translate-y-1/3"
                  >
                    ✖
                  </button>
                  {thumbnail && image === thumbnail ? (
                    <div className="absolute bottom-0 right-0 bg-white bg-opacity-80 p-1 px-2 rounded-full text-xs m-2">
                      Thumbnail
                    </div>
                  ) : (
                    <div className="absolute bottom-0 right-0 bg-white bg-opacity-80 p-1 px-2 rounded-full text-xs m-2 opacity-0 group-hover:opacity-100 duration-200">
                      Set thumbnail
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Button className="bg-success text-white w-full" type="submit">
          {mutation.isPending ? (
            <Loader size="small" theme="light" />
          ) : (
            'Create Product'
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateProduct;
