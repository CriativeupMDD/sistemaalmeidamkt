<?php
class AuthController extends Controller
{
    public function showLogin()
    {
        $this->view('auth/login');
    }

    public function login()
    {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        if (Auth::attempt($email, $password)) {
            header('Location: /admin');
            exit;
        }
        $this->view('auth/login', ['error' => 'Credenciais inválidas']);
    }

    public function logout()
    {
        Auth::logout();
        header('Location: /');
        exit;
    }
}
