<?php

require_once('dbConst.php');
require_once('dataHandler.php');

/**
 * DBScheme
 * -article
 *  └ id
 *  └ content
 * -tag_map
 *  └ article_id
 *  └ tag_id
 * -tag_list
 *  └ tag_id
 *  └ tag_name
 *  └ *option?
 */

class ArticleController{
    public function __construct() {
        //$this->setName($name);
    }

    public function getTagData() {
        $tagList = array(); 
        try{
            $dbh = new PDO(DSN, USER, PASSWORD);
            $sql = 'select * from tag_list';
            $prepared = $dbh->prepare($sql);
            $prepared->execute();
            $rowTagList = $prepared->fetchAll(); //fetchAllってなんだっけ？
              foreach ($rowTagList as $tag) { //なんかこの辺ってよろしくやってくれそうなmethodありそう
                array_push($tagList, array(
                  'tagId' => $tag['tag_id'],
                  'tagName' => $tag['tag_name']
                ));
              }
        }catch (PDOException $e){
            print('Error:'.$e->getMessage());
            die();
        }
        return $tagList;
    }

    public function getData() {
        try{
            $dbh = new PDO(DSN, USER, PASSWORD);
              $dbh_json = $dbh;
          
              $sql = 'select * from todo where isfinished IS false';
              $sql_json = $sql;
          
              foreach ($dbh->query($sql) as $row) {
                  print($row['todoid'].',');
                  print($row['title']);
                  print('<br />');
              }
          
          
              $prepared = $dbh->prepare($sql);
              $prepared->execute();
              $dbh_json = $prepared->fetchAll();
          
              $newArray = array();
              foreach ($dbh_json as $arr) {
                array_push($newArray, array(
                  'key' => $arr['todoid'],
                  'value' => $arr['title']
                ));
              }
          }catch (PDOException $e){
              print('Error:'.$e->getMessage());
              die();
          }
    }

}


// When POST

/**
 * param = {
 *   tagList: Array
 *   article: String
 *   type: String
 * }
 * 
 * table \ colmun?
 */
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $dataHandler = new DataHandler(DSN, USER, PASSWORD);

    switch($_POST['type']){
        case 'new-article':
        insertNewArticle($dataHandler);

        // Insert tags if it exists.
        if(empty($_POST['tagList'])){
            exit();
        }
        
        // Insert new tags
        $insertedId = $dataHandler->getLastInsertedId();
        $dataHandler->setTargetTable('tag_map');
        $dataHandler->setTargetColumns(array('article_id', 'tag_id'));
        $tagList = explode(',', $_POST['tagList']);
        
        for ($i=0; $i < count($tagList); $i++) {
            $dataHandler->execute(array($insertedId, $tagList[$i]));
        }
        break;

        case 'new-tag':
        break;
    }
    

    
    
    
    

    //$article = $_POST['article'];
    //$type = $_POST['type'];
    //if($type == 'new-article'){
        // $stmt = $dbh->prepare('UPDATE schedule set title = :is_finished where todoid = :update_id');
    //}
    //$stmt = $dbh->prepare("INSERT INTO article (content) VALUES (:value)"); // $dbh already has staff
    //$stmt->bindParam(':name', $name, PDO::PARAM_STR);
    //$stmt->bindValue(':value', 1, PDO::PARAM_INT);
    //$stmt->bindValue(':value', $article, PDO::PARAM_STR);
    //$stmt->execute();


    
}

/**
 * @param {DataHandler} $dataHandler
 */
function insertNewArticle($dataHandler){
    $dataHandler->setActionType('insert');
    $dataHandler->setTargetTable('article'); // const化したい
    $dataHandler->setTargetColumns(array('content'));
    $dataHandler->execute(array($_POST['article']));
}

/**
 * @param {DataHandler} $dataHandler
 */
function insertNewTag($dataHandler){
    $insertedId = $dataHandler->getLastInsertedId();
    $dataHandler->setTargetTable('tag_map');
    $dataHandler->setTargetColumns(array('article_id', 'tag_id'));
    $tagList = explode(',', $_POST['tagList']);
        
    for ($i=0; $i < count($tagList); $i++) {
        $dataHandler->execute(array($insertedId, $tagList[$i]));
    }
}

?>
