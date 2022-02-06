<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/config/Database.php';
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

    if($_SERVER["REQUEST_METHOD"] != "GET"){
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
        echo json_encode($returnData);
    }
    else{
        $headers = apache_request_headers();
        $auth = new CheckAuth($conn, $headers);
        
        echo json_encode($auth->isValid());
    }
?>
