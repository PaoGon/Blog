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
