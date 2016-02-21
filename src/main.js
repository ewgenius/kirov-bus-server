import express from 'express';

let PORT = process.env.PORT || 3000;
let app = express();

let server = app.listen(PORT, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`server listening at http://${host}:${port}`);
})
