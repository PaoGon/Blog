<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '/config/Database.php';
    require __DIR__ . '/classes/Post.php';
    
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
    $obj->id = (int)$_GET['id'];
    $obj->user_id = (int)$_GET['user_id'];

    $stmt = $obj->getSinglePost();

    if($_SERVER["REQUEST_METHOD"] != "GET"){
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
    }
    else{
        try{
            //echo json_encode(array('id'=> $id, 'user_id' => $user_id));
            //echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        
            //echo json_encode($stmt);
            if($stmt->rowCount()){
                $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

                http_response_code(200);
                $returnData = [
                    'success' => 1,
                    'message' => 'Success',
                    'data' => $data
                ];
            }
            else{
                http_response_code(400);
                $returnData = msg(0,400, 'Post does not exist');
            }
        }
        catch(PDOException $e){
            echo json_encode($e);
            
        }
    }
    echo json_encode($returnData);

?>
