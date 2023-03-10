<?php

namespace Home\Service;

use Home\DAO\IdGenDAO;

/**
 * 生成UUIDService
 *
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class IdGenService
{

  /**
   * 创建一个新的UUID
   */
  public function newId($db = null)
  {
    if (!$db) {
      $db = M();
    }

    $dao = new IdGenDAO($db);
    return $dao->newId();
  }
}
