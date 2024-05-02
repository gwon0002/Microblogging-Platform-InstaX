-- Delete a post by its ID
DELETE FROM posts
WHERE post_id = :post_id;

-- Update the content of a post by its ID
UPDATE posts
SET content = :new_content
WHERE post_id = :post_id;

-- Add a like for a post by a user
INSERT INTO post_likes (post_id, user_id)
VALUES (:post_id, :user_id);

-- Remove a like for a post by a user
DELETE FROM post_likes
WHERE post_id = :post_id AND user_id = :user_id;

-- Count the number of likes for a specific post
SELECT COUNT(*) AS like_count
FROM post_likes
WHERE post_id = :post_id;

CREATE TABLE posts 
(
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    content TEXT,
    post_date DATE,
    post_time TIME,
    CONSTRAINT fk_user FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE post_likes 
(
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(post_id),
    CONSTRAINT fk_user_post_like FOREIGN KEY (user_id) REFERENCES users(user_id)
);
