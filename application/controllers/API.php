<?php
defined('BASEPATH') or exit('No direct script access allowed');
require 'Base.php';

class API extends Base
{
    public function __construct()
    {
        parent::__construct();
        header('Content-Type: application/json');
    }

    public function sessionCheck()
    {
        return true;
    }

    public function error($code, $message = "")
    {
        echo json_encode(
            array(
                "code" => $code,
                "message" => $message
            )
        );
        return;
    }

    public function editCategory()
    {
        $name = $_POST["name"];
        $categoryID = $_POST["catId"];
        $premium = $_POST["premium"];
        $this->sqllibs->updateRow(
            $this->db,
            "category",
            array(
                "name" => $name,
                'is_free' => $premium == "true" ? 1 : 0,
            ),
            array(
                "id" => $categoryID
            )
        );
        if (isset($_FILES["thumbnail"]) && isset($_FILES["thumbnail"]["name"])) {
            $this->uploadThumbImage($categoryID, $_FILES["thumbnail"], "category");
        }
        $result["code"] = 200;
        echo json_encode($result);
    }

    public function editPreset()
    {
        $name = $_POST["name"];
        $usage = $_POST["usage"];
        $category = $_POST["category"];
        $feature = $_POST["feature"];
        $discover = $_POST["discover"];
        $premium = $_POST["premium"];
        $pId = $_POST["pid"];
        $this->sqllibs->updateRow(
            $this->db,
            "preset",
            array(
                'name' => mysqli_real_escape_string($this->db->conn_id, $name),
                'usg' => mysqli_real_escape_string($this->db->conn_id, $usage),
                'tg' => $premium == "true" ? 1 : 0,
                'featured' => $feature == "true" ? 1 : 0,
                'discovered' => $discover == "true" ? 1 : 0,
                'category' => $category,
            ),
            array(
                "id" => $pId
            )
        );
        if (isset($_FILES["thumbnail"]) && isset($_FILES["thumbnail"]["name"])) {
            $this->uploadThumbImage($pId, $_FILES["thumbnail"], "preset");
        }
        if (isset($_FILES["thumbnail1"]) && isset($_FILES["thumbnail1"]["name"])) {
            $this->uploadBeforeImage($pId, $_FILES["thumbnail1"], "preset");
        }

        if (isset($_FILES["thumbnail2"]) && isset($_FILES["thumbnail2"]["name"])) {
            $this->uploadDNG($pId, $_FILES["thumbnail2"], "preset");
        }
        $result["code"] = 200;
        echo json_encode($result);
    }

    public function createCategory()
    {
        $name = $_POST["name"];
        $premium = $_POST["premium"];
        $categoryID = $this->sqllibs->insertRow(
            $this->db,
            'category',
            array(
                'is_free' => $premium == "true" ? 1 : 0,
                'image' => '',
                'name' => mysqli_real_escape_string($this->db->conn_id, $name),
            )
        );
        if (isset($_FILES["thumbnail"]) && isset($_FILES["thumbnail"]["name"])) {
            $this->uploadThumbImage($categoryID, $_FILES["thumbnail"], "category");
        }
        $result["code"] = 200;
        echo json_encode($result);

    }

    public function createPreset()
    {
        $name = $_POST["name"];
        $usage = $_POST["usage"];
        $category = $_POST["category"];
        $feature = $_POST["feature"];
        $discover = $_POST["discover"];
        $premium = $_POST["premium"];
        $presetId = $this->sqllibs->insertRow(
            $this->db,
            'preset',
            array(
                'image' => '',
                'beforeimage' => '',
                'dng' => '',
                'name' => mysqli_real_escape_string($this->db->conn_id, $name),
                'usg' => mysqli_real_escape_string($this->db->conn_id, $usage),
                'tg' => $premium == "true" ? 1 : 0,
                'featured' => $feature == "true" ? 1 : 0,
                'discovered' => $discover == "true" ? 1 : 0,
                'category' => $category,
            )
        );
        if (isset($_FILES["thumbnail"]) && isset($_FILES["thumbnail"]["name"])) {
            $this->uploadThumbImage($presetId, $_FILES["thumbnail"], "preset");
        }

        if (isset($_FILES["thumbnail1"]) && isset($_FILES["thumbnail1"]["name"])) {
            $this->uploadBeforeImage($presetId, $_FILES["thumbnail1"], "preset");
        }

        if (isset($_FILES["thumbnail2"]) && isset($_FILES["thumbnail2"]["name"])) {
            $this->uploadDNG($presetId, $_FILES["thumbnail2"], "preset");
        }

        $result["code"] = 200;
        echo json_encode($result);
    }

    public function featured()
    {
        $datas = $this->sqllibs->selectAllRows($this->db, "preset", array('featured' => 1));
        echo json_encode($datas);
    }

    public function topFilter()
    {
        $datas = $this->sqllibs->selectAllRows($this->db, "preset", array('discovered' => 1));
        echo json_encode($datas);
    }

    public function category()
    {
        $categories = $this->sqllibs->rawSelectSql($this->db, "SELECT * FROM category order by is_free desc");
        echo json_encode($categories);
    }

    public function getCategoryPreset($cID)
    {
        $datas = $this->sqllibs->selectAllRows($this->db, "preset", array('category' => $cID));
        echo json_encode($datas);
    }


    public function actionChangePassword()
    {
        if ($this->isLogin() == 0) {
            redirect(base_url());
            return;
        }
        $oldPw = $_POST["oldPw"];
        $newPw = $_POST["newPw"];
        $rePw = $_POST["rePw"];

        $user = $this->sqllibs->getOneRow($this->db, "admin", array('id' => $this->session->user->id));

        if ($oldPw != $user->password) {
            return $this->error(401, "Old Password incorrect");
        }
        if ($newPw != $rePw) {
            return $this->error(402, "New passwords are not match");
        }
        $this->sqllibs->updateRow(
            $this->db,
            'admin',
            array(
                'password' => $newPw
            ),
            array('id' => $this->session->user->id)
        );
        $result["code"] = 200;
        echo json_encode($result);
    }


}