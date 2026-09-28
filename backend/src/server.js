const app = require('./app');
require('./database/database');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Petling API rodando em http://localhost:${PORT}`);
});