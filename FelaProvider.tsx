/* eslint-disable */
import { Component, FC } from 'react';
import { RendererProvider } from 'react-fela';
import getFelaRenderer from './getFelaRenderer';
import { IRenderer } from 'fela';

const fallbackRenderer = getFelaRenderer();
interface FelaProviderProps {
  renderer?: IRenderer;
}
const FelaProvider: FC<FelaProviderProps> = ({
  renderer = fallbackRenderer,
  children
}) => <RendererProvider renderer={renderer}>{children}</RendererProvider>;

export default FelaProvider;
