<?php
namespace app\controllers;

use app\core\Request;
use app\core\Response;
use app\models\User;

class UserController {
    private $userModel;
    private $response;

    public function __construct() {
        $this->userModel = new User();
        $this->response = new Response();
    }

    public function store(Request $request) {
        $data = $request->getBody();
        $errors = $this->validate($data, 'create');

        if (!empty($errors)) {
            return $this->handleError($request, $errors);
        }

        if ($this->userModel->findByLogin($data['email'])) {
            $errors['email'] = 'Этот email уже зарегистрирован';
            return $this->handleError($request, $errors);
        }

        $password = $this->userModel->generatePassword();
        $userId = $this->userModel->create(
            $data['email'],
            $password,
            $data['name'],
            $data['message']
        );

        $_SESSION['user_id'] = $userId;

        $result = [
            'success' => true,
            'id' => $userId,
            'login' => $data['email'],
            'password' => $password,
            'profile_url' => '/profile/' . $userId
        ];

        if ($request->isAjax() || $request->isJson()) {
            $this->response->json($result, 201);
        } else {
            $this->response->html('message', [
                'title' => 'Регистрация успешна!',
                'message' => "Ваш логин: {$data['email']}<br>Ваш пароль: $password<br>ID: $userId"
            ]);
        }
    }

    public function update(Request $request, $params) {
        $id = $params['id'] ?? null;
        if (!$id) {
            return $this->handleError($request, ['general' => 'ID пользователя не указан']);
        }

        if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] != $id) {
            return $this->handleError($request, ['auth' => 'Вы не авторизованы или не имеете прав'], 403);
        }

        $data = $request->getBody();
        $errors = $this->validate($data, 'update');

        if (!empty($errors)) {
            return $this->handleError($request, $errors);
        }

        $updated = $this->userModel->update($id, $data['name'], $data['message']);

        if ($updated) {
            $result = ['success' => true, 'message' => 'Данные обновлены'];
        } else {
            $result = ['success' => false, 'message' => 'Ошибка обновления'];
        }

        if ($request->isAjax() || $request->isJson()) {
            $this->response->json($result, 200);
        } else {
            $this->response->html('message', [
                'title' => 'Обновление',
                'message' => $result['message']
            ]);
        }
    }

    private function validate($data, $action) {
        $errors = [];

        if (empty($data['name']) || strlen($data['name']) < 2) {
            $errors['name'] = 'Имя должно содержать минимум 2 символа';
        }

        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Введите корректный email';
        }

        if ($action === 'create') {
            if (empty($data['message'])) {
                $data['message'] = '';
            }
        }

        return $errors;
    }

    private function handleError($request, $errors, $status = 400) {
        if ($request->isAjax() || $request->isJson()) {
            $this->response->json(['success' => false, 'errors' => $errors], $status);
        } else {
            $this->response->html('message', [
                'title' => 'Ошибка валидации',
                'message' => implode('<br>', $errors)
            ]);
        }
    }

    public function login(Request $request) {
        $data = $request->getBody();
        $errors = [];

        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Введите корректный email';
        }
        if (empty($data['password'])) {
            $errors['password'] = 'Введите пароль';
        }

        if (!empty($errors)) {
            return $this->handleError($request, $errors);
        }

        $user = $this->userModel->findByLogin($data['email']);
        if (!$user) {
            return $this->handleError($request, ['email' => 'Пользователь с таким email не найден']);
        }

        if (!password_verify($data['password'], $user['password'])) {
            return $this->handleError($request, ['password' => 'Неверный пароль']);
        }

        $_SESSION['user_id'] = $user['id'];

        $result = [
            'success' => true,
            'id' => $user['id'],
            'login' => $user['login'],
            'profile_url' => '/profile/' . $user['id']
        ];

        if ($request->isAjax() || $request->isJson()) {
            $this->response->json($result, 200);
        } else {
            $this->response->html('message', [
                'title' => 'Вход выполнен',
                'message' => "Добро пожаловать, {$user['name']}!"
            ]);
        }
    }
}