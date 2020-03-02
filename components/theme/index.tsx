import { FC } from 'react';
import { ThemeProvider } from 'react-fela';
import { ITheme } from '../../state/types';

const theme: ITheme = {
  squareDimension: {
    width: 30,
    height: 30
  }
};

interface ThemeProps {}

const Theme: FC<ThemeProps> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
