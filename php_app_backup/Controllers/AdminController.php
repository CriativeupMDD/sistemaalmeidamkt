<?php
require_once BASE_PATH . '/app/Models/Tenant.php';

class AdminController extends Controller
{
    public function dashboard()
    {
        if (!Auth::check()) {
            header('Location: /admin/login');
            exit;
        }
        $this->view('layouts/admin_header', ['title' => 'Painel Master']);
        $this->view('admin/dashboard');
        $this->view('layouts/admin_footer');
    }

    public function tenants()
    {
        if (!Auth::check()) {
            header('Location: /admin/login');
            exit;
        }
        $tenantModel = new Tenant();
        $tenants = $tenantModel->all();
        $this->view('layouts/admin_header', ['title' => 'Clínicas']);
        $this->view('admin/tenants/index', ['tenants' => $tenants]);
        $this->view('layouts/admin_footer');
    }
}
