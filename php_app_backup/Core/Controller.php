<?php
class Controller
{
    protected function view(string $path, array $data = [])
    {
        extract($data);
        $file = BASE_PATH . '/app/Views/' . $path . '.php';
        if (file_exists($file)) {
            require $file;
        } else {
            echo "View not found: $file";
        }
    }
}
