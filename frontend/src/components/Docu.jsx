import React from 'react';


import '../assets/css/docs.css';



const Docu = () => {
    return (
        <div className="docs">
            <div className="docs-cont">
                <div className="doc-head">
                    <h1>Simple Blog Style Web App</h1>
                    <p className="sub">by: Paolo L. Gonzales</p>
                </div>
                <hr />
                <div className="folder-struc">
                    <h2 >Project Folder Structure</h2>
                    <p>This is going to be the file structure of our blog's REST API. This is where
                        the API's and Database related source files will be stored.
                    </p>
                </div>
                <div className="ttd">
                    <pre>
                        <code>
                             api<br />
                            ├──  accounts<br />
                            │  ├──  CheckAuth.php<br />
                            │  ├──  login.php<br />
                            │  └──  signup.php<br />
                            ├──  classes<br />
                            │  ├──  JwtHandler.php<br />
                            │  └──  Post.php<br />
                            ├──  composer.json<br />
                            ├──  composer.lock<br />
                            ├──  config<br />
                            │  └──  Database.php<br />
                            ├──  create_post.php<br />
                            ├──  delete_post.php<br />
                            ├──  get_own_posts.php<br />
                            ├──  get_posts.php<br />
                            ├──  get_user.php<br />
                            ├──  update_post.php<br />
                            └──  vendor<br />
                            ├──  autoload.php<br />
                            ├──  composer<br />
                            └──  firebase<br />
                        </code>
                    </pre>
                </div>
                <hr />
                <div className="db">
                    <h1 className="db-head">Database Configuration</h1>
                    <p className="db-start">I made this project using PostgreSQL, thats why some syntax is different</p>
                    <h2 className="db-make">Make a database</h2>
                    <pre>
                        <code >createdb blog</code>
                    </pre>

                    <p>After creating the database start creating the user tabele</p>
                    <blockquote>
                        <pre>
                            <code>
                                CREATE TABLE `users` ( <br />
                                `id` SERIAL PRIMARY KEY,<br />
                                `name` varchar(120) NOT NULL,<br />
                                `email` varchar(180) NOT NULL,<br />
                                `password` varchar NOT NULL<br />
                                );<br />
                            </code>
                        </pre>

                    </blockquote>
                    <p>After we create the users tabe we will now create the "posts" table</p>
                    <blockquote>
                        <pre>
                            <code>
                                CREATE TABLE posts ( <br />
                                `id` SERIAL PRIMARY KEY,<br />
                                `user_id` INTEGER NOT NULL REFERENCES `user`<br />
                                `title` varchar(300) NOT NULL,<br />
                                `content` varchar(1000) NOT NULL,<br />
                                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()<br />
                                );<br />
                            </code>
                        </pre>
                    </blockquote>
                    <hr />
                    <h1 className='db'>Make Database Connection to PHP</h1>
                    <p>
                        Inside the project folder creaate a <code className="inside">config</code> folder
                        and also the <code className="inside">Database.php</code>file
                    </p>

                    <pre>
                        <code>{
                            `
    <?php
        class Database{

            private $host = 'localhost';
            private $db_name = 'blog';
            private $user = 'gon';
            private $password = 'testPassword';

            public $conn;

            public function getConnection(){
                $this->conn = null;

                try{
                    $this->conn = new PDO("pgsql:host=" . $this->host . ";port=5432;dbname=" . $this->db_name, $this->user, $this->password);
                    $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
                }
                catch(PDOException $exception){
                    echo "Database could not be connected: " . $exception->getMessage();
                }
                return $this->conn;

            }
        }
    ?>
                            `
                        }
                        </code>
                    </pre>
                </div>
                <hr />
                <div className="db">
                    <h1>Create PHP classes</h1>
                    <p>
                        After we create the connection to the database we will know make the <code className="inside">POSTS</code> class. Each
                        method in this class will handle the CRUD operation for a define table rows.
                    </p>
                    <pre>
                        <code>
                            {
                                `
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
            return $create_stmt;
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
            `
                            }
                        </code>
                    </pre>
                    <h1>
                        Create the <code className="inside"> JWTHandler Class.</code>
                    </h1>
                    <p>
                        this will handle the decoding and encoding of JWT token that is used in our
                        authentication.
                    </p>
                    <pre>
                        <code>
                            {
                                `
<?php
require __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtHandler{
    protected $key;
    protected $token;
    protected $issuedAt;
    protected $expire;
    protected $jwt;

    public function __construct()
    {
        // set your default time-zone
        $this->issuedAt = time();

        // Token Validity (3600 second = 1hr)
        $this->expire = $this->issuedAt + 3600;

        // Set your secret or signature
        $this->key = "privatekey";
    }

    public function jwtEncodeData($iss, $aud, $data){

        $this->token = array(
            //Adding the identifier to the token (who issue the token)
            "iss" => $iss,
            "aud" => $aud,
            // Adding the current timestamp to the token, for identifying that when the token was issued.
            "iat" => $this->issuedAt,
            // Token expiration
            "exp" => $this->expire,
            // Payload
            "data" => $data
        );

        $this->jwt = JWT::encode($this->token, $this->key, 'HS256');
        return $this->jwt;
    }

    public function jwtDecodeData($jwt_token)
    {
        try {
            //$decode = JWT::decode($jwt_token, $this->key, array('HS256'));
            $decode = JWT::decode($jwt_token, new Key($this->key, 'HS256'));
            return [
                "data" => $decode->data
            ];
        } catch (Exception $e) {
            return [
                "message" => $e->getMessage()
            ];
        }
    }
}
?>
            `
                            }

                        </code>
                    </pre>
                    <h1>Create the <code className="inside">CheckAuth </code> file</h1>
                    <p>This file is for checking the user authentication token every time the user will access an API</p>
                    <pre>
                        <code>
                            {
                                `

<?php
    require __DIR__ . '/../classes/JwtHandler.php';

    class CheckAuth extends JwtHandler{
        protected $db;
        protected $headers;
        protected $token;

        public function __construct($db, $headers){
            parent::__construct();
            $this->db = $db;
            $this->headers = $headers;
        }

        public function isValid(){
            if (isset($this->headers['Authorization'])) {

                $token = str_replace('Bearer ', '', $this->headers['Authorization']);
                $data = $this->jwtDecodeData($token);

                if ( isset($data['data']->id) && $this->fetchUser($data['data']->id)){
                    $user = $this->fetchUser($data['data']->id);
                    return [
                        "success" => 1,
                        "user" => $user
                    ];
                } 
                else{
                    return [
                        "success" => 0,
                        "message" => $data,
                    ];
                }
            } else {
                return [
                    "success" => 0,
                    "message" => "Token not found in request"
                ];
            }
        }

        protected function fetchUser($user_id){
            try {
                $fetch_user_by_id = "SELECT id, name, email FROM users WHERE id=:id";
                $query_stmt = $this->db->prepare($fetch_user_by_id);
                $query_stmt->bindValue(':id', $user_id, PDO::PARAM_INT);
                $query_stmt->execute();

                if ($query_stmt->rowCount()){
                    return $query_stmt->fetch(PDO::FETCH_ASSOC);
                } 
                else{
                    return false;
                }
            } catch (PDOException $e) {
                return null;
            }
        }
    }
?>
            `
                            }

                        </code>
                    </pre>
                    <hr />

                    <h1 className='endpoint'>Last we will create the API endpoints</h1>
                    <h1>
                        <code className="inside">Login endpint</code>
                    </h1>
                    <pre>
                        <code>

                            {
                                `
<?php
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Content-Type: application/json");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/../config/Database.php';
    require_once __DIR__ . '/../classes/JwtHandler.php';

    function msg($success,$status,$message,$extra = []){
        return array_merge([
            'success' => $success,
            'status' => $status,
            'message' => $message
        ],$extra);
    }

    $database = new Database();
    $conn = $database->getConnection();

    $data = json_decode(file_get_contents("php://input"));
    $returnData = [];

    // For CROSS-ORGIN RESOURCE SHARING(CORS) PREFILIGHT
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    // IF REQUEST METHOD IS POST
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        // CHECKING EMPTY FIELDS
        if(!isset($data->email) 
            || !isset($data->password)
            || empty(trim($data->email))
            || empty(trim($data->password))
        ){
            $fields = ['fields' => ['email','password']];
            http_response_code(400);
            $returnData = msg(0,400,'Please Fill in all Required Fields!',$fields);
        }
        else{

            $email = trim($data->email);
            $password = trim($data->password);

            // CHECKING THE EMAIL FORMAT (IF INVALID FORMAT)
            if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
                http_response_code(401);
                $returnData = msg(0,401,'Invalid Email Address!');
            }
            // THE USER IS ABLE TO PERFORM THE LOGIN ACTION
            else{

                try{

                    $fetch_user_by_email = "SELECT * FROM users WHERE email=:email";
                    $query_stmt = $conn->prepare($fetch_user_by_email);
                    $query_stmt->bindValue(':email', $email,PDO::PARAM_STR);
                    $query_stmt->execute();

                    // IF THE USER IS FOUNDED BY EMAIL
                    if($query_stmt->rowCount()){
                        $row = $query_stmt->fetch(PDO::FETCH_ASSOC);
                        $check_password = password_verify($password, $row['password']);

                        // VERIFYING THE PASSWORD 
                        // IF PASSWORD IS CORRECT THEN Create THE LOGIN TOKEN
                        if($check_password){
                            $jwt = new JwtHandler();
                            $token = $jwt->jwtEncodeData(
                                'http://blog.local/api/accounts', 
                                'http://localhost:3000',
                                array('id'=>$row['id'])
                            );

                            http_response_code(200);
                            $returnData = [
                                'success' => 1,
                                'message' => 'You have successfully logged in.',
                                'token' => $token
                            ];
                        }

                        // IF PASSWORD IS INCORRECT
                        else{
                            http_response_code(401);
                            $returnData = msg(0,401,'Invalid Email or Password!');
                        }
                    }

                    // IF THE USER EMAIL NOT FOUND THEN SHOW THE FOLLOWING ERROR 
                    else{
                        $returnData = msg(0,422,'Invalid Email or Password!');
                    }
                }
                catch(PDOException $e){
                    http_response_code(500);
                    $returnData = msg(0,500,$e->getMessage());
                }
            }
        }
    }
    // IF THERE ARE NO EMPTY FIELDS THEN-
    else{
        http_response_code(405);
        $returnData = msg(0, 405, 'Method Not Allowed!');
    }
    echo json_encode($returnData);
?>
                                `
                            }</code>

                    </pre>
                    <h1>
                        <code className="inside">Signup endpoint</code>
                    </h1>
                    <pre>
                        <code>{
                            `
<?php
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Content-Type: application/json");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/../config/Database.php';

    function msg($success, $status, $message, $extra = []){
        return array_merge([
            'success' => $success,
            'status' => $status,
            'message' => $message
        ], $extra);
    }

    $database = new Database();
    $conn = $database->getConnection();


    // DATA FORM REQUEST
    $data = json_decode(file_get_contents("php://input"));
    $returnData = [];

    // For CROSS-ORGIN RESOURCE SHARING(CORS) PREFILIGHT
    if ($_SERVER["REQUEST_METHOD"] == "OPTIONS"){
        http_response_code(200);
        exit;
    }

    // IF METHOD IS POST
    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        if (
            !isset($data->name)
            || !isset($data->email)
            || !isset($data->password)
            || empty(trim($data->name))
            || empty(trim($data->email))
            || empty(trim($data->password))
        ){
            $fields = ['fields' => ['name', 'email', 'password']];
            http_response_code(400);
            $returnData = msg(0,400,'Please Fill in all Required Fields!',$fields);
        }
        else{

            $name = trim($data->name);
            $email = trim($data->email);
            $password = trim($data->password);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
                http_response_code(401);
                $returnData = msg(0,401,'Invalid Email Address!');
            } 

            elseif (strlen($password) < 8){
                http_response_code(401);
                $returnData = msg(0, 401, 'Your password must be at least 8 characters long!');
            } 

            elseif (strlen($name) < 3){
                http_response_code(401);
                $returnData = msg(0, 401, 'Your name must be at least 3 characters long!');
            }

            else{
                try {

                    $check_email = "SELECT email FROM users WHERE email=:email";
                    $check_email_stmt = $conn->prepare($check_email);
                    $check_email_stmt->bindValue(':email', $email, PDO::PARAM_STR);
                    $check_email_stmt->execute();

                    if ($check_email_stmt->rowCount()) :
                        http_response_code(400);
                        $returnData = msg(0, 400, 'This E-mail already in use!');

                    else :
                        $insert_query = "INSERT INTO users(name, email, password) VALUES(:name,:email,:password)";

                    $insert_stmt = $conn->prepare($insert_query);

                    // DATA BINDING
                    $insert_stmt->bindValue(':name', htmlspecialchars(strip_tags($name)), PDO::PARAM_STR);
                    $insert_stmt->bindValue(':email', $email, PDO::PARAM_STR);
                    $insert_stmt->bindValue(':password', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);

                    $insert_stmt->execute();

                    http_response_code(201);
                    $returnData = msg(1, 201, 'You have successfully registered.');

                    endif;
                } catch (PDOException $e) {
                    http_response_code(500);
                    $returnData = msg(0, 500, $e->getMessage());
                }
            } 
        }
    }
    // IF INVALID METHOD
    else{
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
    } 

    echo json_encode($returnData);
?>
            `
                        }
                        </code>
                    </pre>
                    <h1>
                        <code class="inside">Get all posts</code>
                    </h1>
                    <pre>
                        <code>
                            {
                                `
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/config/Database.php';
    require __DIR__ . '/classes/Post.php';
    require __DIR__ . '/accounts/CheckAuth.php';
    
    function msg($success,$status,$message,$extra = []){
        return array_merge([
            'success' => $success,
            'status' => $status,
            'message' => $message
        ],$extra);
    }
    $returnData = [];

    $database = new Database();
    $conn = $database->getConnection();
    $obj = new Post($conn);
    $stmt = $obj->getPosts();

    // For CROSS-ORGIN RESOURCE SHARING(CORS) PREFILIGHT
    if($_SERVER["REQUEST_METHOD"] == "OPTIONS"){
        http_response_code(200);
        exit;
    }

    // IF METHOD IS GET
    if($_SERVER["REQUEST_METHOD"] == "GET"){
        try{
            $headers = apache_request_headers();
            $check_auth = new CheckAuth($conn, $headers);
            $auth = $check_auth->isValid();
            
            
            if($auth['success'] == 1){
                if($stmt->rowCount()){
                    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    http_response_code(200);
                    echo json_encode($data);
                }
                else{
                    http_response_code(400);
                    echo json_encode($rows);
                }
            }
            else{
                http_response_code(401);
                $returnData = msg(0, 401, 'Authentication Failed');
                echo json_encode($returnData);
            }
        }
        catch(Exception $e){
            echo json_encode($e);
            
        }
    }
    else{
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
        echo json_encode($returnData);
    }
?>

`
                            }
                        </code>

                    </pre>
                    <h1><code class="inside">Get owned posts endpoint</code></h1>
                    <pre>
                        <code>
                            {
                                `
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/config/Database.php';
    require __DIR__ . '/classes/Post.php';
    require __DIR__ . '/accounts/CheckAuth.php';
    
    function msg($success,$status,$message,$extra = []){
        return array_merge([
            'success' => $success,
            'status' => $status,
            'message' => $message
        ],$extra);
    }
    $returnData = [];


    $database = new Database();
    $conn = $database->getConnection();


    $obj = new Post($conn);
    $obj->user_id = (int)$_GET['user_id'];

    $stmt = $obj->getOwnPosts();

    // For CROSS-ORGIN RESOURCE SHARING(CORS) PREFILIGHT
    if($_SERVER["REQUEST_METHOD"] == "OPTIONS"){
        http_response_code(200);
        exit;
    }

    if($_SERVER["REQUEST_METHOD"] == "GET"){
        try{
            $headers = apache_request_headers();
            $check_auth = new CheckAuth($conn, $headers);
            $auth = $check_auth->isValid();

            if($auth['success'] == 1){



                if($stmt->rowCount()){
                    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

                    http_response_code(200);
                    $returnData=[
                        'success' => 1,
                        'status' => 200,
                        'message' => $data
                    ];
                }
                else{
                    http_response_code(400);
                    $returnData = msg(0,400, 'Post does not exist');
                }
            }
            else{
                http_response_code(401);
                $returnData = msg(0, 401, 'Authentication Failed');
                echo json_encode($returnData);
            }
        }
        catch(PDOException $e){
            echo json_encode($e);
            
        }
    }
    else{
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
    }
    echo json_encode($returnData);

?>

            `
                            }
                        </code>
                    </pre>
                    <h1><code class="inside">Create post enpoint</code></h1>
                    <pre>
                        <code>{`
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/config/Database.php';
    require __DIR__ . '/classes/Post.php';
    require __DIR__ . '/accounts/CheckAuth.php';

    function msg($success, $status, $message, $extra = []){
        return array_merge([
            'success' => $success,
            'status' => $status,
            'message' => $message
        ], $extra);
    }

    $database = new Database();
    $conn = $database->getConnection();
    $obj = new Post($conn);

    // DATA FORM REQUEST
    $data = json_decode(file_get_contents("php://input"));
    $returnData = [];

    // For CROSS-ORGIN RESOURCE SHARING(CORS) PREFILIGHT
    if($_SERVER["REQUEST_METHOD"] == "OPTIONS"){
        http_response_code(200);
        exit;
    }

    // IF METHOD IS POST
    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $headers = apache_request_headers();
        $check_auth = new CheckAuth($conn, $headers);
        $auth = $check_auth->isValid();

        if($auth['success'] == 1){

            // Checks if all the fields is set and filled up
            if (
                !isset($data->user_id)
                || !isset($data->title)
                || !isset($data->content)
                || empty(trim($data->user_id))
                || empty(trim($data->title))
                || empty(trim($data->content))
            ){
                $fields = ['fields' => ['title', 'content']];
                http_response_code(400);
                $returnData = msg(0,400,'Please Fill in all Required Fields!',$fields);
            }
            else{
                try{
                    $obj->user_id = $data->user_id;
                    $obj->title = $data->title;
                    $obj->content = $data->content;
                    $obj->createPost();
                    http_response_code(201);
                    $returnData = msg(1, 201, 'Post succesfuly created');
                }
                catch (PDOException $e) {
                    http_response_code(500);
                    $returnData = msg(0, 500, $e->getMessage());
                }
            }
        }
        else{
            http_response_code(401);
            $returnData = msg(0, 401, 'Authentication Failed');
            echo json_encode($returnData);
        }
    }
    else{
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
    }
    echo json_encode($returnData);


?>
            `}</code>
                    </pre>
                    <h1><code class="inside">Update post Enpoint</code></h1>
                    <pre>
                        <code>{`
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: PUT, OPTIONS");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/config/Database.php';
    require __DIR__ . '/classes/Post.php';
    require __DIR__ . '/accounts/CheckAuth.php';

    function msg($success, $status, $message, $extra = []){
        return array_merge([
            'success' => $success,
            'status' => $status,
            'message' => $message
        ], $extra);
    }

    $database = new Database();
    $conn = $database->getConnection();
    $obj = new Post($conn);

    // DATA FORM REQUEST
    $data = json_decode(file_get_contents("php://input"));
    $returnData = [];

    // For CROSS-ORGIN RESOURCE SHARING(CORS) PREFILIGHT
    if($_SERVER["REQUEST_METHOD"] == "OPTIONS"){
        http_response_code(200);
        exit;
    }

    // IF METHOD IS PUT
    if ($_SERVER["REQUEST_METHOD"] == "PUT"){
        $headers = apache_request_headers();
        $check_auth = new CheckAuth($conn, $headers);
        $auth = $check_auth->isValid();

        if($auth['success'] == 1){
            // Checks if all the fields is set and filled up
            if (
                !isset($data->id)
                || !isset($data->user_id)
                || !isset($data->title)
                || !isset($data->content)
                || empty(trim($data->id))
                || empty(trim($data->user_id))
                || empty(trim($data->title))
                || empty(trim($data->content))
            ){
                $fields = ['fields' => ['title', 'content']];
                http_response_code(400);
                $returnData = msg(0,400,'Please Fill in all Required Fields!',$fields);
            }

            else{
                try{
                    $obj->id = $data->id;
                    $obj->user_id = $data->user_id;
                    $obj->title = $data->title;
                    $obj->content = $data->content;
                    $obj->updatePost();

                    http_response_code(201);
                    $returnData = msg(1, 201, 'Post succesfuly updated');
                }
                catch (PDOException $e) {
                    http_response_code(500);
                    $returnData = msg(0, 500, $e->getMessage());
                }
            }
        }
        else{
            http_response_code(401);
            $returnData = msg(0, 401, 'Authentication Failed');
            echo json_encode($returnData);
        }
    }
    else{
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
    }
    echo json_encode($returnData);


?>
                        `}</code>
                    </pre>
                    <h1><code class="inside">Delete post Endpoint</code></h1>
                    <pre>
                        <code>{
                            `
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: DELETE, OPTIONS");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/config/Database.php';
    require __DIR__ . '/classes/Post.php';
    require __DIR__ . '/accounts/CheckAuth.php';

    function msg($success, $status, $message, $extra = []){
        return array_merge([
            'success' => $success,
            'status' => $status,
            'message' => $message
        ], $extra);
    }

    $database = new Database();
    $conn = $database->getConnection();
    $obj = new Post($conn);


    // DATA FORM REQUEST
    $data = json_decode(file_get_contents("php://input"));
    $returnData = [];

    // For CROSS-ORGIN RESOURCE SHARING(CORS) PREFILIGHT
    if($_SERVER["REQUEST_METHOD"] == "OPTIONS"){
        http_response_code(200);
        exit;
    }

    // IF METHOD IS DELETE
    if ($_SERVER["REQUEST_METHOD"] == "DELETE"){
        $headers = apache_request_headers();
        $check_auth = new CheckAuth($conn, $headers);
        $auth = $check_auth->isValid();

        if($auth['success'] == 1){
            $obj->id = $data->id;
            $obj->user_id = $data->user_id;

            try{
                $obj->deletePost();

                http_response_code(200);
                $returnData = msg(1, 200, 'Post succesfuly deleted');
            }
            catch (PDOException $e) {
                http_response_code(500);
                $returnData = msg(0, 500, $e->getMessage());
            }
        }
        else{
            http_response_code(401);
            $returnData = msg(0, 401, 'Authentication Failed');
            echo json_encode($returnData);
        }


    }
    // IF METHOD IS NOT DELETE
    else{
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
    }
    echo json_encode($returnData);


?>

            `}</code>
                    </pre>

                </div>

            </div>

        </div>
    )
}

export default Docu;
