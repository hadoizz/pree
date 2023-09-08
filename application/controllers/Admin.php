<?php

defined('BASEPATH') or exit('No direct script access allowed');
require 'Base.php';

class Admin extends Base
{

    public function __construct()
    {
        parent::__construct();
    }
    
    public function index()
    {
        //echo $_SERVER["DOCUMENT_ROOT"];
        if ($this->isLogin()) {
            redirect(base_url() . "index.php/Admin/category");
        } else {
            $this->load->view('admin_login');
        }
    }

    public function actionLogout()
    {
        $this->session->set_userdata(array("user" => NULL));
        redirect("/");
    }

    public function changePassword()
    {
        if ($this->isLogin() == 0) {
            redirect(base_url());
            return;
        }
        $data = $this->getBaseViewData();
        $data["page"] = "changePassword";
        $this->load->view('admin_home', $data);
        return;
    }

    public function actionLogin()
    {
        if ($this->utils->isEmptyPost(array('email', 'password'))) {
            $this->load->view('login', array("errorMsg" => "Wrong e-mail or password"));
            return;
        }
        $postVars = $this->utils->inflatePost(array('email', 'password'));

        $user = $this->sqllibs->getOneRow($this->db, "admin", array('username' => $postVars['email']));

        if ($user == NULL) {
            $this->load->view('admin_login', array("errorMsg" => "Wrong username or password"));
            return;
        }

        if ($postVars['password'] == $user->password) {

            $this->session->set_userdata(array("user" => $user));
            redirect(base_url() . "index.php/Admin/category");
            return;
        }
        $this->load->view('admin_login', array("errorMsg" => "Wrong username or password"));
        return;
    }    

    public function category()
    {
        if ($this->isLogin() == 0) {
            redirect(base_url());
            return;
        }
        $data = $this->getBaseViewData();
        $categories = $this->sqllibs->rawSelectSql($this->db, "SELECT * FROM category");
        $data["datas"] = $categories;
        $data["page"] = "category";
        $this->load->view('admin_home', $data);
    }

    public function presets() {
        if ($this->isLogin() == 0) {
            redirect(base_url());
            return;
        }
        $data = $this->getBaseViewData();
        $presets = $this->sqllibs->rawSelectSql($this->db, "SELECT * FROM preset");
        $data["datas"] = $presets;
        $data['categorys'] = $this->sqllibs->selectAllRows($this->db, "category");
        $data["page"] = "preset";
        $this->load->view('admin_home', $data);
    }
        
    public function categoryAdd()
    {
        if ($this->isLogin() == 0) {
            redirect(base_url());
            return;
        }
        $data = $this->getBaseViewData();
        $data["page"] = "category_add";
        $this->load->view('admin_home', $data);
    }

    public function presetAdd()
    {
        if ($this->isLogin() == 0) {
            redirect(base_url());
            return;
        }
        $data = $this->getBaseViewData();
        $data['categorys'] = $this->sqllibs->selectAllRows($this->db, "category");
        $data["page"] = "preset_add";
        $this->load->view('admin_home', $data);
    }

    public function presetEdit($id)
    {
        if ($this->isLogin() == 0) {
            redirect(base_url());
            return;
        }
        $data = $this->getBaseViewData();
        $data['categorys'] = $this->sqllibs->selectAllRows($this->db, "category");
        $data["info"] = $this->sqllibs->getOneRow($this->db, 'preset', array('id' => $id));
        $data["page"] = "preset_edit";
        $this->load->view('admin_home', $data);
    }

    public function categoryEdit($id) 
    {
        if ($this->isLogin() == 0) {
            redirect(base_url());
            return;
        }
        $data = $this->getBaseViewData();
        $data["info"] = $this->sqllibs->getOneRow($this->db, 'category', array('id' => $id));
        $data["page"] = "category_edit";
        $this->load->view('admin_home', $data);
    }

    public function deleteCategory($id)
    {
        $info = $this->sqllibs->getOneRow($this->db, 'category', array('id' => $id));
        $src = dirname(__DIR__) . '/..'.$info->image;
        $this->utils->deleteFile($src);
        $this->sqllibs->deleteRow($this->db, "category", array('id' => $id));
        redirect(base_url() . "index.php/Admin/category");
    }

    public function deletePreset($id)
    {
        $info = $this->sqllibs->getOneRow($this->db, 'preset', array('id' => $id));
        $src = dirname(__DIR__) . '/..'.$info->image;
        $this->utils->deleteFile($src);
        $this->sqllibs->deleteRow($this->db, "preset", array('id' => $id));
        redirect(base_url() . "index.php/Admin/presets");
    }

}