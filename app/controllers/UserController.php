<?php
namespace app\controllers;

use app\core\Request;
use app\core\Response;
use app\models\User;

class UserController
{
    private $userModel;
    private $response;

    public function __construct()
    {
        $this->userModel = new User();
        $this->response = new Response();
    }

    // POST /api/users – регистрация нового пользователя
    public function store(Request $request)
    {
        $data = $request->getBody();
        $errors = $this->validate($data, 'create');

        if (!empty($errors)) {
            return $this->handleError($request, $errors);
        }

        // Проверяем, не занят ли email
        if ($this->userModel->findByLogin($data['email'])) {
            $errors['email'] = 'Этот email уже зарегистрирован';
            return $this->handleError($request, $errors);
        }

        // Генерируем пароль
        $password = $this->userModel->generatePassword();
        $userId = $this->userModel->create(
            $data['email'],
            $password,
            $data['name'],
            $data['message']
        );

        // Создаём сессию (автоматический вход)
        session_start();
        $_SESSION['user_id'] = $userId;

        // Возвращаем логин и пароль
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
            // Fallback: показываем страницу с результатом
            $this->response->html('message', [
                'title' => 'Регистрация успешна!',
                'message' => "Ваш логин: {$data['email']}<br>Ваш пароль: $password<br>ID: $userId"
            ]);
        }
    }

    // PUT /api/users/{id} – обновление данных авторизованного пользователя
    public function update(Request $request, $params)
    {
        $id = $params['id'] ?? null;
        if (!$id) {
            return $this->handleError($request, ['general' => 'ID пользователя не указан']);
        }

        // Проверка авторизации
        session_start();
        if (!isset($_SESSION['user_id']) || $_SESSION['user_id'] != $id) {
            return $this->handleError($request, ['auth' => 'Вы не авторизованы или не имеете прав'], 403);
        }

        $data = $request->getBody();
        $errors = $this->validate($data, 'update');

        if (!empty($errors)) {
            return $this->handleError($request, $errors);
        }

        // Обновляем только name и message
        $updated = $this->userModel->update($id, $data['name'], $data['message']);

        if ($updated) {
            $result = ['success' => true, 'message' => 'Данные обновлены'];
        } else {
            $result = ['success' => false, 'message' => 'Ошибка обновления'];
        }

        if ($request->isAjax() || $request->isJson()) {
            $this->response->json($result, 200);
        } else {
            // Fallback
            $this->response->html('message', [
                'title' => 'Обновление',
                'message' => $result['message']
            ]);
        }
    }

    // Валидация данных
    private function validate($data, $action)
    {
        $errors = [];

        if (empty($data['name']) || strlen($data['name']) < 2) {
            $errors['name'] = 'Имя должно содержать минимум 2 символа';
        }

        if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Введите корректный email';
        }

        if ($action === 'create') {
            // При регистрации поле message не обязательно
            if (empty($data['message'])) {
                $data['message'] = ''; // или можно сделать обязательным, но по заданию не требуется
            }
        }

        return $errors;
    }

    // Обработка ошибок (отдаём JSON или HTML)
    private function handleError($request, $errors, $status = 400)
    {
        if ($request->isAjax() || $request->isJson()) {
            $this->response->json(['success' => false, 'errors' => $errors], $status);
        } else {
            // Для fallback показываем ту же страницу с ошибками (можно переделать под ваши нужды)
            $this->response->html('message', [
                'title' => 'Ошибка валидации',
                'message' => implode('<br>', $errors)
            ]);
        }
    }
}
