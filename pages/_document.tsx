import Document, { Head, Main, NextScript } from 'next/document';
import { renderToSheetList } from 'fela-dom';
import getFelaRenderer from '../getFelaRenderer';

interface MyDocumentProps {
  sheetList: ReturnType<typeof renderToSheetList>;
}
export default class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps(ctx) {
    const renderer = getFelaRenderer();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => <App {...props} renderer={renderer} />
      });

    const initialProps = await Document.getInitialProps(ctx);
    const sheetList = renderToSheetList(renderer);
    return {
      ...initialProps,
      sheetList
    };
  }

  render() {
    const styleNodes = this.props.sheetList.map(
      ({ type, support, media, css }) => (
        <style
          dangerouslySetInnerHTML={{ __html: css }}
          data-fela-id=""
          data-fela-support={support}
          data-fela-type={type}
          key={`${type}-${media}`}
          media={media}
        />
      )
    );
    return (
      <html>
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
                *{ box-sizing: border-box; }
                body { margin: 0; }
                html { font-family: 'Open Sans', sans-serif; }
               `
            }}
          />
          {styleNodes}
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
