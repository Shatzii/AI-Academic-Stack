import React from 'react'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'

const SEOHead = ({
  title = 'Go4it Sports Academy - Elite Training for NCAA & Professional Athletes',
  description = 'The ultimate training platform for student athletes pursuing NCAA sports and professional FIFA soccer careers. Combine elite athletic training with academic excellence.',
  keywords = 'NCAA training, FIFA soccer, athlete performance, sports academy, academic excellence, student athletes',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  twitterCard = 'summary_large_image',
  structuredData = null
}) => {
  const siteName = 'Go4it Sports Academy'
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`

  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteName,
    description: description,
    url: url,
    logo: `${typeof window !== 'undefined' ? window.location.origin : ''}/logo.png`,
    sameAs: [
      'https://facebook.com/go4itsports',
      'https://twitter.com/go4itsports',
      'https://instagram.com/go4itsports'
    ]
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content={siteName} />
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  )
}

SEOHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  type: PropTypes.string,
  twitterCard: PropTypes.string,
  structuredData: PropTypes.object
}

export default SEOHead