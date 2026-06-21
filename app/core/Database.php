<?php
namespace app\core;

class Database
{
    private static $instance = null;
    private $pdo;

    private function __construct()
    {
        require_once __DIR__ . '/../config/config.php';
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $this->pdo = new \PDO($dsn, DB_USER, DB_PASS);
        $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->pdo;
    }
}
