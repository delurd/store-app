'use client';
import Button from '@/components/Button/Button';
import Input from '@/components/Input';
import {host} from '@/utils/variables';
import {useMutation} from '@tanstack/react-query';
import Link from 'next/link';
import {useState} from 'react';
import {z} from 'zod';
import SignupSuccess from './components/SignupSuccess';
import {signIn, useSession} from 'next-auth/react';
import Loader from '@/components/Loader/Loader';

type Props = {};

const SignupPage = (props: Props) => {
  const {status} = useSession();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [radioStore, setRadioStore] = useState(0);

  // const mutation = useMutation({
  //   mutationFn: (e: {}) => {
  //     return fetch(host + '/api/auth/register', {
  //       method: 'POST',
  //       body: JSON.stringify(e),
  //     });
  //   },
  // });

  const actionRegister = async (formData: FormData) => {
    const schema = z.object({
      fullname: z.string().min(1, 'required'),
      email: z.string().email().min(1),
      password: z.string().min(8, 'Min 8 characters'),
    });

    const validatedFields = schema.safeParse({
      fullname: formData.get('fullname'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);

      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const rawFormData = {
      fullname: formData.get('fullname'),
      email: formData.get('email'),
      password: formData.get('password'),
      openStatus: formData.get('store'),
      storeName: formData.get('storeName') ?? '',
      storeCategory: formData.get('storeCategory') ?? '',
    };

    // mutation.mutate(rawFormData);
    // console.log(rawFormData);
    setIsLoading(true);

    signIn('register', {
      ...rawFormData,
      redirect: false,
      // callbackUrl: '/signup/success',
    }).then((value) => {
      if (value?.ok) {
        setIsError(false);
        setIsLoading(false);
        // console.log('success');
      } else {
        setIsError(true);
        setIsLoading(false);

        console.log('registration failed');
      }
    });
  };

  if (status == 'loading') return <div className="flex-1"></div>;

  return (
    <>
      <main className="flex-1 flex-center">
        {status == 'authenticated' ? (
          <SignupSuccess />
        ) : (
          <div className="w-[350px] mb-24">
            <h1 className="text-3xl mb-7">
              Memulai untuk jual beli dengan cara terbaru
            </h1>
            {isError ? (
              <div className="p-2 my-4 bg-[rgba(243,35,85,0.1)] border-2 border-pink-pale text-pink-pale text-center rounded-lg">
                Registration failed!
              </div>
            ) : (
              <></>
            )}
            <form action={actionRegister} className="flex flex-col gap-4 form">
              <div>
                <label htmlFor="fullname">Full Name</label>
                <Input
                  type="text"
                  id="fullname"
                  name="fullname"
                  required
                  onChange={() => {
                    setIsError(false);
                  }}
                />
              </div>
              <div>
                <label htmlFor="email">Email Address</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  onChange={() => {
                    setIsError(false);
                  }}
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  required
                  onChange={() => {
                    setIsError(false);
                  }}
                />
              </div>
              <div>
                <p>Store</p>
                <p className="text-grey-secondary mb-2">
                  Apakah anda juga ingin membuka toko?
                </p>
                <div className="flex gap-5">
                  <div className="space-x-2 flex">
                    <input
                      type="radio"
                      id="storeTrue"
                      value={1}
                      name="store"
                      className="mb-[6px]"
                      checked={!!radioStore}
                      onChange={(e) => {
                        setRadioStore(parseInt(e.target.value));
                      }}
                    />
                    <label htmlFor="storeTrue">Iya, boleh</label>
                  </div>
                  <div className="space-x-2 flex">
                    <input
                      type="radio"
                      id="storeFalse"
                      value={0}
                      name="store"
                      className="mb-[6px]"
                      checked={!radioStore}
                      onChange={(e) => {
                        setRadioStore(parseInt(e.target.value));
                      }}
                    />
                    <label htmlFor="storeFalse">Tidak, Terimakasih</label>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="storeName"
                  className={!radioStore ? 'text-grey-dark' : ''}
                >
                  Nama Toko
                </label>
                <Input
                  type="text"
                  id="storeName"
                  name="storeName"
                  disabled={!radioStore}
                />
              </div>
              <div>
                <label
                  htmlFor="storeCategory"
                  className={!radioStore ? 'text-grey-dark' : ''}
                >
                  Category
                </label>
                <Input
                  type="text"
                  id="storeCategory"
                  name="storeCategory"
                  disabled={!radioStore}
                />
              </div>
              <Button
                type="submit"
                className="px-12 my-4 bg-success text-white"
              >
                {isLoading ? (
                  <Loader size="small" theme="light" />
                ) : (
                  'Sign Up Now'
                )}
              </Button>
            </form>
            <Link href={'/signin'}>
              <Button className="w-full px-12 bg-grey-base text-grey-dark">
                Back to Sign In
              </Button>
            </Link>
          </div>
        )}
      </main>
    </>
  );
};

export default SignupPage;
