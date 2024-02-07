import 'dotenv/config'
import express from 'express';
import logger from 'morgan';

import indexRouter from './routes/index';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.info(`Server started on http://localhost:${PORT}`);
});
