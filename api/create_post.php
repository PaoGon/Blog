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
