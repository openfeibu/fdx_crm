<?php

namespace Home\Controller;

use Home\Common\FIdConst;
use Home\Service\ITBillService;
use Home\Service\UserService;

/**
 * 库间调拨 Controller
 *
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
class InvTransferController extends PSIBaseController
{

  /**
   * 库间调拨 - 首页
   */
  public function index()
  {
    $us = new UserService();

    if ($us->hasPermission(FIdConst::INVENTORY_TRANSFER)) {
      $this->initVar();

      $this->assign("title", "库间调拨");

      // 按钮权限：新建调拨单
      $this->assign("pAdd", $us->hasPermission(FIdConst::INVENTORY_TRANSFER_ADD) ? "1" : "0");
      // 按钮权限：编辑调拨单
      $this->assign(
        "pEdit",
        $us->hasPermission(FIdConst::INVENTORY_TRANSFER_EDIT) ? "1" : "0"
      );
      // 按钮权限：删除调拨单
      $this->assign(
        "pDelete",
        $us->hasPermission(FIdConst::INVENTORY_TRANSFER_DELETE) ? "1" : "0"
      );
      // 按钮权限：提交调拨单
      $this->assign(
        "pCommit",
        $us->hasPermission(FIdConst::INVENTORY_TRANSFER_COMMIT) ? "1" : "0"
      );
      // 按钮权限：单据生成PDF
      $this->assign(
        "pGenPDF",
        $us->hasPermission(FIdConst::INVENTORY_TRANSFER_PDF) ? "1" : "0"
      );
      // 按钮权限：打印预览、直接打印
      $this->assign(
        "pPrint",
        $us->hasPermission(FIdConst::INVENTORY_TRANSFER_PRINT) ? "1" : "0"
      );

      $this->display();
    } else {
      $this->gotoLoginPage("/Home/InvTransfer/index");
    }
  }

  /**
   * 调拨单主表信息列表
   */
  public function itbillList()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER)) {
        die("没有权限");
      }

      $params = [
        "billStatus" => I("post.billStatus"),
        "ref" => I("post.ref"),
        "fromDT" => I("post.fromDT"),
        "toDT" => I("post.toDT"),
        "fromWarehouseId" => I("post.fromWarehouseId"),
        "toWarehouseId" => I("post.toWarehouseId"),
        "goodsId" => I("post.goodsId"),
        "page" => I("post.page"),
        "start" => I("post.start"),
        "limit" => I("post.limit")
      ];

      $is = new ITBillService();

      $this->ajaxReturn($is->itbillList($params));
    }
  }

  /**
   * 新建或编辑调拨单
   */
  public function editITBill()
  {
    if (IS_POST) {
      $us = new UserService();

      $adding = I("post.adding");
      if ($adding == "1") {
        // 新建
        if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER_ADD)) {
          die("没有权限");
        }
      } else {
        // 编辑
        if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER_EDIT)) {
          die("没有权限");
        }
      }

      $params = [
        "jsonStr" => I("post.jsonStr")
      ];

      $is = new ITBillService();

      $this->ajaxReturn($is->editITBill($params));
    }
  }

  /**
   * 获取单个调拨单的信息
   */
  public function itBillInfo()
  {
    if (IS_POST) {
      $us = new UserService();

      $id = I("post.id");
      if ($id) {
        // 编辑
        if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER_EDIT)) {
          die("没有权限");
        }
      } else {
        // 新建
        if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER_ADD)) {
          die("没有权限");
        }
      }

      $params = [
        "id" => I("post.id")
      ];

      $is = new ITBillService();

      $this->ajaxReturn($is->itBillInfo($params));
    }
  }

  /**
   * 调拨单明细信息
   */
  public function itBillDetailList()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER)) {
        die("没有权限");
      }

      $params = [
        "id" => I("post.id")
      ];

      $is = new ITBillService();

      $this->ajaxReturn($is->itBillDetailList($params));
    }
  }

  /**
   * 删除调拨单
   */
  public function deleteITBill()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER_DELETE)) {
        die("没有权限");
      }

      $params = [
        "id" => I("post.id")
      ];

      $is = new ITBillService();

      $this->ajaxReturn($is->deleteITBill($params));
    }
  }

  /**
   * 提交调拨单
   */
  public function commitITBill()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER_COMMIT)) {
        die("没有权限");
      }

      $params = [
        "id" => I("post.id")
      ];

      $is = new ITBillService();

      $this->ajaxReturn($is->commitITBill($params));
    }
  }

  /**
   * 调拨单生成pdf文件
   */
  public function pdf()
  {
    $us = new UserService();

    if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER_PDF)) {
      die("没有权限");
    }

    $params = [
      "ref" => I("get.ref")
    ];

    $ws = new ITBillService();
    $ws->pdf($params);
  }

  /**
   * 生成打印调拨单的页面
   */
  public function genITBillPrintPage()
  {
    if (IS_POST) {
      $us = new UserService();

      if (!$us->hasPermission(FIdConst::INVENTORY_TRANSFER_PRINT)) {
        die("没有权限");
      }

      $params = [
        "id" => I("post.id")
      ];

      $ss = new ITBillService();
      $data = $ss->getITBillDataForLodopPrint($params);
      $this->assign("data", $data);
      $this->display();
    }
  }
}
