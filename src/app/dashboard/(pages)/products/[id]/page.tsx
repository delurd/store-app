'use client';
import Header from '@/app/dashboard/components/Header';
import Button from '@/components/Button/Button';
import Input from '@/components/Input';
import Select from '@/components/Select/Select';
import Skeleton from '@/components/Skeleton/Skeleton';
import {useFetch} from '@/hooks/fetch/useFetch';
import {categoriesDatas} from '@/utils/data/category';
import {
  ProductDataType,
  ProductImageType,
} from '@/utils/interfaces/globalTypes';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import ModalAddProductImage from './ModalAddProductImage';
import {toast} from 'react-toastify';
import Loader from '@/components/Loader/Loader';
import NotFound from '@/components/Errors/NotFound';
import {useRouter} from 'next/navigation';

type Props = {};

const ProductDetail = ({params}: {params: {id: string}}) => {
  const router = useRouter();
  const {fetchWithToken, fetchData} = useFetch();
  const queryClient = useQueryClient();
  const title = params.id
    .split('-')
    .filter((val, idx, arr) => idx < arr.length - 1)
    .join(' ');
  const [isShowModalAddImage, setIsShowModalAddImage] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [imagesPath, setImagesPath] = useState<any[]>([]);
  const [loadingRemoveImage, setLoadingRemoveImage] = useState(false);

  const {
    data: dataProduct,
    isLoading,
  }: {data: ProductDataType | undefined; isLoading: boolean} = useQuery({
    queryKey: ['products', params.id],
    queryFn: async () =>
      fetchData('/api/user/products/details/' + params.id).then(async (res) =>
        res.json().then((json) => {
          setThumbnail(json.data?.thumbnailPath ?? '');
          return json?.data;
        })
      ),
  });
  // console.log(dataProduct);
  useEffect(() => {
    !imagesPath.length && setImagesPath(dataProduct?.ProductsImages ?? []);
  }, [dataProduct?.ProductsImages?.length]);

  const mutation = useMutation({
    mutationFn: (body: string) =>
      fetchWithToken('/api/user/products', 'PUT', body).then((res) =>
        res.json().then((json) => json.data)
      ),
    onSuccess: async (data) => {
      queryClient.setQueryData(['products', params.id], data);
      toast('Product updated!');
    },
    onError: async () => {
      toast('Failed to update!');
    },
  });

  const actionUpdate = (formData: FormData) => {
    const rawFormData = {
      id: dataProduct?.id ?? '',
      name: formData.get('name') ?? '',
      price: formData.get('price') ?? '',
      weight: formData.get('weight') ?? 500,
      quantity: formData.get('quantity') ?? 1,
      category: formData.get('category[name]') ?? '',
      description: formData.get('description') ?? '',
      thumbnailPath: thumbnail,
    };
    // console.log(rawFormData);

    mutation.mutate(JSON.stringify(rawFormData));
  };

  const handleRemoveImage = async (id: string, path: string) => {
    setLoadingRemoveImage(true);
    await fetchWithToken(
      '/api/user/products/images',
      'DELETE',
      JSON.stringify({id})
    )
      .then((res) => {
        setImagesPath((prev) => prev.filter((image) => image?.path !== path));

        queryClient.setQueryData(
          ['products', params.id],
          (old: ProductDataType) => {
            const productImage = old.ProductsImages ?? [];
            const images: ProductImageType[] = productImage.filter(
              (data) => data.path !== path
            );

            return {...old, ProductsImages: images};
          }
        );
      })
      .catch((err) => {
        toast('Failed delete image!');
      });

    setLoadingRemoveImage(false);
  };

  const actionUpdateThumbnail = async (path: string) => {
    await fetchWithToken(
      '/api/user/products/details/' + params.id + '/thumbnail',
      'PUT',
      JSON.stringify({thumbnailPath: path})
    ).then(async (res) => {
      const json = await res.json();

      queryClient.setQueryData(['products', params.id], json.data);
    });
  };

  const mutationUpdateStatusPublish = useMutation({
    mutationFn: async () =>
      fetchWithToken(
        '/api/user/products/details/' + params.id + '/statusPublish',
        'PUT'
      ).then(async (res) => await res.json().then((json) => json.data)),
    onSuccess: async (res) => {
      queryClient.setQueryData(['products', params.id], res);
    },
  });

  const actionDeleteProduct = async () => {
    await fetchWithToken('/api/user/products/details/' + params.id, 'DELETE')
      .then((res) => {
        toast('Product deleted');
        router.replace('/dashboard/products');
      })
      .catch((err) => {
        // console.log(err);
        toast('Failed to delete product!');
      });
  };

  if (isLoading)
    return (
      <div className="h-full flex-center">
        <Loader size="medium" />
      </div>
    );
  if (!dataProduct) return <NotFound />;

  return (
    <div>
      <Header
        title={dataProduct?.name}
        description={
          <p>
            Product <b>Details</b>
          </p>
        }
      />
      <div className="bg-white p-9 rounded-lg mb-6">
        <form action={actionUpdate} className="form space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name">Product Name</label>
              <Input
                required
                type="text"
                id="name"
                name="name"
                defaultValue={dataProduct?.name}
              />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <Input
                required
                type="text"
                id="price"
                name="price"
                defaultValue={dataProduct?.price}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name">Weight (gram)</label>
              <Input
                required
                min={0}
                type="number"
                id="weight"
                name="weight"
                defaultValue={dataProduct?.weight}
              />
            </div>
            <div>
              <label htmlFor="price">Quantity</label>
              <Input
                required
                min={0}
                type="number"
                id="quantity"
                name="quantity"
                defaultValue={dataProduct?.quantity}
              />
            </div>
          </div>
          <div>
            <label htmlFor="category">Category</label>
            {isLoading ? (
              <Skeleton />
            ) : (
              <Select
                data={categoriesDatas.map((data) => {
                  return {name: data.title};
                })}
                selectWidth="w-full"
                defaultValue={{name: dataProduct?.category}}
                getValue={(val) => {
                  // console.log(val);
                }}
                name="category"
              />
            )}
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="w-full bg-grey-base rounded-lg min-h-28 focus:outline-success p-3"
              name="description"
              defaultValue={dataProduct?.description}
            ></textarea>
          </div>
          <Button className="bg-success text-white w-full" type="submit">
            {mutation.isPending ? (
              <Loader size="small" theme="light" />
            ) : (
              'Update Product'
            )}
          </Button>
        </form>
      </div>
      <div className="bg-white p-9 rounded-lg space-y-5">
        <div className="flex flex-wrap gap-11">
          {imagesPath.map((image: ProductImageType, idx) => (
            <div key={idx} className="w-[214px] h-40 relative">
              <div
                className="w-full h-full relative cursor-default group"
                onClick={() => {
                  setThumbnail(image.path ?? '');
                  actionUpdateThumbnail(image.path ?? '');
                }}
              >
                <img
                  alt={'Product-' + idx}
                  src={image.path ? image.path : ''}
                  className="w-full h-full object-cover hover:object-contain rounded-lg"
                />
                {thumbnail && image.path === thumbnail ? (
                  <div className="absolute bottom-0 right-0 bg-white bg-opacity-80 p-1 px-2 rounded-full text-xs m-2">
                    Thumbnail
                  </div>
                ) : (
                  <div className="absolute bottom-0 right-0 bg-white bg-opacity-80 p-1 px-2 rounded-full text-xs m-2 opacity-0 group-hover:opacity-100 duration-200">
                    Set thumbnail
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  // setImages(images.filter((file) => file !== image));
                  handleRemoveImage(image.id ?? '', image.path ?? '');
                }}
                className="w-7 h-7 flex-center rounded-full opacity-70 hover:opacity-100 bg-alert text-white absolute top-0 right-0 translate-x-1/3 -translate-y-1/3"
              >
                {loadingRemoveImage ? (
                  <Loader size="small" theme="light" />
                ) : (
                  '✖'
                )}
              </button>
            </div>
          ))}
        </div>
        <Button
          className="bg-grey-dark text-white w-full"
          onClick={() => {
            setIsShowModalAddImage(true);
          }}
        >
          Add Photo
        </Button>
      </div>
      <div className="my-10">
        <Button
          className={
            'border hover:text-white duration-200 w-[180px] ' +
            (dataProduct.published
              ? ' border-alert text-alert hover:bg-alert'
              : ' border-success text-success hover:bg-success')
          }
          onClick={() => {
            mutationUpdateStatusPublish.mutate();
          }}
        >
          {mutationUpdateStatusPublish.isPending ? (
            <Loader size="small" />
          ) : dataProduct.published ? (
            'Hide Product'
          ) : (
            'Publish Product'
          )}
        </Button>
      </div>
      <ModalAddProductImage
        onClose={() => {
          setIsShowModalAddImage(false);
        }}
        show={isShowModalAddImage}
        productId={dataProduct?.id}
        slug={params.id}
        setImagesPath={setImagesPath}
      />
    </div>
  );
};

export default ProductDetail;
