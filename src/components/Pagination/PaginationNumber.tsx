'use client';
import React, {useState} from 'react';
import s from './paginate.module.css';

type Props = {
  page?: number;
  setPage?(e: number): void;
  totalPage?: number;
  color?: string;
};

const PaginationNumber = (props: Props) => {
  const total = props.totalPage ?? 1;
  // const [page, setPage] = useState(1);
  const page = props.page ?? 1;

  return (
    <div className={s.paginateContainer}>
      <ul className="flex items-center gap-2">
        {page - 1 <= 0 ? null : (
          <>
            <li>
              <button
                onClick={() => {
                  props.setPage && props.setPage(page - 1);
                }}
              >
                <span className="text-sm inline-block mr-2">❮</span>
                Previous
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  props.setPage && props.setPage(page - 1);
                }}
              >
                {page - 1}
              </button>
            </li>
          </>
        )}
        <li>
          <button className="bg-white ">{page}</button>
        </li>
        {page >= total ? null : (
          <>
            <li>
              <button
                onClick={() => {
                  props.setPage && props.setPage(page + 1);
                }}
              >
                {page + 1}
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  props.setPage && props.setPage(page + 1);
                }}
              >
                Next
                <span className="text-sm inline-block ml-2">❯</span>
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default PaginationNumber;
