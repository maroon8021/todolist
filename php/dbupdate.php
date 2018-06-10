<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>DB接続テスト</title>
</head>
<body>

<?php
define('DB_HOST', 'localhost'); //定数化

$dsn = 'mysql:dbname=todolist;host='.DB_HOST.';charset=utf8mb4'; //utf8の指定が必要
$user = 'root';
$password = 'root';

$dbh;
try{
    $dbh = new PDO($dsn, $user, $password);
    $dbh_json = $dbh;

    $sql = 'select * from todo';
    $sql_json = $sql;
    foreach ($dbh->query($sql) as $row) {
        print($row['todoid'].',');
        print($row['title']);
        print('<br />');
    }
}catch (PDOException $e){
    print('Error:'.$e->getMessage());
    die();
}

$postedData='';
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $updateId = $_POST['updateid'];
    $isFiniched = $_POST['isfiniched'];
    $updateContent = $_POST['updateContent'];
    print($updateId);
    print($isFiniched);
    print($updateContent);
    if(!is_null($isFiniched)){
        $sql = 'UPDATE todo set isfiniched = :is_finished where todoid = :update_id';
    }else if(!is_null($updateContent)){
        $sql = 'UPDATE todo set title = :updateContent where todoid = :update_id';
    }
    print($sql);
    $stmt = $dbh->prepare($sql); // $dbh already has staff
    //$stmt->bindParam(':name', $name, PDO::PARAM_STR);
    //$stmt->bindValue(':value', 1, PDO::PARAM_INT);
    $stmt->bindValue(':update_id', $updateId, PDO::PARAM_INT);
    $stmt->bindValue(':is_finished', $postedContent, PDO::PARAM_BOOL);
    $stmt->bindValue(':updateContent', $updateContent, PDO::PARAM_STR);
    $stmt->execute();
  }

  // ステータスコードを出力
//http_response_code( 301 ) ;

// リダイレクト
//header( "Location:".$pathDate ) ;

$dbh = null;

$dbh_json = json_encode($dbh_json);
$sql_json = json_encode($sql_json);

?>

<script type="text/javascript">
    var dbh = JSON.parse('<?php echo $dbh_json; ?>');
    var sql = JSON.parse('<?php echo $sql_json; ?>');
    console.log(dbh);
    console.log(sql);
</script>

</body>
</html>