<?php
namespace app\models;

use app\core\Database;

class User
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance()->getConnection();
    }

    public function create($login, $password, $name, $message)
    {
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("INSERT INTO users (login, password, name, message) VALUES (?, ?, ?, ?)");
        $stmt->execute([$login, $hashed, $name, $message]);
        return $this->db->lastInsertId();
    }

    public function findById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function findByLogin($login)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE login = ?");
        $stmt->execute([$login]);
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function update($id, $name, $message)
    {
        $stmt = $this->db->prepare("UPDATE users SET name = ?, message = ? WHERE id = ?");
        return $stmt->execute([$name, $message, $id]);
    }

    // Генерация случайного пароля
    public function generatePassword($length = 8)
    {
        return substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, $length);
    }
}
