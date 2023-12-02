const { pool } = require('../db/pool.js');
const { MIME_TYPES } = require('../mimetypes.js');

const getStories = async (req, res, logger) => {
  try {
    const client = await pool.connect();
    const data = await client.query('SELECT story_id, title, content FROM jungleBlog.stories');
    res.writeHead(200, { 'Content-Type': MIME_TYPES['json'] });
    res.end(JSON.stringify(data.rows));
    client.release();
  } catch (err) {
    res.writeHead(500);
    res.end('Something went wrong');
    await logger.log(err);
  }
};

const getStory = async (req, res, logger) => {
  try {
    const splitedUrl = req.url.split('/');
    const storyId = splitedUrl[splitedUrl.length - 1];
    const parsedStoryId = +storyId;
    if (isNaN(parsedStoryId)) throw new Error(`Invalid story id, id = "${storyId}"`);
    const client = await pool.connect();
    const data = await client.query(`SELECT story_id, title, content FROM jungleBlog.stories WHERE story_id=${storyId}`);
    res.writeHead(200, { 'Content-Type': MIME_TYPES['json'] });
    res.end(JSON.stringify(data.rows));
    client.release();
  } catch (err) {
    res.writeHead(500);
    res.end('Something went wrong');
    await logger.log(err);
  }
};

module.exports = { getStories, getStory };