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
