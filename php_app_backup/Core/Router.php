<?php
class Router
{
    protected static array $routes = [];

    public static function get(string $path, $handler)
    {
        self::$routes['GET'][$path] = $handler;
    }

    public static function post(string $path, $handler)
    {
        self::$routes['POST'][$path] = $handler;
    }

    public static function dispatch(string $uri, string $method)
    {
        $uri = parse_url($uri, PHP_URL_PATH);
        $uri = rtrim($uri, '/');
        if ($uri === '') $uri = '/';

        $routes = self::$routes[$method] ?? [];

        // Direct match
        if (isset($routes[$uri])) {
            return self::runHandler($routes[$uri]);
        }

        // Try simple parameterized routes like /admin/tenants
        foreach ($routes as $route => $handler) {
            $pattern = preg_replace('#\/:([a-zA-Z0-9_]+)#', '\\/([^/]+)', $route);
            $pattern = '#^' . $pattern . '$#';
            if (preg_match($pattern, $uri, $matches)) {
                array_shift($matches);
                return self::runHandler($handler, $matches);
            }
        }

        http_response_code(404);
        echo "404 Not Found";
    }

    protected static function runHandler($handler, $params = [])
    {
        if (is_callable($handler)) {
            return call_user_func_array($handler, $params);
        }
        if (is_array($handler) && count($handler) === 2) {
            [$class, $method] = $handler;
            if (!class_exists($class)) {
                // try to include controller file
                $file = BASE_PATH . '/app/Controllers/' . basename($class) . '.php';
                if (file_exists($file)) require_once $file;
            }
            $obj = new $class();
            return call_user_func_array([$obj, $method], $params);
        }
        throw new Exception('Invalid route handler');
    }
}
