const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const projectRoot = __dirname;


app.use((req, res, next) => {
    const pathname = decodeURIComponent(req.path);
    if (
        pathname === '/node_modules' || pathname.startsWith('/node_modules/') ||
        pathname === '/.git' || pathname.startsWith('/.git/') ||
        pathname === '/app.js' || /\.json$/i.test(pathname)
    ) {
        return res.sendStatus(404);
    }
    next();
});

app.use(express.static(projectRoot, { index: false, dotfiles: 'deny' }));

app.get('/', (_req, res) => {
    res.sendFile(path.join(projectRoot, 'index.html'));
});

app.listen(port, () => {
    console.log(`Web server is running at http://localhost:${port}`);
});
