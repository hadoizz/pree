<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Sqllibs
{

    public function selectAllRows($db, $tableName, $whereFields = null)
    {
        $sql = "select * from " . $tableName;
        $where = "";
        if ($whereFields != null) {
            $where = " where ";
            foreach (array_keys($whereFields) as $key) {
                $where = $where . $key . "=" . "'" . $whereFields[$key] . "'" . ' and ';
            }
            $where = substr($where, 0, strlen($where) - 4);
        }
        $sql = $sql . $where;
        $result = $db->query($sql)->result();
        return $result;
    }

    public function getOneRow($db, $tableName, $whereFields)
    {
        $result = $this->selectAllRows($db, $tableName, $whereFields);
        if (count($result) > 0)
            return $result[0];
        else
            return null;
    }

    public function isExist($db, $table, $whereFields)
    {
        $result = $this->getOneRow($db, $table, $whereFields);
        if ($result == null)
            return false;
        else
            return true;
    }

    public function insertRow($db, $tableName, $insertFields, $values = null)
    {
        $sql = "INSERT INTO " . $tableName . " ";
        $fieldsSql = "(";
        $valueSql = "(";

        if ($values != null) {
            for ($k = 0; $k < count($insertFields); $k++) {
                if (array_key_exists($k, $values)) {
                    $key = $values[$k];
                } else {
                    $key = $values[$insertFields[$k]];
                }
                $fieldsSql = $fieldsSql . $insertFields[$k] . ",";
                $filterValue = str_replace("\"", " ", $key);
                $valueSql = $valueSql . "\"" . $filterValue . "\",";
            }
        } else {
            foreach (array_keys($insertFields) as $key) {
                $fieldsSql = $fieldsSql . $key . ",";
                $valueSql = $valueSql . "\"" . $insertFields[$key] . "\",";
            }
        }
        $fieldsSql = substr($fieldsSql, 0, strlen($fieldsSql) - 1) . ")";
        $valueSql = substr($valueSql, 0, strlen($valueSql) - 1) . ")";
        $sql = $sql . $fieldsSql . " VALUES " . $valueSql;
        $db->query($sql);
        $id = $db->insert_id();
        return $id;
    }
    public function insertMultiRows($db, $tableName, $insertFields, $values)
    {
        $sql = "INSERT INTO " . $tableName . " ";
        $fieldsSql = "(";
        foreach ($insertFields as $key) {
            $fieldsSql = $fieldsSql . $key . ",";
        }
        $fieldsSql = substr($fieldsSql, 0, strlen($fieldsSql) - 1) . ")";
        $multiValueSql = "";
        foreach ($values as $valueElement) {
            $valueSql = "(";
            for ($k = 0; $k < count($insertFields); $k++) {
                $key = $valueElement[$k];
                $fieldsSql = $fieldsSql . $key . ",";
                $valueSql = $valueSql . "'" . $insertFields[$key] . "',";
            }
            $valueSql = substr($valueSql, 0, strlen($valueSql) - 1) . ")";
            $multiValueSql = $multiValueSql . $valueSql . ",";
        }
        $multiValueSql = substr($multiValueSql, 0, strlen($multiValueSql) - 1) . " ";
        $sql = $sql . $fieldsSql . " VALUES " . $multiValueSql;
        $db->query($sql);
        $id = $db->insert_id();
        return $id;
    }

    public function deleteRow($db, $table, $whereFields = null)
    {
        $sql = "delete from " . $table;
        $where = "";
        if ($whereFields != null) {
            $where = " where ";
            foreach (array_keys($whereFields) as $key) {
                $where = $where . $key . "=" . "'" . $whereFields[$key] . "'" . ' and ';
            }
            $where = substr($where, 0, strlen($where) - 4);
        }
        $sql = $sql . $where;
        $db->query($sql);
    }

    public function updateRow($db, $table, $updateFields, $whereFields = null)
    {

        $sql = "update " . $table . " set ";
        $valueSql = "";
        $whereSql = "";

        foreach (array_keys($updateFields) as $key) {
            $valueSql = $valueSql . $key . "='" . $updateFields[$key] . "', ";
        }
        $valueSql = substr($valueSql, 0, strlen($valueSql) - 2);
        if ($whereFields != null) {
            $whereSql = " where ";
            foreach (array_keys($whereFields) as $key) {
                $whereSql = $whereSql . $key . "=" . "'" . $whereFields[$key] . "'" . ' and ';
            }
            $whereSql = substr($whereSql, 0, strlen($whereSql) - 4);
        }
        $sql = $sql . $valueSql . $whereSql;
        $db->query($sql);
    }

    public function selectJoinTables($db, $tables, $conditions, $whereFields, $fields = null)
    {
        $sql = "select ";
        $joinSql = " from " . $tables[0] . " as A0";
        for ($i = 1; $i < count($tables); $i++) {
            $joinSql = $joinSql . " left join "
                . $tables[$i] . " as A" . $i . " on A" . ($i - 1) . "." . $conditions[$i - 1]
                . "= A" . ($i) . "." . $conditions[$i];
        }
        $where = "";
        if ($whereFields != null) {
            $where = " where ";
            foreach (array_keys($whereFields) as $key) {
                $where = $where . "A0." . $key . "=" . "'" . $whereFields[$key] . "'" . ' and ';
            }
            $where = substr($where, 0, strlen($where) - 4);
        }
        if ($fields == null)
            $sql = $sql . " * ";
        else {
            for ($k = 0; $k < count($fields); $k++) {
                if ($fields[$k] == null) {
                    $sql = $sql . "A" . $k . ".*,";
                } else {
                    foreach ($fields[$k] as $tableSelect) {
                        $sql = $sql . "A" . $k . "." . $tableSelect . ",";
                    }
                }
            }
            $sql = substr($sql, 0, strlen($sql) - 1);
        }
        $sql = $sql . $joinSql . $where;
        $result = $db->query($sql)->result();
        return $result;
    }

    public function rawSelectSql($db, $sql)
    {
        $result = $db->query($sql)->result();
        return $result;
    }

    public function sortQuery($field, $direction, $map)
    {
        if (!isset($map[$field])) {
            return NULL;
        }
        $orderQuery = "";
        if ($direction == 1) {
            $orderQuery = " ORDER BY " . $map[$field] . " DESC";
        } else if ($direction == 2) {
            $orderQuery = " ORDER BY " . $map[$field] . " ASC";
        }
        return $orderQuery;
    }

    public function limitQuery($page, $limit)
    {
        return " LIMIT " . (($page - 1) * $limit) . ", " . $limit;
    }
}