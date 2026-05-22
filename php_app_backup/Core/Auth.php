<?php
class Auth
{
    public static function attempt(string $email, string $password): bool
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'role' => $user['role'] ?? 'user',
                'tenant_id' => $user['tenant_id'] ?? null,
            ];
            return true;
        }
        return false;
    }

    public static function check(): bool
    {
        return !empty($_SESSION['user']);
    }

    public static function user(): ?array
    {
        return $_SESSION['user'] ?? null;
    }

    public static function logout()
    {
        unset($_SESSION['user']);
    }
}
