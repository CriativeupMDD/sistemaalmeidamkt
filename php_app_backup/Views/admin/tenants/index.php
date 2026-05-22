<div class="row">
  <div class="col-12">
    <h2>Clínicas</h2>
    <a class="btn btn-success mb-2" href="#">Nova Clínica</a>
    <table class="table table-striped">
      <thead><tr><th>ID</th><th>Nome</th><th>Slug</th><th>Status</th></tr></thead>
      <tbody>
      <?php foreach (($tenants ?? []) as $t): ?>
        <tr>
          <td><?= $t['id'] ?></td>
          <td><?= htmlspecialchars($t['name']) ?></td>
          <td><?= htmlspecialchars($t['slug']) ?></td>
          <td><?= htmlspecialchars($t['status']) ?></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>
