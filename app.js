const express = require('express');
const app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


app.use(express.json());

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Movies API",
			version: "1.0.0",
			description: "A simple Express Movies API",
		},
		servers: [
			{
				url: "http://localhost:9000",
			},
		],
	},
	apis: ["./routes/*.js"],
  deepLinking: true,  // This option enables deep linking
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// Add the routes
const moviesRoutes = require('./routes/movies');
app.use('/Movies', moviesRoutes);

// Add the routes
const catagoryRoutes = require('./routes/catagory');
app.use('/Catagory', catagoryRoutes);


app.listen(9000, () => console.log("listening on 9000"));

