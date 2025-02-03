import Head from "next/head";
import { FC } from "react";

type MetaTagsProps = {
  subtitle?: string;
};

export const MetaTags: FC<MetaTagsProps> = ({ subtitle }) => {
  const title = subtitle ? `TITLE | ${subtitle}` : "TITLE";
  const description = "DESCRIPTION";
  // TODO: Add url for your project
  const url = "";
  // TODO: Add cover image url for your project
  const imageUrl = "IMAGE_URL";
  return (
    <Head>
      <title>{title}</title>
      {/* TODO: Add favicon for your project */}
      {/* <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔮</text></svg>"
      /> */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Prevent zoom */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      ></meta>
    </Head>
  );
};
