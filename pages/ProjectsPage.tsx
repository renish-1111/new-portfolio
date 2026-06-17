import React from 'react';
import Projects from '../components/Projects';
import LeetCode from '../components/LeetCode';
import ErrorBoundary from '../components/ErrorBoundary';
import { CursorContextType } from '../types';

interface Props {
  setCursorVariant: CursorContextType['setCursorVariant'];
}

const ProjectsPage: React.FC<Props> = ({ setCursorVariant }) => {
  return (
    <div>
      <ErrorBoundary>
        <LeetCode setCursorVariant={setCursorVariant} />
      </ErrorBoundary>
      <ErrorBoundary>
        <Projects setCursorVariant={setCursorVariant} />
      </ErrorBoundary>
    </div>
  );
};

export default ProjectsPage;
