import React from 'react'
import { Helmet } from 'react-helmet-async'

function SEO({ title, description, keywords, url, image }) {
  const siteName = 'EatWella'
  const defaultDescription = 'Delicious, healthy, and affordable meals delivered to your doorstep. Experience the best of Nigerian cuisine with our curated menu and meal plans.'
  const defaultKeywords = 'EatWella, food delivery, Nigerian cuisine, healthy meals, meal plans, restaurant, online food order, Awka, Nigeria'
  const defaultImage = 'https://eatwella.com/Vector.png'
  const defaultUrl = 'https://eatwella.com/'

  const metaTitle = title ? `${title} | ${siteName}` : siteName
  const metaDescription = description || defaultDescription
  const metaKeywords = keywords || defaultKeywords
  const metaImage = image || defaultImage
  const metaUrl = url || defaultUrl

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  )
}

export default SEO
