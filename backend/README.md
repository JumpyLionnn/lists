## How to run
### Local
Requires Docker!

Create a file `.env` with the content from the docker image:
```
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_PASSWORD=123456Aa@
DATABASE_USERNAME=appuser
DATABASE_NAME=lists
```

Build the files, start the db and start the server. **Note: does not watch for updating files!**
```
npm install
npm run build
docker-compose up -d
npm start
```