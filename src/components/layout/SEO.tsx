import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

export function SEO({
  title = 'Atlas Hoops | Moroccan Basketball Club',
  description = 'Experience the power of Moroccan basketball. Join the fanbase of the most dynamic team in the kingdom.',
  image = '/og-image.jpg', // Placeholder for actual OG image
  url = 'https://atlashoops.ma',
  type = 'website',
}: SEOProps) {
  const siteTitle = title.includes('Atlas Hoops') ? title : `${title} | Atlas Hoops`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data for Sports Team */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SportsTeam",
          "name": "Atlas Hoops",
          "sport": "Basketball",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Casablanca",
            "addressCountry": "MA"
          },
          "url": "https://atlashoops.ma",
          "logo": "https://atlashoops.ma/logo.png"
        })}
      </script>
    </Helmet>
  );
}
