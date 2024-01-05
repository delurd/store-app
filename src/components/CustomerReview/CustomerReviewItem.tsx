import Image from 'next/image';

type Props = {};

const CustomerReviewItem = (props: Props) => {
  return (
    <div className="flex">
      <div>
        <div className="h-14 aspect-square overflow-hidden rounded-full bg-orange-200">
          <Image
            alt="profile-review"
            src="/images/signin-hero.png"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="space-y-1 py-2 mx-4">
        <p className="font-semibold">Hazza Risky</p>
        <p>
          I thought it was not good for living room. I really happy to decided
          buy this product last week now feels like homey.
        </p>
      </div>
    </div>
  );
};

export default CustomerReviewItem;
