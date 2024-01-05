'use client';
import Button from '@/components/Button/Button';
import s from './signin.module.css';
import Input from '@/components/Input';
import Link from 'next/link';
import {signIn, useSession} from 'next-auth/react';
import {z} from 'zod';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import Loader from '@/components/Loader/Loader';
import {toast} from 'react-toastify';

type Props = {};

const SigninPage = (props: Props) => {
  const {status} = useSession();
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const actionLogin = (formData: FormData) => {
    const schema = z.object({
      email: z.string().email().min(1),
      password: z.string().min(8, 'Min 8 characters'),
    });

    const validatedFields = schema.safeParse({
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
      email: formData.get('email'),
      password: formData.get('password'),
    };
    console.log('try sign in');

    setLoading(true);
    signIn('login', {...rawFormData, redirect: false}).then((value) => {
      if (value?.ok) {
        router.push('/');
      } else {
        setIsError(true);
        toast('Failed!');
        // console.log('login failed ', value?.error);
        setLoading(false);
      }
    });
  };

  if (status == 'loading' || status == 'authenticated')
    return <div className="flex-1"></div>;

  return (
    <main className={'flex-1 flex-center mb-10  ' + s.signin}>
      <div className="grid md:grid-cols-2 max-md:gap-10">
        <div className={s.hero + ' ' + 'max-md:hidden'}>
          <div className="relative">
            <img
              src="./images/signin-hero.png"
              className="rounded-tr-[48px] rounded-bl-[48px]  object-cover"
            />
          </div>
        </div>

        <div className="max-md:flex flex-col items-center">
          <h1 className="text-3xl mb-7 w-3/4 max-md:text-center ">
            Belanja kebutuhan utama, menjadi lebih mudah
          </h1>
          <form action={actionLogin} className="flex flex-col gap-4 w-72 form">
            <div>
              <label htmlFor="email">Email Address</label>
              <Input
                type="email"
                className={`rounded-lg bg-grey-base ${
                  isError ? 'border-alert focus:border-alert' : ''
                }`}
                id="email"
                name="email"
                onKeyUp={() => {
                  setIsError(false);
                }}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Input
                type="password"
                className={`rounded-lg bg-grey-base ${
                  isError ? 'border-alert focus:border-alert' : ''
                }`}
                id="password"
                name="password"
                onKeyUp={() => {
                  setIsError(false);
                }}
              />
            </div>
            <Button type="submit" className="px-12 my-4 bg-success text-white">
              {loading ? (
                <Loader size="small" theme="light" />
              ) : (
                'Sign In to My Account'
              )}
            </Button>
          </form>
          <Link href={'/signup'}>
            <Button className="w-72 px-12 bg-grey-base text-grey-dark">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SigninPage;
