<div class="row justify-content-center">
  <div class="col-md-4">
    <h3>Admin Login</h3>
    <?php if (!empty($error)): ?><div class="alert alert-danger"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <form method="post" action="/admin/login">
      <div class="mb-3">
        <label class="form-label">E-mail</label>
        <input name="email" type="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Senha</label>
        <input name="password" type="password" class="form-control" required>
      </div>
      <button class="btn btn-primary">Entrar</button>
    </form>
  </div>
</div>
