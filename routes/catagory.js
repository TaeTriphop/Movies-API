const express = require('express');
const router = express.Router();
var connection = require('../config');

/**
 * @swagger
 * components:
 *   schemas:
 *     Catagory:
 *       type: object
 *       required:
 *         - category_name_th
 *         - category_name_en
 *       properties:
 *         category_name_th:
 *           type: string
 *           description: The category_name_th 
 *         category_name_en:
 *           type: string
 *           description: The category_name_en 
 *       example:
 *         category_name_th: string
 *         category_name_en: string
 */


/**
 * @swagger
 * tags:
 *   name: Catagory
 *   description: The Catagory managing API
 */

/**
* @swagger
 * /Catagory:
 *   get:
 *     summary: Get all Catagory
 *     tags: [Catagory]
 *     responses:
 *       200:
 *         description: Success
 */

router.get('/', (req, res) => {
    const sql = "SELECT * FROM category_movies";
    getQuery(sql, function (result) {
        res.send(result);
    });
});

/**
 * @swagger
 * /Catagory/{category_id}:
 *   get:
 *     summary: Get Catagory By Id
 *     tags: [Catagory]
 *     parameters:
 *       - name: category_id
 *         description: ID of the Catagory
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

router.get('/:category_id', (req, res) => {
    const sql = `SELECT * FROM category_movies WHERE category_id = ?`;
    const values = [req.params.category_id];
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
                    message: 'Category not found',
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
* /Catagory:
*   post:
*     summary: Insert a new Catagory into the database.
*     tags: [Catagory]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*            $ref: '#/components/schemas/Catagory'
*     responses:
*       200:
*         description: Successfully inserted a new Catagory into the database.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Catagory'
*       400:
*         description: Invalid request body.
*       500:
*         description: Server error.
*/

router.post('/', (req, res) => {
    const {
        category_name_th,
        category_name_en,
    } = req.body;

    const sql = `INSERT INTO category_movies (
        category_name_th, 
        category_name_en
      ) 
      VALUES (?, ?)`;

    const values = [
        category_name_th,
        category_name_en,
    ];

    PostOrPutQuery(sql, values, function (result) {
        res.send(result);
    });
});

/**
 * @swagger
 * /Catagory/{category_id}:
 *   put:
 *     summary: Update the Catagory by the id
 *     tags: [Catagory]
 *     parameters:
 *      - in: path
 *        name: category_id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            $ref: '#/components/schemas/Catagory'
 *     responses:
 *       200:
 *         description: Successfully The Catagory was updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Catagory'
 *       400:
 *         description: Invalid request body.
 *       500:
 *         description: Server error.
 */

router.put('/:category_id', (req, res) => {
    const {
        category_name_th,
        category_name_en,
    } = req.body;

  const category_id = req.params.category_id;
  const sql = `UPDATE category_movies
  SET
  category_name_th = ?,
  category_name_en = ?,
    update_timestamp = NOW()
  WHERE
  category_id = ?;`;

  const values = [
    category_name_th,
    category_name_en,
    category_id
  ];

  PostOrPutQuery(sql,values, function(result) {
    res.send(result);
  });
  
})


/**
 * @swagger
 * /Catagory/{category_id}:
 *   delete:
 *     summary: Remove the Catagory by id
 *     tags: [Catagory]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Catagory id
 * 
 *     responses:
 *       200:
 *         description: The Catagory was deleted
 *       404:
 *         description: The Catagory was not found
 */

router.delete('/:category_id', (req, res) => {
    const category_id = req.params.category_id;
    const sql = `DELETE FROM category_movies WHERE category_id = ?` ;
    const values = [category_id];
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