module.exports = {
    reactStrictMode: true,
    i18n: {
      locales: ['en-us', 'en-ca', 'en', 'fr', 'zh'],
      defaultLocale: 'en-us',
    },
    async redirects() {
      return [
        {
          source: '/search',
          destination: '/search/product',
          permanent: true,
        },
        {
          source: '/',
          destination: '/home',
          permanent: true,
        }
      ]
    },
    // async headers() {
    //     return [
    //         {
    //             source: '/(.*)?', // Matches all pages
    //             headers: [
    //                 {
    //                     key: 'X-Frame-Options',
    //                     value: 'DENY',
    //                 }
    //             ]
    //         }
    //     ]
    // }
  }
  