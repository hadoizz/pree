<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Base extends CI_Controller
{

    public $database;
    public $pageLimit = 10;
    public $thumbWidth = 300;
    public $thumbHeight = 300;


    public function __construct()
    {
        parent::__construct();

        $this->database = $this->load->database();
        $this->load->helper('url');
        $this->load->library('session');
        $this->load->library('sqllibs');
        $this->load->library('utils');
        $this->load->library('user_agent');
    }

    protected function getBaseViewData()
    {
        $data['user'] = $this->session->user;
        $data['error'] = $this->session->flashdata('errorMessage');
        $data['message'] = $this->session->flashdata('message');
        $this->session->set_flashdata('errorMessage', "");
        $this->session->set_flashdata('message', "");
        return $data;
    }

    public function isLogin()
    {
        if ($this->session->user == NULL) {
            return 0;
        } else {
            return 1;
        }
    }


    public function isMemberLogin()
    {
        if ($this->session->member == NULL) {
            return 0;
        } else {
            return 1;
        }
    }

    public function uploadBeforeImage($catID, $data, $prefix)
    {
        $file_name = $data["name"];
        $file_tmp = $data["tmp_name"];

        $ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $extension = array("jpeg", "jpg", "png", "gif", "JPEG", "JPG", "PNG", "GIF");
        if (!in_array($ext, $extension)) {
            return;
        }
        $newFileName = "s_b_" . $prefix . "_" . $catID . "." . strtolower($ext);
        $pathThumbFile = '/images/' . $prefix . '/' . $newFileName;

        $src = dirname(__DIR__) . '/../images/' . $prefix . '/' . $newFileName;
        $this->utils->deleteFile($src);
        move_uploaded_file($file_tmp, $src);

        $this->sqllibs->updateRow(
            $this->db,
            $prefix,
            array(
                "beforeimage	" => $pathThumbFile
            ),
            array(
                "id" => $catID
            )
        );

    }

    public function uploadDNG($catID, $data, $prefix)
    {
        $file_name = $data["name"];
        $file_tmp = $data["tmp_name"];

        $ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $extension = array("dng", "DNG");
        if (!in_array($ext, $extension)) {
            return;
        }
        $newFileName = "s_b_" . $prefix . "_" . $catID . "." . strtolower($ext);
        $pathThumbFile = '/images/' . $prefix . '/' . $newFileName;

        $src = dirname(__DIR__) . '/../images/' . $prefix . '/' . $newFileName;
        $this->utils->deleteFile($src);
        move_uploaded_file($file_tmp, $src);

        $this->sqllibs->updateRow(
            $this->db,
            $prefix,
            array(
                "dng" => $pathThumbFile
            ),
            array(
                "id" => $catID
            )
        );

    }

    public function uploadThumbImage($catID, $data, $prefix)
    {
        $file_name = $data["name"];
        $file_tmp = $data["tmp_name"];

        $ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $extension = array("jpeg", "jpg", "png", "gif", "JPEG", "JPG", "PNG", "GIF");
        if (!in_array($ext, $extension)) {
            return;
        }
        $newFileName = "s_" . $prefix . "_" . $catID . "." . strtolower($ext);
        $pathThumbFile = '/images/' . $prefix . '/' . $newFileName;

        $src = dirname(__DIR__) . '/../images/' . $prefix . '/' . $newFileName;
        $this->utils->deleteFile($src);
        move_uploaded_file($file_tmp, $src);

        $this->sqllibs->updateRow(
            $this->db,
            $prefix,
            array(
                "image	" => $pathThumbFile
            ),
            array(
                "id" => $catID
            )
        );

    }

}