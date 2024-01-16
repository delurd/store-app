'use client';
import Button from '@/components/Button/Button';
import Loader from '@/components/Loader/Loader';
import Modal from '@/components/Modal/Modal';
import {useFetch} from '@/hooks/fetch/useFetch';
import {
  ProductDataType,
  ProductImageType,
} from '@/utils/interfaces/globalTypes';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Image from 'next/image';
import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

type Props = {
  onClose(): void;
  show: boolean;
  productId?: string;
  slug?: string;
  setImagesPath?: (value: React.SetStateAction<any[]>) => void;
};

const ModalAddProductImage = (props: Props) => {
  const queryClient = useQueryClient();
  const {fetchWithToken} = useFetch();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    props.show && setSelectedImage(null);
  }, [props.show]);

  // const mutation = useMutation({
  //   mutationKey: ['products', props.slug],
  //   mutationFn: async (body: FormData) =>
  //     await fetchWithToken('/api/user/products/images', 'POST', body),
  //   onSuccess: async (data) => {
  //     // queryClient.setQueryData(
  //     //   ['products', props.slug],
  //     //   (old: ProductDataType) => old
  //     // );
  //     // console.log(data);

  //     console.log('success');
  //     props.onClose();
  //   },
  //   onError: async () => {
  //     console.log('gagal');
  //     props.onClose();
  //   },
  // });

  const actionPost = async () => {
    const formData = new FormData();
    if (selectedImage) {
      formData.append('image', selectedImage);
      formData.append('productId', props.productId ?? '');

      // mutation.mutate(formData);
      setLoadingAdd(true);
      await fetchWithToken('/api/user/products/images', 'POST', formData)
        .then(async (res) => {
          const json = await res.json();

          toast('New image added!');
          props.setImagesPath &&
            props.setImagesPath((prev) => [...prev, json?.data]);

          queryClient.setQueryData(
            ['products', props.slug],
            (old: ProductDataType) => {
              const productImage = old.ProductsImages ?? [];
              const images: ProductImageType[] = [...productImage, json.data];

              return {...old, ProductsImages: images};
            }
          );

          props.onClose();
        })
        .catch((err) => {
          console.log(err);
          toast('Failed!');
        });
      setLoadingAdd(false);
    }
  };

  return (
    <Modal
      onClose={props.onClose}
      show={props.show}
      className="p-5 md:p-10 rounded-xl flex-center max-md:min-w-max max-w-min"
    >
      <div className="space-y-10">
        <div className="w-60 aspect-square border border-dashed text-grey flex-center rounded-lg cursor-default relative overflow-hidden group hover:bg-slate-50">
          {selectedImage ? (
            <>
              <img
                alt="selected image"
                src={selectedImage ? URL.createObjectURL(selectedImage) : ''}
                className="w-full h-full object-contain"
              />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 w-20 aspect-square opacity-0 group-hover:opacity-100 duration-200 flex-center text-center text-xs rounded-full">
                Change Photo
              </span>
            </>
          ) : (
            <p>Import Photo</p>
          )}
          <input
            className="absolute w-full h-80 bottom-0 cursor-pointer opacity-0"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            title=""
            onChange={(e) => {
              e.target.files?.length && setSelectedImage(e.target.files[0]);
            }}
          ></input>
        </div>
        <div className="space-y-2">
          <Button
            className="bg-success text-white px-14 w-full"
            onClick={actionPost}
          >
            {loadingAdd ? <Loader size="small" theme="light" /> : 'Add Photo'}
          </Button>
          <Button
            className="bg-grey-dark text-white px-14 w-full"
            onClick={props.onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddProductImage;
