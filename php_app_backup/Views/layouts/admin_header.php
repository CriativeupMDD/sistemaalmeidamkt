<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title><?= htmlspecialchars($title ?? 'Admin') ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
<nav class="navbar navbar-expand bg-dark navbar-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/admin">SaaS Clínicas</a>
    <div class="d-flex">
      <?php if (Auth::check()): ?>
        <span class="navbar-text text-white me-2"><?= htmlspecialchars(Auth::user()['name'] ?? '') ?></span>
        <a class="btn btn-outline-light btn-sm" href="/admin/logout">Sair</a>
      <?php endif; ?>
    </div>
  </div>
</nav>
<div class="container mt-4">
