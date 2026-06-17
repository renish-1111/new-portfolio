import React from 'react';
import Experience from '../components/Experience';
import ErrorBoundary from '../components/ErrorBoundary';
import { CursorContextType } from '../types';

interface Props {
  setCursorVariant: CursorContextType['setCursorVariant'];
}

const ExperiencePage: React.FC<Props> = ({ setCursorVariant }) => {
  return (
    <div>
      <ErrorBoundary>
        <Experience setCursorVariant={setCursorVariant} />
      </ErrorBoundary>
    </div>
  );
};

export default ExperiencePage;
