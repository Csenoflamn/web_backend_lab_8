<?php
namespace app\core;

class Router
{
    private $routes = [];

    public function add($method, $path, $handler)
    {
        $path = preg_replace('/\{([a-z]+)\}/', '(?P<$1>[0-9]+)', $path);
        $this->routes[] = [
            'method'  => strtoupper($method),
            'path'    => '#^' . $path . '$#',
            'handler' => $handler
        ];
    }

    public function dispatch(Request $request)
    {
        $uri = rtrim($request->getUri(), '/');
        $method = $request->getMethod();

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;
            if (preg_match($route['path'], $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                return call_user_func($route['handler'], $request, $params);
            }
        }

        // 404
        http_response_code(404);
        return ['error' => 'Not Found'];
    }
}
