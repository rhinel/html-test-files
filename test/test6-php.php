<?php      
$back=array();
$back[0]=$_GET['name'];
$back[1]=$_GET['day'];
echo json_encode($back);
?>