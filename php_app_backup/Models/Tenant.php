<?php
class Tenant extends Model
{
    protected string $table = 'tenants';

    public function all(): array
    {
        $stmt = $this->db->query('SELECT * FROM ' . $this->table . ' ORDER BY id DESC');
        return $stmt->fetchAll();
    }

    public function find(int $id)
    {
        $stmt = $this->db->prepare('SELECT * FROM ' . $this->table . ' WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
}
