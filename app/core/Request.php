<?php
namespace app\core;

class Request
{
    public function getMethod()
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public function getUri()
    {
        return parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    }

    public function getBody()
    {
        $body = [];
        if ($this->getMethod() === 'GET') {
            $body = $_GET;
        } else {
            $input = file_get_contents('php://input');
            if ($this->isJson()) {
                $body = json_decode($input, true) ?? [];
            } else {
                $body = $_POST;
            }
        }
        return $body;
    }

    public function isJson()
    {
        return isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;
    }

    public function isAjax()
    {
        return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest';
    }

    public function getParam($key, $default = null)
    {
        return $_GET[$key] ?? $default;
    }
}
