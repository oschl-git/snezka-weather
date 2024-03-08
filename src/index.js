const express = require('express');
const path = require('path');
const routeCache = require('route-cache');
const minify = require('express-minify');
const compression = require('compression');

const app = express();
const port = 3000;

async function main() {
	app.use(compression());
	app.use(minify());

	app.use(express.static(path.join(__dirname, 'public')));

	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, 'views'));

	app.get('/', routeCache.cacheSeconds(1000 * 60 * 60 * 24), async function (req, res) {
		console.log('Recaching index route...');

		res.render('index', {
			disableImages: true,
			disableSeoGarbage: true,
		});
	});

	app.listen(port, () => {
		console.log(`[OK] Successfully started server at port ${port}. (http://localhost:${port})`);
	});
}

main();