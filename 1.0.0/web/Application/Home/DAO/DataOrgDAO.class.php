<?php

namespace Home\DAO;

use Home\Common\DemoConst;

/**
 * 数据域 DAO
 *
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class DataOrgDAO extends PSIBaseExDAO
{

  private function getLoginUserDataOrg($loginUserId)
  {
    $db = $this->db;

    $sql = "select data_org from t_user where id = '%s' ";
    $data = $db->query($sql, $loginUserId);
    if ($data) {
      return $data[0]["data_org"];
    } else {
      return null;
    }
  }

  private function getDataOrgForFId($fid, $loginUserId)
  {
    $db = $this->db;

    $result = [];

    // 2022-3-15 取消admin的数据域全域
    // if ($loginUserId == DemoConst::ADMIN_USER_ID) {
    //   // admin 是超级管理员
    //   $result[] = "*";
    //   return $result;
    // }

    $sql = "select distinct rpd.data_org
            from t_role_permission rp, t_role_permission_dataorg rpd,
              t_role_user ru
            where ru.user_id = '%s' and ru.role_id = rp.role_id
              and rp.role_id = rpd.role_id and rp.permission_id = rpd.permission_id
              and rpd.permission_id = '%s' ";
    $data = $db->query($sql, $loginUserId, $fid);

    foreach ($data as $v) {
      $result[] = $v["data_org"];
    }

    return $result;
  }

  /**
   * 构建数据域的查询SQL语句
   */
  public function buildSQL($fid, $tableName, $loginUserId)
  {
    $queryParams = [];

    $userDataOrg = $this->getLoginUserDataOrg($loginUserId);

    $dataOrgList = $this->getDataOrgForFId($fid, $loginUserId);

    if (count($dataOrgList) == 0) {
      // return null; // 全部数据域

      // 2022-3-15
      // 原来是返回 null，作为全域
      // 现在改为返回一个假条件，生成空域
      return [
        0 => " ( 1 = 2) ",
        1 => [],
      ];
    }

    // data_org is null 是为了兼容之前的版本遗留下的数据
    $result = " ( " . $tableName . ".data_org is null or " . $tableName . ".data_org = '' ";
    foreach ($dataOrgList as $dataOrg) {
      // 2022-3-15 取消全域
      // if ($dataOrg == "*") {
      //   return null; // 全部数据域
      // }

      // # 表示是当前用户自身的数据域
      if ($dataOrg == "#") {
        $result .= " or " . $tableName . ".data_org = '%s' ";
        $queryParams[] = $userDataOrg;

        continue;
      }

      $result .= " or left(" . $tableName . ".data_org, %d) = '%s' ";
      $queryParams[] = strlen($dataOrg);
      $queryParams[] = $dataOrg;
    }

    $result .= " ) ";

    return [
      0 => $result,
      1 => $queryParams
    ];
  }
}
