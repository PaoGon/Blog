<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/config/Database.php';
    require __DIR__ . '/classes/Post.php';
    //

    //require './config/Database.php';
    //require './classes/Post.php';
    
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

    if($_SERVER["REQUEST_METHOD"] != "GET"){
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
        echo json_encode($returnData);
    }
    else{
        try{
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
        catch(Exception $e){
            echo json_encode($e);
            
        }
    }
?>
