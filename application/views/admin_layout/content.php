<?php
switch ($page) {
  case "category":
    include('contents/category/list.php');
    break;
  case "category_add":
    include('contents/category/add.php');
    break;
  case "category_edit":
    include('contents/category/edit.php');
    break;   
  case "preset":
    include('contents/preset/list.php');
    break;
  case "preset_add":
    include('contents/preset/add.php');
    break;
  case "preset_edit":
    include('contents/preset/edit.php');
    break;       
  case "changePassword":
    include('contents/password.php');
    break;
       
}
?>