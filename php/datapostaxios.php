<?php

define('DB_HOST', 'localhost'); //定数化

$dsn = 'mysql:dbname=todolist;host='.DB_HOST.';charset=utf8mb4'; //utf8の指定が必要
$user = 'root';
$password = 'root';

$dbh_json;
$sql_json;
$dbh;
try{
	$dbh = new PDO($dsn, $user, $password);
    $dbh_json = $dbh;

    $sql = 'select * from todo';
    $sql_json = $sql;
    /*
    foreach ($dbh->query($sql) as $row) {
        print($row['todoid'].',');
        print($row['title']);
        print('<br />');
    }
    */
}catch (PDOException $e){
    print('Error:'.$e->getMessage());
    die();
}


$postedData='';
$pathDate;
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $postedData = $_POST['newtodo'];
    //$pathDate = $_POST['url'];
    $stmt = $dbh->prepare("INSERT INTO todo (title) VALUES (:value)"); // $dbh already has staff
    //$stmt->bindParam(':name', $name, PDO::PARAM_STR);
    //$stmt->bindValue(':value', 1, PDO::PARAM_INT);
    $stmt->bindValue(':value', $postedData, PDO::PARAM_STR);
    $stmt->execute();
  }


// ステータスコードを出力
//http_response_code( 301 ) ;

// リダイレクト
//header( "Location:".$pathDate ) ;
exit ;

?>

<!--
<script type="text/javascript">
    var serverRequest = JSON.parse('<?php echo $serverRequest_json; ?>');
    console.log(serverRequest);

    var postedData = JSON.parse('<?php echo $postedData_json; ?>');
    console.log("$postedData : "+postedData);
</script>

-->