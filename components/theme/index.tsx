import { FC } from 'react';
import { ThemeProvider, useFela as useFelaReact } from 'react-fela';
import { Dimensions } from '../../state/types';

export interface ITheme {
  squareDimension: Dimensions;
}

const theme: ITheme = {
  squareDimension: {
    width: 50,
    height: 50
  }
};

interface ThemeProps {}

export const useFela = <P extends {} = {}>(props?: P) =>
  useFelaReact<ITheme, P>(props);

const Theme: FC<ThemeProps> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
