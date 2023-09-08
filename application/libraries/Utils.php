<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Utils
{
    public function redirectPage($pageName)
    {
        redirect(base_url() . $pageName);
    }

    public function isEmptyPost($fields)
    {
        $error = false;
        foreach ($fields as $field) {
            if (empty($_POST[$field])) {
                $error = true;
            }
        }
        return $error;
    }

    public function inflatePost($fields)
    {
        $result = array();
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                $result[$field] = $_POST[$field];
            } else {
                $result[$field] = array();
            }
        }
        return $result;
    }

    public function getRoleName($role)
    {
        $roleNames = array("Admin", "Content Manager", "Content Creator", "Shop Online");
        return $roleNames[$role];
    }

    public function startsWith($string, $startString)
    {
        $len = strlen($startString);
        return substr($string, 0, $len) === $startString;
    }

    public function makeURL($string, $separator = '-')
    {
        $accents_regex = '~&([a-z]{1,2})(?:acute|cedil|circ|grave|lig|orn|ring|slash|th|tilde|uml);~i';
        $special_cases = array('&' => 'and', "'" => '-');
        $string = mb_strtolower(trim($string), 'UTF-8');
        $string = str_replace(array_keys($special_cases), array_values($special_cases), $string);
        $string = preg_replace($accents_regex, '$1', htmlentities($string, ENT_QUOTES, 'UTF-8'));
        $string = preg_replace("/[^a-z0-9]/u", "$separator", $string);
        $string = preg_replace("/[$separator]+/u", "$separator", $string);
        return $string;
    }

    public function deleteFile($filename)
    {
        if (file_exists($filename)) {
            unlink($filename);
        }
    }

    public function imageFixOrientation($filename)
    {
        $exif = @exif_read_data($filename);
        if (!empty($exif['Orientation'])) {
            $image = imagecreatefromjpeg($filename);
            switch ($exif['Orientation']) {
                case 3:
                    $image = imagerotate($image, 180, 0);
                    break;

                case 6:
                    $image = imagerotate($image, -90, 0);
                    break;

                case 8:
                    $image = imagerotate($image, 90, 0);
                    break;
            }

            imagejpeg($image, $filename, 90);
        }
    }

    public function deleteDirectory($dir)
    {
        if (!file_exists($dir)) {
            return true;
        }

        if (!is_dir($dir)) {
            return unlink($dir);
        }

        foreach (scandir($dir) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }

            if (!$this->deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
                return false;
            }

        }
        return rmdir($dir);

    }

    public function shortNumber($n)
    {
        if ($n < 1000) {
            // Anything less than a million
            $n_format = number_format($n);
        } else if ($n < 1000000) {
            // Anything less than a million
            $n_format = number_format($n / 1000, 1) . 'K';
        } else if ($n < 1000000000) {
            // Anything less than a billion
            $n_format = number_format($n / 1000000, 1) . 'M';
        } else {
            // At least a billion
            $n_format = number_format($n / 1000000000, 1) . 'B';
        }
        return $n_format;
    }

    public function cookTime($value)
    {
        $time = "";

        $mins = $value % 60;
        $hour = (int) ($value / 60);
        $time = $mins . " mins";
        if ($hour > 0) {
            $time = $hour . " hours " . $mins;
        }
        return $time;
    }

    public function cookTimeLabel($key)
    {
        switch ($key) {
            case "pre":
                return "Prepare Time:";
            case "cook":
                return "Cook Time:";
            case "rest":
                return "Rest Time:";
            case "refr":
                return "Refrigerate Time:";
            case "total":
                return "Total Time:";
            case "serving":
                return "Servings:";
        }
    }


    public function nutritionValue($key, $value)
    {
        switch ($key) {
            case "calories":
                return $value;
            case "carbohydrateContent":
            case "fiberContent":
            case "sugarContent":
            case "proteinContent":
            case "fatContent":
            case "saturatedFatContent":
                return $value . "g";
            case "cholesterolContent":
            case "sodiumContent":
                return $value . "mg";
        }
    }
    public function nutritionLabel($key)
    {
        switch ($key) {
            case "calories":
                return "Calories:";
            case "carbohydrateContent":
                return "Carbohydrate:";
            case "cholesterolContent":
                return "Cholesterol:";
            case "fiberContent":
                return "Dietary Fiber:";
            case "proteinContent":
                return "Protein:";
            case "saturatedFatContent":
                return "Saturated Fat:";
            case "sodiumContent":
                return "Sodium:";
            case "fatContent":
                return "Total Fat:";
            case "sugarContent":
                return "Total Sugars:";
        }
    }

    public function convertWebpToPng($webpPath, $pngPath)
    {
        $im = imagecreatefromwebp($webpPath);
        // Convert it to a jpeg file with 100% quality
        imagepng($im, $pngPath, 100);
        imagedestroy($im);
    }

    public function createThumbImage($source_image_path, $thumbnail_image_path, $desired_width, $desired_height)
    {
        list($source_image_width, $source_image_height, $source_image_type) = getimagesize($source_image_path);
        switch ($source_image_type) {
            case IMAGETYPE_GIF:
                $source_gd_image = imagecreatefromgif($source_image_path);
                break;
            case IMAGETYPE_JPEG:
                $source_gd_image = imagecreatefromjpeg($source_image_path);
                break;
            case IMAGETYPE_PNG:
                $source_gd_image = imagecreatefrompng($source_image_path);
                break;
            case IMAGETYPE_WEBP:
                $source_gd_image = imagecreatefromwebp($source_image_path);
                break;
        }
        if ($source_gd_image === false) {
            return false;
        }
        $source_aspect_ratio = $source_image_width / $source_image_height;
        $desired_height = (int) ($desired_width / $source_aspect_ratio);
        $thumbnail_gd_image = imagecreatetruecolor($desired_width, $desired_height);
        imagecopyresampled($thumbnail_gd_image, $source_gd_image, 0, 0, 0, 0, $desired_width, $desired_height, $source_image_width, $source_image_height);

        $img_disp = imagecreatetruecolor($desired_width, $desired_height);
        $backcolor = imagecolorallocate($img_disp, 255, 255, 255);
        imagefill($img_disp, 0, 0, $backcolor);

        imagecopy($img_disp, $thumbnail_gd_image, (imagesx($img_disp) / 2) - (imagesx($thumbnail_gd_image) / 2), (imagesy($img_disp) / 2) - (imagesy($thumbnail_gd_image) / 2), 0, 0, imagesx($thumbnail_gd_image), imagesy($thumbnail_gd_image));

        imagejpeg($img_disp, $thumbnail_image_path, 90);
        imagedestroy($source_gd_image);
        imagedestroy($thumbnail_gd_image);
        imagedestroy($img_disp);
        return true;
    }

    public function formatMin($v)
    {
        $output = str_replace("PT", "", $v);
        $output = str_replace("M", "", $output);
        return $output;
    }

    public function formatIngredient($v)
    {
        $html = "";
        $data = json_decode($v);
        if (count($data) > 0) {
            $html = "<ul>";
            foreach ($data as $dt) {
                $html = $html . "<li>" . $dt . "</li>";
            }
            $html = $html . "</ul>";
        }
        return $html;
    }

    public function formatDirection($v)
    {
        $html = "";
        $data = json_decode($v);
        for ($i = 0; $i < count($data); $i++) {
            $dt = $data[$i];
            if (isset($dt->text)) {
                $html = $html . "<p><b>Step" . ($i + 1) . "</b></p>";
                $html = $html . "<p style=\"margin-left: 25px;\">" . $dt->text . "</p>";
            }
        }
        return $html;
    }

    public function downloadImageURL($path, $url)
    {
        $ch = curl_init($url);
        $fp = fopen($path, 'wb');
        curl_setopt($ch, CURLOPT_FILE, $fp);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_exec($ch);
        curl_close($ch);
        fclose($fp);
    }
}