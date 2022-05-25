module.exports = {
  port: '9993',
  scrape_url: 'https://ww2.gogoanimes.org',
  rule_path: {
    popular: '/popular?page=',
    search: '/search?keyword=',
    anime: '/category/',
    episode: '/watch/'
  },
  api_path: '/api/',
  page_path: '/',
  jwt_secret: 'c8003341936d19db28bd599d52cf19478352ed2b84d265b9e60db5e586c2d30dc68e4c0c5daed99216b09a96aa5d7220ea550f9a4b089576550ab7c5adbec500'
}