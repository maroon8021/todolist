<?php

define('DB_HOST', 'localhost'); //定数化

$dsn = 'mysql:dbname=staff;host='.DB_HOST.';charset=utf8mb4'; //utf8の指定が必要
$user = 'root';
$password = 'root';

$dbh_json;
$sql_json;
$dbh;
try{
	$dbh = new PDO($dsn, $user, $password);
    $dbh_json = $dbh;

    $sql = 'select * from staffname';
    $sql_json = $sql;
    foreach ($dbh->query($sql) as $row) {
        print($row['id'].',');
        print($row['name']);
        print('<br />');
    }
}catch (PDOException $e){
    print('Error:'.$e->getMessage());
    die();
}


$postedData='';
$pathDate;
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $postedData = $_POST['comment'];
    $pathDate = $_POST['url'];
    $stmt = $dbh->prepare("INSERT INTO staffname (name) VALUES (:value)"); // $dbh already has staff
    //$stmt->bindParam(':name', $name, PDO::PARAM_STR);
    //$stmt->bindValue(':value', 1, PDO::PARAM_INT);
    $stmt->bindValue(':value', $postedData, PDO::PARAM_STR);
    $stmt->execute();
  }


$myPath = __FILE__;
$basename = pathinfo($myPath, PATHINFO_BASENAME);
$basename_json = json_encode($basename);

// ステータスコードを出力
http_response_code( 301 ) ;

// リダイレクト
header( "Location:".$pathDate ) ;
exit ;

?>

<script type="text/javascript">
    var serverRequest = JSON.parse('<?php echo $serverRequest_json; ?>');
    console.log(serverRequest);

    var postedData = JSON.parse('<?php echo $postedData_json; ?>');
    console.log("$postedData : "+postedData);
</script>