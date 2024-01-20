import Image from 'next/image';

type Props = {};

const HomepageBanner = (props: Props) => {
  return (
    <div className="h-[360px] rounded-lg overflow-hidden w-full relative">
      <div className="absolute left-[78px] top-[78px] text-[#533529] space-y-3 w-1/3">
        <h1 className="text-4xl  font-semibold">
          {/* Discount 50% Off All Members */}
          Sell and Buy Any Product You Want
        </h1>
        {/* <p>Included tax pricing for U.S citizen or other countries</p> */}
        <p>
          Providing a variety of new or used products, come join and enjoy
          shopping!
        </p>
      </div>
      <img
        alt="Banner-image"
        src="/images/banner.png"
        className="object-cover h-full w-full"
      />
    </div>
  );
};

export default HomepageBanner;
