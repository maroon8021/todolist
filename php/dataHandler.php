<?php


class DataHandler{
    protected $dbh;
    protected $actionType;
    protected $targetTable;
    protected $targetColumns;

    public function __construct($dsn, $user, $password) {
        $this->dbh = new PDO($dsn, $user, $password, array(
            PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ));;
    }

    /**
     * @param {String} $actionType
     */
    public function setActionType($actionType) {
        $this->actionType = $actionType;
    }

    /**
     * @param {String} $targetTable
     */
    public function setTargetTable($targetTable) {
        $this->targetTable = $targetTable;
    }

    /**
     * @param {Array<>} $targetColumn
     */
    public function setTargetColumns($targetColumns) {
        $this->targetColumns = $targetColumns;
    }

    /**
     * @return {String} id
     */
    public function getLastInsertedId() {
        return $this->dbh->lastInsertId('id');
    }

    /**
     * 
     */
    public function execute($contents) {
        $stmt = null;
        try{
            switch($this->actionType){
                case 'insert':
                $columns = $this->getTargetColumns();
                $placeholders = $this->getPlaceHolders();
                  $stmt = $this->dbh->prepare("INSERT INTO $this->targetTable ($columns) VALUES ($placeholders)");
                  break;
            }
            for ($i=0; $i < count($this->targetColumns); $i++) { 
                $stmt->bindValue($i+1, $contents[$i], PDO::PARAM_STR);
            }
            
            $stmt->execute();

        }catch (PDOException $e){
            print('Error:'.$e->getMessage());
            die();
        }
    }



    /**********************************
     * Private methods
     **********************************/

     private function getTargetColumns(){
         $result = '';
         $index = 1;
         foreach ($this->targetColumns as $targetColumn) {
            $result = $index != count($this->targetColumns) ? $result.$targetColumn.',' : $result.$targetColumn;
            $index++;
        }
        return $result;
     }

     private function getPlaceHolders(){
        $result = '';
        $index = 1;
        foreach ($this->targetColumns as $targetColumn) {
            $result = $index != count($this->targetColumns) ? $result.'?,' : $result.'?';
            $index++;
       }
       return $result;
    }

    
}

?>