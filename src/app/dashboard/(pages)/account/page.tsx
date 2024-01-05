'use client';
import Button from '@/components/Button/Button';
import Header from '../../components/Header';
import Input from '@/components/Input';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useFetch} from '@/hooks/fetch/useFetch';
import {useSession} from 'next-auth/react';
import {z} from 'zod';
import {useState} from 'react';
import Loader from '@/components/Loader/Loader';
import {toast} from 'react-toastify';
import {motion} from 'framer-motion';
import {
  varianFadeUpListContainer,
  varianFadeUpListItem,
} from '@/utils/helper/variants';

type Props = {};

type accountDataType = {
  address1?: string;
  address2?: string;
  provice?: string;
  city?: string;
  country?: string;
  id?: string;
  phone?: string;
  postalCode?: string;
  userId?: string;
};

const AccountPage = (props: Props) => {
  const {data: session}: {data: any} = useSession();
  const {fetchWithToken} = useFetch();
  const queryClient = useQueryClient();

  const {data} = useQuery({
    queryKey: ['account'],
    queryFn: () =>
      fetchWithToken('/api/user/account').then((data) =>
        data.json().then((json) => json.data)
      ),
  });
  const resData = data as accountDataType;
  // console.log(data);

  const mutation = useMutation({
    mutationKey: ['account'],
    mutationFn: (e: string) =>
      fetchWithToken('/api/user/account', 'PUT', e).then((res) =>
        res.json().then((json) => json.data)
      ),
    onSuccess: async (data) => {
      queryClient.setQueryData(['account'], data);

      toast('saved!');
    },
    onError: async () => {
      toast('error saving!');
    },
  });

  const actionUpdate = (formData: FormData) => {
    const schema = z.object({
      email: z.string().email().min(1),
      fullname: z.string().min(1),
    });

    const validatedFields = schema.safeParse({
      email: formData.get('email'),
      fullname: formData.get('fullname'),
    });

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);

      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const rawFormData = {
      address1: formData.get('address1') ?? '',
      address2: formData.get('address2') ?? '',
      provice: formData.get('provice') ?? '',
      city: formData.get('city') ?? '',
      country: formData.get('country') ?? '',
      phone: formData.get('phone') ?? '',
      postalCode: formData.get('postalCode') ?? '',
      email: formData.get('email'),
      fullname: formData.get('fullname'),
    };

    // console.log(rawFormData);
    mutation.mutate(JSON.stringify(rawFormData));
  };

  return (
    <div className="h-full flex flex-col">
      <Header
        title="My Account"
        description={<p>Update your current profile</p>}
      />
      <form
        action={actionUpdate}
        className="bg-white p-9 rounded-lg flex-1 flex flex-col gap-10 justify-between"
      >
        <>
          <div className={'space-y-5 form'}>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fullname">Your Name</label>
                <Input
                  id="fullname"
                  name="fullname"
                  required
                  defaultValue={session?.user?.fullname}
                />
              </div>
              <div>
                <label htmlFor="email">Your Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={session?.user?.email}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="address1">Address 1</label>
                <Input
                  id="address1"
                  name="address1"
                  defaultValue={resData?.address1}
                />
              </div>
              <div>
                <label htmlFor="address2">Address 2</label>
                <Input
                  id="address2"
                  name="address2"
                  defaultValue={resData?.address2}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <label htmlFor="provice">Provice</label>
                <Input
                  id="provice"
                  name="provice"
                  defaultValue={resData?.provice}
                />
              </div>
              <div>
                <label htmlFor="city">City</label>
                <Input id="city" name="city" defaultValue={resData?.city} />
              </div>
              <div>
                <label htmlFor="postalCode">Postal Code</label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  defaultValue={resData?.postalCode}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="country">Country</label>
                <Input
                  id="country"
                  name="country"
                  defaultValue={resData?.country}
                />
              </div>
              <div>
                <label htmlFor="phone">Phone</label>
                <Input id="phone" name="phone" defaultValue={resData?.phone} />
              </div>
            </div>
          </div>
        </>
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

export default AccountPage;
