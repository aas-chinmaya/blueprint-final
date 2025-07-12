'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSlots } from '@/store/features/calender/slotSlice';


const SlotList = () => {
  const dispatch = useDispatch();

  const { slots, loading, error } = useSelector((state) => state.slots1);
  console.log("wrgrG",slots);

  useEffect(() => {
    dispatch(fetchSlots());
  }, [dispatch]);

  
  return (
    <>
    knkngwng</>
  );
};

export default SlotList;
