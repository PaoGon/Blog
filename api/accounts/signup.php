<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: POST");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    require __DIR__ . '../config/Database.php';

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

    if ($_SERVER["REQUEST_METHOD"] != "POST"){
        http_response_code(405);
        $returnData = msg(0, 405, 'Method not allowed!');
    }
    elseif (
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
    // IF THERE ARE NO EMPTY FIELDS THEN-
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

    echo json_encode($returnData);
?>
