<?php

require('dbConst.php');
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
                  'key' => $tag['tag_id'],
                  'name' => $tag['tag_name']
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


?>
