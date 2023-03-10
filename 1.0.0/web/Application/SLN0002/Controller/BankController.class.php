<?php

namespace SLN0002\Controller;

use Home\Common\FIdConst;
use Home\Controller\PSIBaseController;
use Home\Service\UserService;
use SLN0002\Service\BankService;

/**
 * 银行账户Controller
 *
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class BankController extends PSIBaseController
{

  /**
   * 银行账户 - 主页面
   */
  public function index()
  {
    $us = new UserService();

    if ($us->hasPermission(FIdConst::GL_BANK_ACCOUNT)) {
      $this->initVar();

      $this->assign("title", "银行账户");

      $this->display();
    } else {
      $this->gotoLoginPage("/SLN0002/Bank/index");
    }
  }

  /**
   * 返回所有的公司列表
   */
  public function companyList()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::GL_BANK_ACCOUNT)) {
        die("没有权限");
      }

      $service = new BankService();
      $this->ajaxReturn($service->companyList());
    }
  }

  /**
   * 某个公司的银行账户
   */
  public function bankList()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::GL_BANK_ACCOUNT)) {
        die("没有权限");
      }

      $params = [
        "companyId" => I("post.companyId")
      ];

      $service = new BankService();
      $this->ajaxReturn($service->bankList($params));
    }
  }

  /**
   * 新增或编辑银行账户
   */
  public function editBank()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::GL_BANK_ACCOUNT)) {
        die("没有权限");
      }

      $params = [
        "id" => I("post.id"),
        "companyId" => I("post.companyId"),
        "bankName" => I("post.bankName"),
        "bankNumber" => I("post.bankNumber"),
        "memo" => I("post.memo")
      ];

      $service = new BankService();
      $this->ajaxReturn($service->editBank($params));
    }
  }

  /**
   * 删除银行账户
   */
  public function deleteBank()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::GL_BANK_ACCOUNT)) {
        die("没有权限");
      }

      $params = [
        "id" => I("post.id")
      ];

      $service = new BankService();
      $this->ajaxReturn($service->deleteBank($params));
    }
  }
}
