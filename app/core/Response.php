<?php
namespace app\core;

class Response
{
    public function json($data, $status = 200)
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public function html($view, $data = [])
    {
        extract($data);
        ob_start();
        include __DIR__ . "/../views/{$view}.php";
        echo ob_get_clean();
        exit;
    }

    public function redirect($url)
    {
        header("Location: $url");
        exit;
    }
}
