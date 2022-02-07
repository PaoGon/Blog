<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: DELETE");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/config/Database.php';
    require __DIR__ . '/classes/Post.php';

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

    $obj->id = (int)$_REQUEST['id'];
    $obj->user_id = (int)$_REQUEST['user_id'];

    // DATA FORM REQUEST
    $data = json_decode(file_get_contents("php://input"));
    $returnData = [];

    if ($_SERVER["REQUEST_METHOD"] != "DELETE"){
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
    }
    // Checks if all the fields is set and filled up
    else{
        try{
            $obj->deletePost();

            http_response_code(201);
            $returnData = msg(1, 201, 'Post succesfuly deleted');
        }
        catch (PDOException $e) {
            http_response_code(500);
            $returnData = msg(0, 500, $e->getMessage());
        }

    }
    echo json_encode($returnData);


?>
