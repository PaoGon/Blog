<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: POST");
    header("Content-Type: application/json; charset=UTF-8");
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

    // IF REQUEST METHOD IS NOT EQUAL TO POST
    if($_SERVER["REQUEST_METHOD"] != "POST"){
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
    }

    // CHECKING EMPTY FIELDS
    elseif(!isset($data->email) 
        || !isset($data->password)
        || empty(trim($data->email))
        || empty(trim($data->password))
    ){
        $fields = ['fields' => ['email','password']];
        http_response_code(400);
        $returnData = msg(0,400,'Please Fill in all Required Fields!',$fields);
    }

    // IF THERE ARE NO EMPTY FIELDS THEN-
    else{
        $email = trim($data->email);
        $password = trim($data->password);

        // CHECKING THE EMAIL FORMAT (IF INVALID FORMAT)
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            http_response_code(401);
            $returnData = msg(0,401,'Invalid Email Address!');
        }
        
        // IF PASSWORD IS LESS THAN 8 THE SHOW THE ERROR
        elseif(strlen($password) < 8){
            http_response_code(401);
            $returnData = msg(0,401,'Your password must be at least 8 characters long!');
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
                            'http://blog.local/api', 
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
                        $returnData = msg(0,401,'Invalid Password!');
                    }
                }

                // IF THE USER EMAIL NOT FOUND THEN SHOW THE FOLLOWING ERROR 
                else{
                    $returnData = msg(0,422,'Invalid Email Address!');
                }
            }
            catch(PDOException $e){
                http_response_code(500);
                $returnData = msg(0,500,$e->getMessage());
            }
        }
    }
    echo json_encode($returnData);
?>
