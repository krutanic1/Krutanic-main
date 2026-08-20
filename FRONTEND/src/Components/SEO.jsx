import React from 'react';
import { Helmet } from 'react-helmet-async';
import { metaConfig, defaultMeta } from '../seo/metaConfig';

const SEO = ({ path }) => {
  const meta = metaConfig[path] || defaultMeta;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      {meta.canonical && <link rel="canonical" href={meta.canonical} />}
      <meta name="robots" content="index,follow" />
      <meta property="og:type" content={meta.ogType || "website"} />
      <meta property="og:title" content={meta.ogTitle || meta.title} />
      <meta property="og:description" content={meta.ogDescription || meta.description} />
      {meta.ogUrl && <meta property="og:url" content={meta.ogUrl} />}
    </Helmet>
  );
};

export default SEO;
