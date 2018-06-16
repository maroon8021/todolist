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
}catch (PDOException $e){
    print('Error:'.$e->getMessage());
    die();
}

$postedData='';
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $updateId = array_key_exists('updateid', $_POST) ? $_POST['updateid'] : null;

    $isFiniched = array_key_exists('isfiniched', $_POST) ? (bool)$_POST['isfiniched'] : '';
    $updateContent = array_key_exists('updateContent', $_POST) ? $_POST['updateContent'] : '';
    print('START <br />');
    print($updateId);
    print('<br />');
    print($isFiniched);
    print($_POST['isfiniched']);
    print('<br />');
    print($updateContent);
    print('<br />');
    if(!is_null($isFiniched)){
        //$sql = 'UPDATE todo set isfiniched = TRUE where todoid = 13';
        $sql = 'UPDATE todo set isfinished = :is_finished where todoid = :update_id';
    }else if(!is_null($updateContent)){
        $sql = 'UPDATE todo set title = :updateContent where todoid = :update_id';
    }
    //$sql = 'UPDATE todo set isfiniched = true where todoid = 13';
    print($sql);
    print('<br />');
    $stmt = $dbh->prepare($sql); // $dbh already has staff
    //$stmt->bindValue(':update_id', '13', PDO::PARAM_STR);
    $stmt->bindValue(':update_id', $updateId, PDO::PARAM_STR);
    //$stmt->bindValue(':is_finished', '1', PDO::PARAM_STR);
    $stmt->bindValue(':is_finished', $isFiniched, PDO::PARAM_BOOL);
    //$stmt->bindValue(':updateContent', $updateContent, PDO::PARAM_STR);
    $returnState = $stmt->execute();
    print($returnState);
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