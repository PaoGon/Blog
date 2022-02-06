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
                $fetch_user_by_id = "SELECT name, email FROM users WHERE id=:id";
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
