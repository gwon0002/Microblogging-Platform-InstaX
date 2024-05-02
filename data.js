// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "cse-mysql-classes-01.cse.umn.edu",// this will work
  user: "C4131F23U79",
  database: "C4131F23U79",
  password: "6291", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

async function deletePostById(postId) 
{
  const query = 'DELETE FROM posts WHERE post_id = ?';
  return await connPool.awaitQuery(query, postId);
}

async function updatePostContentById(postId, newContent) 
{
  const query = 'UPDATE posts SET content = ? WHERE post_id = ?';
  return await connPool.awaitQuery(query, [newContent, postId]);
}

async function addLikeForPost(postId, userId) 
{
  const query = 'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)';
  return await connPool.awaitQuery(query, [postId, userId]);
}

async function removeLikeForPost(postId, userId) 
{
  const query = 'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?';
  return await connPool.awaitQuery(query, [postId, userId]);
}

async function countLikesForPost(postId) 
{
  const query = 'SELECT COUNT(*) AS like_count FROM post_likes WHERE post_id = ?';
  const result = await connPool.awaitQuery(query, postId);
  return result[0].like_count;
}

module.exports = 
{
  deletePostById,
  updatePostContentById,
  addLikeForPost,
  removeLikeForPost,
  countLikesForPost,
};