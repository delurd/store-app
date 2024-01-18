'use client';
import React from 'react';
import CustomerReviewItem from './CustomerReviewItem';
import {useQuery} from '@tanstack/react-query';
import {useFetch} from '@/hooks/fetch/useFetch';

type Props = {
  productId?: string;
};

const CustomerReviewList = (props: Props) => {
  const {fetchData} = useFetch();

  const {data, isLoading} = useQuery({
    queryKey: ['review', props.productId],
    queryFn: async () =>
      fetchData('/api/products/review/' + props.productId).then(
        async (res) => await res.json().then((json) => json.data)
      ),
  });

  const dataReview = data?.data ?? [];

  return (
    <>
      <h3>
        Customer Review {dataReview.length ? `(${dataReview.length})` : ''}
      </h3>
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {dataReview.map((val: any, idx: number) => (
          <CustomerReviewItem name={val?.name} review={val?.review} key={idx} />
        ))}
      </div>
    </>
  );
};

export default CustomerReviewList;
