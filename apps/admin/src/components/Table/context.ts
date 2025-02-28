import { createContext, useContext } from 'react';

// ----- TABLE SOURCE -----

export const context = createContext<Record<string, unknown>[]>(null as never);

export const { Provider } = context;

export const useTableSource = () => useContext(context);

// ----- ROW INDEX -----

export const indexContext = createContext(0);

export const IndexProvider = indexContext.Provider;

export const useRowIndex = () => useContext(indexContext);

// ----- SKELETON ------

export const skeletonContext = createContext(false);

export const SkeletonProvider = skeletonContext.Provider;

export const useSkeleton = () => useContext(skeletonContext);

// ----- SHARED -----

export const HEAD_INDEX = -1;
