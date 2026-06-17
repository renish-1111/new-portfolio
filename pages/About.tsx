import React from 'react';
import Skills from '../components/Skills';
import GithubStats from '../components/GithubStats';
import ErrorBoundary from '../components/ErrorBoundary';
import { CursorContextType } from '../types';

interface Props {
  setCursorVariant: CursorContextType['setCursorVariant'];
}

const About: React.FC<Props> = ({ setCursorVariant }) => {
  return (
    <div>
      <ErrorBoundary>
        <Skills setCursorVariant={setCursorVariant} />
      </ErrorBoundary>
      <ErrorBoundary>
        <GithubStats setCursorVariant={setCursorVariant} />
      </ErrorBoundary>
    </div>
  );
};

export default About;
