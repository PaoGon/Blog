<?php
    class Post{
        protected $db;

        public $id;
        public $user_id;
        public $title;
        public $content;
        public $created_at;

        public function __construct($db){
            $this->db = $db;
        }

        // Get all posts in descending order
        public function getPosts(){
            $query_posts = "
                SELECT 
                    name, 
                    posts.id AS post_id, 
                    users.id,
                    title, 
                    content, 
                    created_at
                FROM users
                INNER JOIN posts
                    ON posts.user_id = users.id
                ORDER BY created_at DESC
            ";
            $stmt = $this->db->prepare($query_posts);
            $stmt->execute();
            return $stmt;
        }


        // Get all the post of a certain user
        public function getOwnPosts(){
            $query_posts = "
                SELECT id, title, content, created_at
                FROM posts
                WHERE user_id = :user_id 
                ORDER BY created_at DESC;
            ";
            $query_stmt = $this->db->prepare($query_posts);
            $query_stmt->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
            $query_stmt->execute();

            return $query_stmt;
        }

        // Create post
        public function createPost(){
            $create_query = "
                INSERT into posts(user_id, title, content) 
                VALUES(:user_id, :title, :content)
            ";

            $create_stmt = $this->db->prepare($create_query);
            $create_stmt->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
            $create_stmt->bindValue(':title', htmlspecialchars(strip_tags($this->title)), PDO::PARAM_STR);
            $create_stmt->bindValue(':content', htmlspecialchars(strip_tags($this->content)), PDO::PARAM_STR);
            
            $create_stmt->execute();

            if($create_stmt->rowCount() > 0){
                return 1;
            }
            else{
                return 0;
            }
        }

        // Update post
        public function updatePost(){
            $update_query = "
                UPDATE posts
                SET 
                    title = :title,
                    content = :content
                WHERE user_id = :user_id AND id = :id
            ";

            $update_stmt = $this->db->prepare($update_query);
            $update_stmt->bindValue(':id', $this->id, PDO::PARAM_INT);
            $update_stmt->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
            $update_stmt->bindValue(':title', htmlspecialchars(strip_tags($this->title)), PDO::PARAM_STR);
            $update_stmt->bindValue(':content', htmlspecialchars(strip_tags($this->content)), PDO::PARAM_STR);
            
            $update_stmt->execute();
        }

        // Delete post
        public function deletePost(){
            $update_query = "
                DELETE FROM posts
                WHERE user_id = :user_id AND id = :id
            ";

            $delete_stmt = $this->db->prepare($update_query);
            $delete_stmt->bindValue(':id', $this->id, PDO::PARAM_INT);
            $delete_stmt->bindValue(':user_id', $this->user_id, PDO::PARAM_INT);
            
            $delete_stmt->execute();
        }
    }
?>
