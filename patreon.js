require("dotenv").config();

const express = require("express");
const app = express();
const port = 9786;

const patreon = require("patreon");
const patreonAPI = patreon.patreon;
const patreonAPIClient = patreonAPI(process.env.ACCESS_TOKEN);

const savePatreons = () => {
	patreonAPIClient(
		`/campaigns/${process.env.CAMPAIGN_ID}/pledges?include=patron.null`
	)
		.then(({ store }) => {
			console.log(store.findAll("pledge"));
			const pledges = store.findAll("pledge");
			for (let i of pledges) {
				const firstName = i.patron.first_name;
				const tier =
					i.pledge_cap_cents === 100
						? "bronze"
						: i.pledge_cap_cents === 300
						? "silver"
						: "gold";
				console.log(firstName, tier);
			}
			console.log("done");
		})
		.catch(err => {
			console.log("caught");
			console.error("error!", err);
			response.end(err);
		});
};

// Cache patreon list every 5 mins
setInterval(function () {
	savePatreons();
}, 60000 * 5);
savePatreons();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.get("/getPatrons", function (req, res, next) {
	savePatreons();
	// get("nook:pledges").then(r => {
	// 	res.json(JSON.parse(r));
	// });
});

app.listen(port, () =>
	console.log(`Patreon API listening at http://localhost:${port}`)
);
