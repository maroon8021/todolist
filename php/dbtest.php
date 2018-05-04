<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<title>DB接続テスト</title>
</head>
<body>

<?php
define('DB_HOST', 'localhost'); //定数化

$dsn = 'mysql:dbname=staff;host='.DB_HOST.';charset=utf8mb4'; //utf8の指定が必要
$user = 'root';
$password = 'root';

$dbh_json;
$sql_json;
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