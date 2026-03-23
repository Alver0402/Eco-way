const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`EcoWay API listening at http://localhost:${PORT}`);
});
