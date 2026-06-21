<?php
// Автозагрузка классов (простой вариант)
spl_autoload_register(function ($class) {
    $prefix = 'app\\';
    $base_dir = __DIR__ . '/../app/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) require $file;
});

use app\core\Router;
use app\core\Request;
use app\controllers\UserController;

session_start(); // стартуем сессию для всех запросов

$router = new Router();
$request = new Request();

// Определяем маршруты
$router->add('POST', '/api/users', function($req) {
    $controller = new UserController();
    return $controller->store($req);
});

$router->add('PUT', '/api/users/{id}', function($req, $params) {
    $controller = new UserController();
    return $controller->update($req, $params);
});

// Для обратной совместимости: если приходит обычный POST без AJAX, 
// можно также направить на store (но это уже внутри контроллера обработано)
// Можно добавить GET для отображения формы (но она уже есть в index.html)

// Диспатч
$router->dispatch($request);
