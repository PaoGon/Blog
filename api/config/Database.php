<?php
    class Database{

        private $host = 'localhost';
        private $db_name = 'blog';
        private $user = 'gon';
        private $password = '#l03e1t3@_';

        public $conn;

        public function getConnection(){
            $this->conn = null;

            try{
                $this->conn = new PDO("pgsql:host=" . $this->host . ";port=5432;dbname=" . $this->db_name, $this->user, $this->password);
                $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
            }
            catch(PDOException $exception){
                echo "Database could not be connected: " . $exception->getMessage();
            }
            return $this->conn;

        }
    }
?>
