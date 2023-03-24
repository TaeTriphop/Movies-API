const express = require('express');
const router = express.Router();
var connection = require('../config');

/**
 * @swagger
 * components:
 *   schemas:
 *     Movies:
 *       type: object
 *       required:
 *         - movies_name_th
 *         - movies_name_en
 *         - movies_year
 *         - movies_length
 *         - movies_rating
 *         - movies_img
 *         - movies_description
 *         - movies_review
 *         - movies_link
 *         - category_id
 *       properties:
 *         movies_name_th:
 *           type: string
 *           description: The movies_name_th 
 *         movies_name_en:
 *           type: string
 *           description: The movies_name_en 
 *         movies_year:
 *           type: string
 *           description: The movies_year 
 *         movies_length:
 *           type: integer
 *           description: The movies_length 
 *         movies_rating:
 *           type: integer
 *           description: The movies_rating 
 *         movies_img:
 *           type: string
 *           description: The movies_img 
 *         movies_description:
 *           type: string
 *           description: The movies_description 
 *         movies_review:
 *           type: string
 *           description: The movies_review 
 *         movies_link:
 *           type: string
 *           description: The movies_link 
 *         category_id:
 *           type: integer
 *           description: The category_id 
 *       example:
 *         movies_name_th: string
 *         movies_name_en: string
 *         movies_year: 1990
 *         movies_length: 0
 *         movies_rating: 0
 *         movies_img: string
 *         movies_description: string
 *         movies_review: string
 *         movies_link: string
 *         category_id: 1
 */


/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: The Movies managing API
 */

/**
* @swagger
 * /Movies:
 *   get:
 *     summary: Get all Movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Success
 */

router.get('/', (req, res) => {
  const sql = "SELECT * FROM movies";
  getQuery(sql, function (result) {
    res.send(result);
  });
});

/**
 * @swagger
 * /Movies/{movies_id}:
 *   get:
 *     summary: Get Movies By Id
 *     tags: [Movies]
 *     parameters:
 *       - name: movies_id
 *         description: ID of the movie
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Movie not found
 * 
 */

router.get('/:movies_id', (req, res) => {
  const sql = `SELECT * FROM movies WHERE movies_id = ?`;
  const values = [req.params.movies_id];
  console.log(values);
  if (isNaN(values)) {
    console.log(values + " is not a number <br/>");
    res.status(404).send();
  } else {
    PostOrPutQuery(sql, values, function (result) {
      if (result.data.length !== 0) {
        console.log(result)
        res.send(result);
      } else if (result.data.length === 0) {
        res.status(404).send({
          status: "success",
          message: 'Movie not found',
          data: []
        });
      } else {
        throw err;
      }
    });
  }

});


/**
 * @swagger
 * /Movies:
 *   post:
 *     summary: Insert a new movie into the database.
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/Movies'
 *     responses:
 *       200:
 *         description: Successfully inserted a new movie into the database.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 *       400:
 *         description: Invalid request body.
 *       500:
 *         description: Server error.
 */

router.post('/', (req, res) => {
  const {
    movies_name_th,
    movies_name_en,
    movies_year,
    movies_length,
    movies_rating,
    movies_img,
    movies_description,
    movies_review,
    movies_link,
    category_id,
  } = req.body;

  const sql = `
    INSERT INTO movies (
      movies_name_th, 
      movies_name_en, 
      movies_year, 
      movies_length, 
      movies_rating, 
      movies_img, 
      movies_description, 
      movies_review, 
      movies_link, 
      category_id
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    movies_name_th,
    movies_name_en,
    movies_year,
    movies_length,
    movies_rating,
    movies_img,
    movies_description,
    movies_review,
    movies_link,
    category_id,
  ];

  PostOrPutQuery(sql, values, function (result) {
    res.send(result);
  });
});

/**
 * @swagger
 * /Movies/{movies_id}:
 *   put:
 *     summary: Update the Movies by the id
 *     tags: [Movies]
 *     parameters:
 *      - in: path
 *        name: movies_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/Movies'
 *     responses:
 *       200:
 *         description: Successfully The Movies was updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movies'
 *       400:
 *         description: Invalid request body.
 *       500:
 *         description: Server error.
 */

router.put('/:movies_id', (req, res) => {
  const {
    movies_name_th,
    movies_name_en,
    movies_year,
    movies_length,
    movies_rating,
    movies_img,
    movies_description,
    movies_review,
    movies_link,
    category_id,
  } = req.body;
  const movies_id = req.params.movies_id;
  const sql = `UPDATE movies
  SET
    movies_name_th = ?,
    movies_name_en = ?,
    movies_year = ?,
    movies_length = ?,
    movies_rating = ?,
    movies_img = ?,
    movies_description = ?,
    movies_review = ?,
    movies_link = ?,
    category_id = ?,
    update_timestamp = NOW()
  WHERE
    movies_id = ?;`;

  const values = [
    movies_name_th,
    movies_name_en,
    movies_year,
    movies_length,
    movies_rating,
    movies_img,
    movies_description,
    movies_review,
    movies_link,
    category_id,
    movies_id
  ];

  PostOrPutQuery(sql,values, function(result) {
    res.send(result);
  });
  
})


/**
 * @swagger
 * /Movies/{movies_id}:
 *   delete:
 *     summary: Remove the Movies by id
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movies_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Movies id
 * 
 *     responses:
 *       200:
 *         description: The Movies was deleted
 *       404:
 *         description: The Movies was not found
 */

router.delete('/:movies_id', (req, res) => {
  const movies_id = req.params.movies_id;
  const sql = `DELETE FROM movies WHERE movies_id = ?` ;
  const values = [movies_id];
  PostOrPutQuery(sql,values, function(result) {
    res.send(result)
  });
})


// function Get Query
function getQuery(sql, callback) {
  connection.query(sql, function (err, results) {
    if (err) throw err;
    callback({
      status: "success",
      message: 'OK',
      data: results
    });
  });
}

// function Post / Put Query
function PostOrPutQuery(sql, value, callback) {
  connection.query(sql, value, function (err, results) {
    if (err) throw err;
    callback({
      status: "success",
      message: 'OK',
      data: results
    });

  });
}



module.exports = router;