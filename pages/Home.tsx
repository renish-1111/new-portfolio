import React from 'react';
import Hero3D from '../components/Hero3D';
import { CursorContextType } from '../types';

interface Props {
  setCursorVariant: CursorContextType['setCursorVariant'];
}

const Home: React.FC<Props> = ({ setCursorVariant }) => {
  return (
    <>
      <Hero3D setCursorVariant={setCursorVariant} />
    </>
  );
};

export default Home;
