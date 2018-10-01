<?php


class DataHandler{
    protected $dbh;
    protected $stmt;
    protected $actionType;
    protected $targetTable;
    protected $targetColumns;
    protected $updateTarget;
    protected $query = '';
    protected $column = '*';

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
     * @param {Array<String>} $targetColumn
     */
    public function setTargetColumns($targetColumns) {
        $this->targetColumns = $targetColumns;
    }

    /**
     * @param {String} $query
     */
    public function setQuery($query) {
        $this->query = $query;
    }

    /**
     * @param {String} $updateTarget
     */
    public function setUpdateTarget($updateTarget) {
        $this->updateTarget = $updateTarget;
    }

    /**
     * @param {String} $updateTarget
     */
    public function setColumn($column) {
        $this->column = $column;
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
    public function execute($contents = null) {
        $this->stmt = null;
        try{
            switch($this->actionType){
                case 'select':
                $this->stmt = $this->dbh->prepare("SELECT $this->column FROM $this->targetTable $this->query");
                break;

                case 'insert':
                $columns = $this->getTargetColumns();
                $placeholders = $this->getPlaceHolders();
                $this->stmt = $this->dbh->prepare("INSERT INTO $this->targetTable ($columns) VALUES ($placeholders)");

                for ($i=0; $i < count($this->targetColumns); $i++) {
                    $this->stmt->bindValue($i+1, $contents[$i], PDO::PARAM_STR);
                }
                break;

                case 'update':
                $this->stmt = $this->dbh->prepare("UPDATE $this->targetTable set $this->updateTarget WHERE $this->query");

                for ($i=0; $i < count($contents); $i++) { 
                    $this->stmt->bindValue($i+1, $contents[$i], PDO::PARAM_STR);
                }
                break;

                case 'delete':
                $this->stmt = $this->dbh->prepare("DELETE from $this->targetTable WHERE $this->query");

                for ($i=0; $i < count($contents); $i++) { 
                    $this->stmt->bindValue($i+1, $contents[$i], PDO::PARAM_STR);
                }
                break;
            }
            
            
            $this->stmt->execute();

        }catch (PDOException $e){
            print('Error:'.$e->getMessage());
            die();
        }
    }

    /**
     * 
     */
    public function fetchAll() {
        return $this->stmt->fetchAll();
    }



    /**********************************
     * Private methods
     **********************************/

     private function getTargetColumns(){
         $result = '';
         $index = 1;
         foreach ($this->targetColumns as $targetColumn) {
            $result = $index != count($this->targetColumns) ? $result.$targetColumn.', ' : $result.$targetColumn;
            $index++;
        }
        return $result;
     }

     private function getPlaceHolders(){
        $result = '';
        $index = 1;
        foreach ($this->targetColumns as $targetColumn) {
            $result = $index != count($this->targetColumns) ? $result.'?, ' : $result.'?';
            $index++;
       }
       return $result;
    }

    
}

?>