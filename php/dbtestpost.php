<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<title>DB POSTテスト</title>

    <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js">
    </script>
    <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>


    <script src="../js/main.js"></script>

    <script src="../component/input.js" type="text/babel"></script>
    <script src="../component/button.js" type="text/babel"></script>
    <script src="../component/view.js" type="text/babel"></script>

</head>
<body>

<?php

//////////////////////////////////////



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


////////////////////////////////////////


// Get posted data

$postedData='';
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $postedData = $_POST['comment'];
    $stmt = $dbh->prepare("INSERT INTO staffname (name) VALUES (:value)"); // $dbh already has staff
    //$stmt->bindParam(':name', $name, PDO::PARAM_STR);
    //$stmt->bindValue(':value', 1, PDO::PARAM_INT);
    $stmt->bindValue(':value', $postedData, PDO::PARAM_STR);
    $stmt->execute();
  }

$serverRequest_json = json_encode($_SERVER['REQUEST_METHOD']);
$postedData_json = json_encode($postedData);

$myPath = __FILE__;
$basename = pathinfo($myPath, PATHINFO_BASENAME);

?>
<script type="text/javascript">
    var serverRequest = JSON.parse('<?php echo $serverRequest_json; ?>');
    console.log(serverRequest);

    var postedData = JSON.parse('<?php echo $postedData_json; ?>');
    console.log("$postedData : "+postedData);
</script>

    <form action = "/app/php/datapost.php" method = "post">
        <div id="input"　></div>
        <div id="hidden" value="./<?php echo $basename; ?>"></div>
        <div id="button"></div>
    </form>


</body>
</html>