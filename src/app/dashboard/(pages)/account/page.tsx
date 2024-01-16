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
import Select from '@/components/Select/Select';
import {provinces} from '@/utils/data/province';
import {cities} from '@/utils/data/city';

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
  const [selectedProviceId, setSelectedProviceId] = useState('');

  const {data, isLoading} = useQuery({
    queryKey: ['account'],
    queryFn: () =>
      fetchWithToken('/api/user/account').then((data) =>
        data.json().then((json) => json.data)
      ),
  });
  const resData = data as accountDataType;
  // console.log(data);

  const {data: dataProvice, isLoading: loadingProvice} = useQuery({
    queryKey: ['proviceList'],
    queryFn: () => {
      return provinces.map((data) => {
        return {name: data?.province, value: data?.province_id};
      });
      // fetchWithToken('/api/ongkir/province').then((data) =>
      //   data.json().then((json) =>
      //     json?.data?.map((data: any) => {
      //       return {name: data?.province, value: data?.province_id};
      //     })
      //   )
      // );
    },
  });

  const {data: dataCity} = useQuery({
    queryKey: ['cityList', selectedProviceId],
    queryFn: async () => {
      const query = cities.filter(
        (data) => data.province_id == selectedProviceId
      );

      return query.map((data) => {
        return {
          name: data?.type + ' ' + data?.city_name,
          value: data?.city_id,
        };
      });
      // const query = selectedProviceId ? `?proviceId=${selectedProviceId}` : '';

      // return await fetchWithToken('/api/ongkir/city' + query).then((data) =>
      //   data.json().then((json) =>
      //     json?.data?.map((data: any) => {
      //       const res = {
      //         name: data?.type + ' ' + data?.city_name,
      //         value: data?.city_id,
      //       };
      //       return res;
      //     })
      //   )
      // );
    },
  });
  // console.log(dataCity);

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
      provice: formData.get('provice[name]') ?? '',
      proviceId: formData.get('provice[value]') ?? '',
      city: formData.get('city[name]') ?? '',
      cityId: formData.get('city[value]') ?? '',
      country: formData.get('country[name]') ?? '',
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
                {/* <Input
                  id="provice"
                  name="provice"
                  defaultValue={resData?.provice}
                /> */}
                <Select
                  data={dataProvice ?? []}
                  defaultValue={{name: resData?.provice}}
                  name="provice"
                  getValue={(val) => {
                    setSelectedProviceId(val.value);
                  }}
                  isLoading={isLoading && loadingProvice}
                />
              </div>
              <div>
                <label htmlFor="city">City</label>
                {/* <Input id="city" name="city" defaultValue={resData?.city} /> */}
                <Select
                  data={selectedProviceId ? dataCity ?? [] : []}
                  defaultValue={{name: resData?.city}}
                  name="city"
                  isLoading={isLoading}
                  prerequiredMessage={
                    selectedProviceId ? '' : 'Select provice first!'
                  }
                />
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
                <label>Country</label>
                {/* <Input
                  id="country"
                  name="country"
                  defaultValue={resData?.country}
                /> */}
                <Select
                  data={[{name: 'Indonesia', value: 'indonesia'}]}
                  defaultValue={{name: 'Indonesia'}}
                  name="country"
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
