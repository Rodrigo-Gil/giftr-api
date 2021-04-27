import config from 'config'

console.log({
  API_DBUSER: config.get('db'),
})
