/** @type {import("next").NextConfig} */
const config = {
  async headers() {
    return [
      {
        source: '/api/:slug*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: '*' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
    ]
  },
}

module.exports = config
