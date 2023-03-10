/**
 * 销售订单 - 主界面
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.SaleOrder.SOMainForm", {
  extend: "PSI.AFX.BaseMainExForm",

  config: {
    permission: null
  },

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;

    PCL.apply(me, {
      items: [{
        tbar: me.getToolbarCmp(),
        id: "panelQueryCmp",
        region: "north",
        height: 95,
        header: false,
        collapsible: true,
        collapseMode: "mini",
        border: 0,
        layout: {
          type: "table",
          columns: 5
        },
        items: me.getQueryCmp()
      }, {
        region: "center",
        layout: "border",
        border: 0,
        items: [{
          region: "north",
          height: "40%",
          split: true,
          layout: "fit",
          border: 0,
          items: [me.getMainGrid()]
        }, {
          region: "center",
          layout: "fit",
          xtype: "tabpanel",
          border: 0,
          items: [me.getDetailGrid(), me.getWSGrid()]
        }]
      }]
    });

    me.callParent(arguments);

    me.refreshMainGrid();
  },

  /**
   * 工具栏
   */
  getToolbarCmp: function () {
    var me = this;
    return [{
      text: "新建销售订单",
      id: "buttonAdd",
      hidden: me.getPermission().add == "0",
      scope: me,
      handler: me.onAddBill
    }, {
      hidden: me.getPermission().add == "0",
      xtype: "tbseparator"
    }, {
      text: "编辑销售订单",
      hidden: me.getPermission().edit == "0",
      scope: me,
      handler: me.onEditBill,
      id: "buttonEdit"
    }, {
      hidden: me.getPermission().edit == "0",
      xtype: "tbseparator"
    }, {
      text: "删除销售订单",
      hidden: me.getPermission().del == "0",
      scope: me,
      handler: me.onDeleteBill,
      id: "buttonDelete"
    }, {
      hidden: me.getPermission().del == "0",
      xtype: "tbseparator",
      id: "tbseparator1"
    }, {
      text: "通过",
      hidden: me.getPermission().confirm == "0",
      scope: me,
      handler: me.onCommit,
      id: "buttonCommit"
    }, {
      text: "拒绝",
      hidden: me.getPermission().confirm == "0",
      scope: me,
      handler: me.onRejectCommit,
      id: "buttonRejectCommit"
    }, {
      text: "取消审核",
      hidden: me.getPermission().confirm == "0",
      scope: me,
      handler: me.onCancelConfirm,
      id: "buttonCancelConfirm"
    }, {
      hidden: me.getPermission().confirm == "0",
      xtype: "tbseparator",
      id: "tbseparator2"
    }, {
      text: "生成采购订单",
      hidden: true,//me.getPermission().genPOBill == "0"
      scope: me,
      handler: me.onGenPOBill,
      id: "buttonGenPOBill"
    }, {
      text: "生成销售出库单",
      hidden: me.getPermission().genWSBill == "0",
      scope: me,
      handler: me.onGenWSBill,
      id: "buttonGenWSBill"
    }, {
      hidden: me.getPermission().genWSBill == "0",
      xtype: "tbseparator"
    }, {
      text: "关闭订单",
      hidden: me.getPermission().closeBill == "0",
      id: "buttonCloseBill",
      menu: [{
        text: "关闭销售订单",
        iconCls: "PSI-button-commit",
        scope: me,
        handler: me.onCloseSO
      }, "-", {
        text: "取消销售订单关闭状态",
        iconCls: "PSI-button-cancelconfirm",
        scope: me,
        handler: me.onCancelClosedSO
      }]
    }, {
      hidden: me.getPermission().closeBill == "0",
      xtype: "tbseparator"
    }, {
      text: "导出",
      hidden: me.getPermission().genPDF == "0",
      menu: [{
        text: "单据生成pdf",
        iconCls: "PSI-button-pdf",
        id: "buttonPDF",
        scope: me,
        handler: me.onPDF
      }]
    }, {
      hidden: me.getPermission().genPDF == "0",
      xtype: "tbseparator"
    }, {
      text: "打印",
      hidden: me.getPermission().print == "0",
      menu: [{
        text: "打印预览",
        iconCls: "PSI-button-print-preview",
        scope: me,
        handler: me.onPrintPreview
      }, "-", {
        text: "直接打印",
        iconCls: "PSI-button-print",
        scope: me,
        handler: me.onPrint
      }]
    }, {
      xtype: "tbseparator",
      hidden: me.getPermission().print == "0"
    }, /*{
      text: "指南",
      handler: function () {
        me.focus();
        window.open(me.URL("Home/Help/index?t=sobill"));
      }
    }, "-",*/ {
      text: "关闭",
      handler: function () {
        me.closeWindow();
      }
    }].concat(me.getPagination());
  },

  /**
   * 查询条件
   */
  getQueryCmp: function () {
    var me = this;
    return [{
      id: "editQueryBillStatus",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "状态",
      margin: "5, 0, 0, 0",
      store: PCL.create("PCL.data.ArrayStore", {
        fields: ["id", "text"],
        data: [[-1, "全部"], [-1000, "已拒绝"], [0, "待审核"], [1000, "已通过"],
        [2000, "部分出库"], [3000, "全部出库"], [4000, "订单关闭"]]
      }),
      value: -1
    }, {
      id: "editQueryRef",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "单号",
      margin: "5, 0, 0, 0",
      xtype: "textfield"
    }, {
      id: "editQueryFromDT",
      xtype: "datefield",
      margin: "5, 0, 0, 0",
      format: "Y-m-d",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "交货日期（起）"
    }, {
      id: "editQueryToDT",
      xtype: "datefield",
      margin: "5, 0, 0, 0",
      format: "Y-m-d",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "交货日期（止）"
    }, {
      id: "editQueryCustomer",
      labelWidth: 60,
      xtype: "psi_customerfield",
      showModal: true,
      labelAlign: "right",
      labelSeparator: "",
      margin: "5, 0, 0, 0",
      fieldLabel: "客户"
    }, {
      id: "editQueryReceivingType",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "收款方式",
      labelWidth: 60,
      margin: "5, 0, 0, 0",
      xtype: "combo",
      queryMode: "local",
      editable: false,
      valueField: "id",
      store: PCL.create("PCL.data.ArrayStore", {
        fields: ["id", "text"],
        data: [[-1, "全部"], [0, "记应收账款/月结现结"]/*, [1, "现金收款"]*/]
      }),
      value: -1
    }, {
      id: "editQueryGoods",
      labelWidth: 60,
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "商品",
      margin: "5, 0, 0, 0",
      xtype: "psi_goodsfield",
      showModal: true
    }, {
      id: "editQueryUser",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "制单人",
      margin: "5, 0, 0, 0",
      xtype: "psi_userfield",
      showModal: true
    }, {
      xtype: "container",
      colspan: 2,
      items: [{
        xtype: "button",
        text: "查询",
        width: 100,
        height: 26,
        margin: "5 0 0 10",
        handler: me.onQuery,
        scope: me
      }, {
        xtype: "button",
        text: "清空查询条件",
        width: 100,
        height: 26,
        margin: "5, 0, 0, 10",
        handler: me.onClearQuery,
        scope: me
      }, {
        xtype: "button",
        text: "隐藏工具栏",
        width: 130,
        height: 26,
        iconCls: "PSI-button-hide",
        margin: "5 0 0 10",
        handler: function () {
          PCL.getCmp("panelQueryCmp").collapse();
        },
        scope: me
      }]
    }];
  },

  /**
   * 分页
   */
  getPagination() {
    const me = this;
    const store = me.getMainGrid().getStore();
    const result = ["->", {
      id: "pagingToobar",
      xtype: "pagingtoolbar",
      cls: "PSI-Pagination",
      border: 0,
      store: store
    }, "-", {
        xtype: "displayfield",
        value: "每页显示"
      }, {
        id: "comboCountPerPage",
        xtype: "combobox",
        cls: "PSI-Pagination",
        editable: false,
        width: 60,
        store: PCL.create("PCL.data.ArrayStore", {
          fields: ["text"],
          data: [["20"], ["50"], ["100"],
          ["300"], ["1000"]]
        }),
        value: 20,
        listeners: {
          change: {
            fn: function () {
              store.pageSize = PCL.getCmp("comboCountPerPage").getValue();
              store.currentPage = 1;
              PCL.getCmp("pagingToobar").doRefresh();
            },
            scope: me
          }
        }
      }, {
        xtype: "displayfield",
        value: "张单据"
      }];

    return result;
  },

  /**
   * 销售订单主表
   */
  getMainGrid: function () {
    var me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    var modelName = "PSISOBill";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "ref", "customerName", "contact", "tel",
        "fax", "inputUserName", "bizUserName",
        "billStatus", { name: "goodsMoney", type: "float" }, "dateCreated",
        "receivingType", "tax", "moneyWithTax", { name: "freight", type: "float" }, "dealDate",
        "dealAddress", "orgName", "confirmUserName",
        "confirmDate", "billMemo", "genPWBill","rejectContent"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: [],
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: me.URL("Home/SaleOrder/sobillList"),
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      }
    });
    store.on("beforeload", function () {
      store.proxy.extraParams = me.getQueryParam();
    });
    store.on("load", function (e, records, successful) {
      if (successful) {
        me.gotoMainGridRecord(me.__lastId);
      }
    });

    me.__mainGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-FC",
      viewConfig: {
        enableTextSelection: true
      },
      features: [{
        ftype: "summary",
        dock: "bottom"
      }],
      border: 1,
      columnLines: true,
      columns: [{
        xtype: "rownumberer",
        width: 50,
        summaryRenderer: function () {
          return "合计";
        }
      }, {
        header: "状态",
        dataIndex: "billStatus",
        menuDisabled: true,
        sortable: false,
        width: 100,
        renderer(value, metaData, record) {
          if (value == 0) {
            return "<span style='color:orange'>待审核</span>";
          } else if (value == -1000) {
            return "<span style='color:red'>已拒绝："+record.get("rejectContent")+"</span>";
          } else if (value == 1000) {
            return "已通过";
          }  else if (value == 2000) {
            return "<span style='color:green'>部分出库</span>";
          } else if (value == 3000) {
            return "全部出库";
          } else if (value == 4000) {
            return "关闭(未出库)";
          } else if (value == 4001) {
            return "关闭(部分出库)";
          } else if (value == 4002) {
            return "关闭(全部出库)";
          } else {
            return "";
          }
        }
      }, {
        header: "销售订单号",
        dataIndex: "ref",
        width: 110,
        menuDisabled: true,
        sortable: false
      }, {
        header: "是否存在出库单",
        dataIndex: "genPWBill",
        width: 110,
        align: "center",
        menuDisabled: true,
        sortable: false
      }, {
        header: "交货日期",
        dataIndex: "dealDate",
        menuDisabled: true,
        sortable: false,
        width: 80,
        align: "center"
      }, {
        header: "交货地址",
        dataIndex: "dealAddress",
        menuDisabled: true,
        sortable: false
      }, {
        header: "客户",
        dataIndex: "customerName",
        width: 300,
        menuDisabled: true,
        sortable: false
      }, {
        header: "客户联系人",
        dataIndex: "contact",
        menuDisabled: true,
        sortable: false
      }, {
        header: "客户电话",
        dataIndex: "tel",
        menuDisabled: true,
        sortable: false
      }, {
        header: "客户传真",
        dataIndex: "fax",
        menuDisabled: true,
        sortable: false
      }, {
        header: "销售金额",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        summaryType: "sum"
      }, {
        header: "税金", hidden: true, //隐藏税金
        dataIndex: "tax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90
      }, {
        header: "价税合计", hidden: true, //价税合计
        dataIndex: "moneyWithTax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90
      }, {
        header: "运费",
        dataIndex: "freight",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        summaryType: "sum"
      }, {
        header: "收款方式",
        dataIndex: "receivingType",
        menuDisabled: true,
        sortable: false,
        width: 150,
        renderer: function (value) {
          if (value == 0) {
            return "记应收账款/月结现结";
          } else if (value == 1) {
            return "现金收款";
          } else {
            return "";
          }
        }
      }, {
        header: "业务员",
        dataIndex: "bizUserName",
        menuDisabled: true,
        sortable: false
      }, {
        header: "组织机构",
        dataIndex: "orgName",
        menuDisabled: true,
        sortable: false
      }, {
        header: "制单人",
        dataIndex: "inputUserName",
        menuDisabled: true,
        sortable: false
      }, {
        header: "制单时间",
        dataIndex: "dateCreated",
        menuDisabled: true,
        sortable: false,
        width: 140
      }, {
        header: "审核人",
        dataIndex: "confirmUserName",
        menuDisabled: true,
        sortable: false
      }, {
        header: "审核时间",
        dataIndex: "confirmDate",
        menuDisabled: true,
        sortable: false,
        width: 140
      }, {
        header: "备注",
        dataIndex: "billMemo",
        menuDisabled: true,
        sortable: false
      }],
      store: store,
      listeners: {
        select: {
          fn: me.onMainGridSelect,
          scope: me
        },
        itemdblclick: {
          fn: me.getPermission().edit == "1"
            ? me.onEditBill
            : PCL.emptyFn,
          scope: me
        }
      }
    });

    return me.__mainGrid;
  },

  /**
   * 销售订单明细记录
   */
  getDetailGrid: function () {
    var me = this;
    if (me.__detailGrid) {
      return me.__detailGrid;
    }

    var modelName = "PSISOBillDetail";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "goodsCode", "goodsName", "goodsSpec",
        "unitName", "goodsCount", "goodsMoney",
        "goodsPrice", "taxRate", "tax", "moneyWithTax",
        "wsCount", "leftCount", "memo", "goodsPriceWithTax"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__detailGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      title: "销售订单明细",
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: [PCL.create("PCL.grid.RowNumberer", {
        text: "序号",
        width: 40
      }), {
        header: "商品编码",
        dataIndex: "goodsCode",
        menuDisabled: true,
        sortable: false,
        width: 120
      }, {
        menuDisabled: true,
        draggable: false,
        sortable: false,
        header: "品名/规格型号",
        dataIndex: "goodsName",
        width: 330,
        renderer: function (value, metaData, record) {
          return record.get("goodsName") + " " + record.get("goodsSpec");
        }
      }, {
        header: "销售数量",
        dataIndex: "goodsCount",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 80
      }, {
        header: "出库数量",
        dataIndex: "wsCount",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 80
      }, {
        header: "未出库数量",
        dataIndex: "leftCount",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 80,
        renderer: function (value) {
          if (value > 0) {
            return "<span style='color:red'>" + value
              + "</span>";
          } else {
            return value;
          }
        }
      }, {
        header: "单位",
        dataIndex: "unitName",
        menuDisabled: true,
        sortable: false,
        width: 60,
        align: "center"
      }, {
        header: "销售单价",
        dataIndex: "goodsPrice",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90
      }, {
        header: "销售金额",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90
      }, {
        header: "税率(%)", hidden: true, //隐藏税率
        dataIndex: "taxRate",
        menuDisabled: true,
        sortable: false,
        xtype: "numbercolumn",
        format: "0",
        align: "right",
        width: 60
      }, {
        header: "税金", hidden: true, //隐藏税金
        dataIndex: "tax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90
      }, {
        header: "价税合计", hidden: true, //价税合计
        dataIndex: "moneyWithTax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90
      }, {
        header: "含税价", hidden: true, //隐藏含税价
        dataIndex: "goodsPriceWithTax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90
      }, {
        header: "备注",
        dataIndex: "memo",
        menuDisabled: true,
        sortable: false,
        width: 120
      }, {
        header: "",
        id: "columnActionChangeOrder",
        align: "center",
        menuDisabled: true,
        draggable: false,
        hidden: true,
        width: 40,
        xtype: "actioncolumn",
        items: [{
          icon: me
            .URL("Public/Images/icons/edit.png"),
          tooltip: "订单变更",
          handler: me.onChangeOrder,
          scope: me
        }]
      }],
      store: store
    });

    return me.__detailGrid;
  },

  /**
   * 刷新销售订单主表记录
   */
  refreshMainGrid: function (id) {
    var me = this;

    PCL.getCmp("buttonEdit").setDisabled(true);
    PCL.getCmp("buttonDelete").setDisabled(true);
    PCL.getCmp("buttonCommit").setDisabled(true);
    PCL.getCmp("buttonCancelConfirm").setDisabled(true);
    PCL.getCmp("buttonGenWSBill").setDisabled(true);
    PCL.getCmp("buttonGenPOBill").setDisabled(true);

    var gridDetail = me.getDetailGrid();
    gridDetail.setTitle("销售订单明细");
    gridDetail.getStore().removeAll();

    var grid = me.getWSGrid();
    grid.getStore().removeAll();

    PCL.getCmp("pagingToobar").doRefresh();
    me.__lastId = id;
  },

  /**
   * 新增销售订单
   */
  onAddBill: function () {
    var me = this;

    var form = PCL.create("PSI.SaleOrder.SOEditForm", {
      parentForm: me,
      showAddGoodsButton: me.getPermission().showAddGoodsButton
    });
    form.show();
  },

  /**
   * 编辑销售订单
   */
  onEditBill: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要编辑的销售订单");
      return;
    }
    var bill = item[0];

    var form = PCL.create("PSI.SaleOrder.SOEditForm", {
      parentForm: me,
      showAddGoodsButton: me.getPermission().showAddGoodsButton,
      entity: bill
    });
    form.show();
  },

  /**
   * 删除销售订单
   */
  onDeleteBill: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的销售订单");
      return;
    }

    var bill = item[0];

    if (bill.get("billStatus") > 0) {
      me.showInfo("当前销售订单已经审核通过，不能删除");
      return;
    }

    var store = me.getMainGrid().getStore();
    var index = store.findExact("id", bill.get("id"));
    index--;
    var preIndex = null;
    var preItem = store.getAt(index);
    if (preItem) {
      preIndex = preItem.get("id");
    }

    var info = "请确认是否删除销售订单: <span style='color:red'>" + bill.get("ref")
      + "</span>";
    var funcConfirm = function () {
      var el = PCL.getBody();
      el.mask("正在删除中...");
      var r = {
        url: me.URL("Home/SaleOrder/deleteSOBill"),
        params: {
          id: bill.get("id")
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(preIndex);
              me.tip("成功完成删除操作");
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };
      me.ajax(r);
    };

    me.confirm(info, funcConfirm);
  },

  onMainGridSelect: function () {
    var me = this;
    me.getDetailGrid().setTitle("销售订单明细");
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PCL.getCmp("buttonEdit").setDisabled(true);
      PCL.getCmp("buttonDelete").setDisabled(true);
      PCL.getCmp("buttonCommit").setDisabled(true);
      PCL.getCmp("buttonRejectCommit").setDisabled(true);
      PCL.getCmp("buttonCancelConfirm").setDisabled(true);
      PCL.getCmp("buttonDelete").setDisabled(true);
      PCL.getCmp("buttonGenWSBill").setDisabled(true);
      PCL.getCmp("buttonGenPOBill").setDisabled(true);

      return;
    }
    var bill = item[0];
    var commited = bill.get("billStatus") >= 1000;

    var buttonEdit = PCL.getCmp("buttonEdit");
    buttonEdit.setDisabled(false);
    if (commited) {
      buttonEdit.setText("查看销售订单");
      PCL.getCmp("columnActionChangeOrder").show();
    } else {
      buttonEdit.setText("编辑销售订单");
      PCL.getCmp("columnActionChangeOrder").hide();
    }
    if (me.getPermission().confirm == "0") {
      // 没有审核权限就不能做订单变更
      PCL.getCmp("columnActionChangeOrder").hide();
    }

    PCL.getCmp("buttonDelete").setDisabled(commited);
    PCL.getCmp("buttonCommit").setDisabled(commited || (bill.get("billStatus") < 0));
    PCL.getCmp("buttonCancelConfirm").setDisabled(
!((bill.get("billStatus")==-1000 || bill.get("billStatus")==1000) && bill.get("genPWBill") == 0)
    );//false:开启：(bill.get("billStatus")==-1000 || bill.get("billStatus")==1000) && bill.get("genPWBill") = 0

    PCL.getCmp("buttonRejectCommit").setDisabled(commited || (bill.get("billStatus") < 0));
    PCL.getCmp("buttonGenWSBill").setDisabled(!commited);
    PCL.getCmp("buttonGenPOBill").setDisabled(!commited);

    me.refreshDetailGrid();

    me.refreshWSGrid();
  },

  /**
   * 刷新销售订单明细记录
   */
  refreshDetailGrid: function (id) {
    var me = this;
    me.getDetailGrid().setTitle("销售订单明细");
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var bill = item[0];

    var grid = me.getDetailGrid();
    grid.setTitle("单号: " + bill.get("ref") + " 客户: "
      + bill.get("customerName"));
    var el = grid.getEl();
    el.mask(PSI.Const.LOADING);

    var r = {
      url: me.URL("Home/SaleOrder/soBillDetailList"),
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        var store = grid.getStore();

        store.removeAll();

        if (success) {
          var data = me.decodeJSON(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            if (id) {
              var r = store.findExact("id", id);
              if (r != -1) {
                grid.getSelectionModel().select(r);
              }
            }
          }
        }

        el.unmask();
      }
    };
    me.ajax(r);
  },

  /**
   * 审核销售订单
   */
  onCommit: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要审核的销售订单");
      return;
    }
    var bill = item[0];

    if (bill.get("billStatus") > 0) {
      me.showInfo("当前销售订单已经审核，不能再次审核");
      return;
    }

    var detailCount = me.getDetailGrid().getStore().getCount();
    if (detailCount == 0) {
      me.showInfo("当前销售订单没有录入商品明细，不能审核");
      return;
    }

    var info = "请确认是否审核单号: <span style='color:red'>" + bill.get("ref")
      + "</span> 的销售订单?";
    var id = bill.get("id");

    var funcConfirm = function () {
      var el = PCL.getBody();
      el.mask("正在提交中...");
      var r = {
        url: me.URL("Home/SaleOrder/commitSOBill"),
        params: {
          id: id
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(id);
              me.tip("成功完成审核操作");
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };
      me.ajax(r);
    };
    me.confirm(info, funcConfirm);
  },
  /**
   * 拒绝销售订单
   */
  onRejectCommit: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要审核的销售订单");
      return;
    }
    var bill = item[0];

    if (bill.get("billStatus") > 0) {
      me.showInfo("当前销售订单已经审核，不能再次审核");
      return;
    }

    var detailCount = me.getDetailGrid().getStore().getCount();
    if (detailCount == 0) {
      me.showInfo("当前销售订单没有录入商品明细，不能审核");
      return;
    }

    var info = "请确认是否拒绝单号: <span style='color:red'>" + bill.get("ref")
      + "</span> 的销售订单?";
    var id = bill.get("id");

    var funcConfirm = function (content) {
      var el = PCL.getBody();
      el.mask("正在提交中...");
      var r = {
        url: me.URL("Home/SaleOrder/rejectSOBill"),
        params: {
          id: id,
          reject_content: content
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(id);
              me.tip("成功完成拒绝操作");
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };
      me.ajax(r);
    };
    me.confirmContent(info, funcConfirm);
  },
  /**
   * 取消审核
   */
  onCancelConfirm: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要取消审核的销售订单");
      return;
    }
    var bill = item[0];

    if (bill.get("billStatus") == 0) {
      me.showInfo("当前销售订单还没有审核，无法取消审核");
      return;
    }

    var info = "请确认是否取消审核单号为 <span style='color:red'>" + bill.get("ref")
      + "</span> 的销售订单?";
    var id = bill.get("id");
    var funcConfirm = function () {
      var el = PCL.getBody();
      el.mask("正在提交中...");
      var r = {
        url: me.URL("Home/SaleOrder/cancelConfirmSOBill"),
        params: {
          id: id
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(id);
              me.tip("成功完成取消审核操作");
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };
      me.ajax(r);
    };
    me.confirm(info, funcConfirm);
  },

  gotoMainGridRecord: function (id) {
    var me = this;
    var grid = me.getMainGrid();
    grid.getSelectionModel().deselectAll();
    var store = grid.getStore();
    if (id) {
      var r = store.findExact("id", id);
      if (r != -1) {
        grid.getSelectionModel().select(r);
      } else {
        grid.getSelectionModel().select(0);
      }
    } else {
      grid.getSelectionModel().select(0);
    }
  },

  /**
   * 查询
   */
  onQuery: function () {
    var me = this;

    me.getMainGrid().getStore().currentPage = 1;
    me.refreshMainGrid();
  },

  /**
   * 清除查询条件
   */
  onClearQuery: function () {
    var me = this;

    PCL.getCmp("editQueryBillStatus").setValue(-1);
    PCL.getCmp("editQueryRef").setValue(null);
    PCL.getCmp("editQueryFromDT").setValue(null);
    PCL.getCmp("editQueryToDT").setValue(null);
    PCL.getCmp("editQueryCustomer").clearIdValue();
    PCL.getCmp("editQueryReceivingType").setValue(-1);
    PCL.getCmp("editQueryGoods").clearIdValue();
    PCL.getCmp("editQueryUser").clearIdValue();

    me.onQuery();
  },

  getQueryParam: function () {
    var me = this;

    var result = {
      billStatus: PCL.getCmp("editQueryBillStatus").getValue()
    };

    var ref = PCL.getCmp("editQueryRef").getValue();
    if (ref) {
      result.ref = ref;
    }

    var customerId = PCL.getCmp("editQueryCustomer").getIdValue();
    if (customerId) {
      result.customerId = customerId;
    }

    var fromDT = PCL.getCmp("editQueryFromDT").getValue();
    if (fromDT) {
      result.fromDT = PCL.Date.format(fromDT, "Y-m-d");
    }

    var toDT = PCL.getCmp("editQueryToDT").getValue();
    if (toDT) {
      result.toDT = PCL.Date.format(toDT, "Y-m-d");
    }

    var receivingType = PCL.getCmp("editQueryReceivingType").getValue();
    result.receivingType = receivingType;

    var goodsId = PCL.getCmp("editQueryGoods").getIdValue();
    if (goodsId) {
      result.goodsId = goodsId;
    }

    var userId = PCL.getCmp("editQueryUser").getIdValue();
    if (userId) {
      result.userId = userId;
    }

    return result;
  },

  onGenPOBill: function () {
    var me = this;

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要生成采购订单的销售订单");
      return;
    }
    var bill = item[0];

    if (bill.get("billStatus") < 1000) {
      me.showInfo("当前销售订单还没有审核通过，无法生成采购订单");
      return;
    }

    var funShowForm = function () {
      var form = PCL.create("PSI.PurchaseOrder.POEditForm", {
        parentForm: me,
        sobillRef: bill.get("ref"),
        genBill: true
      });
      form.show();
    };

    // 先判断是否已经生成过采购订单了
    // 如果已经生成过，就提醒用户
    var el = PCL.getBody();
    el.mask("正在查询是否已经生成过采购订单...");
    var r = {
      url: me.URL("Home/SaleOrder/getPOBillRefListBySOBillRef"),
      params: {
        soRef: bill.get("ref")
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = me.decodeJSON(response.responseText);
          if (data.length > 0) {
            //  已经生成过采购订单，提醒用户
            var poRefList = "";
            for (var i = 0; i < data.length; i++) {
              if (i > 0) {
                poRefList += "、";
              }
              poRefList += data[i].ref;
            }
            var info = "当前销售订单已经生成过采购订单，请确认是否继续生成新的采购订单？";
            info += "<br/>已经生成的采购订单单号是：";
            info += poRefList;
            me.confirm(info, funShowForm);
          } else {
            // 没有生成过采购订单，直接显示UI界面
            funShowForm();
          }
        } else {
          me.showInfo("网络错误");
        }
      }
    };
    me.ajax(r);
  },

  /**
   * 生成销售出库单
   */
  onGenWSBill: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要生成出库单的销售订单");
      return;
    }
    var bill = item[0];

    if (bill.get("billStatus") < 1000) {
      me.showInfo("当前销售订单还没有审核通过，无法生成销售出库单");
      return;
    }

    var funShowForm = function () {
      var form = PCL.create("PSI.Sale.WSEditForm", {
        genBill: true,
        sobillRef: bill.get("ref"),
        okDirect: me.URL("Home/SaleOrder/soIndex"),
      });
      form.show();
    };

    // 先判断是否已经生成过销售出库单了
    // 如果已经生成过，就提醒用户
    var el = PCL.getBody();
    el.mask("正在查询是否已经生成过销售出库单...");
    var r = {
      url: me.URL("Home/SaleOrder/getWSBillRefListBySOBillRef"),
      params: {
        soRef: bill.get("ref")
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = me.decodeJSON(response.responseText);
          if (data.length > 0) {
            //  已经生成过销售出库单，提醒用户
            var wsRefList = "";
            for (var i = 0; i < data.length; i++) {
              if (i > 0) {
                wsRefList += "、";
              }
              wsRefList += data[i].ref;
            }
            var info = "当前销售订单已经生成过销售出库单了，请确认是否继续生成新的销售出库单？";
            info += "<br/><br/>已经生成的销售出库单单号是：<br/>";
            info += wsRefList;
            me.confirm(info, funShowForm);
          } else {
            // 没有生成过销售出库单，直接显示UI界面
            funShowForm();
          }
        } else {
          me.showInfo("网络错误");
        }
      }
    };
    me.ajax(r);
  },

  onPDF: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要生成pdf文件的销售订单");
      return;
    }
    var bill = item[0];

    var url = me.URL("Home/SaleOrder/soBillPdf?ref=" + bill.get("ref"));
    window.open(url);
  },

  getWSGrid: function () {
    var me = this;
    if (me.__wsGrid) {
      return me.__wsGrid;
    }
    var modelName = "PSISOBill_WSBill";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "ref", "bizDate", "customerName",
        "warehouseName", "inputUserName", "bizUserName",
        "billStatus", "amount", "dateCreated",
        "receivingType", "memo"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__wsGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      title: "销售订单出库详情",
      viewConfig: {
        enableTextSelection: true
      },
      columnLines: true,
      columns: [{
        xtype: "rownumberer",
        width: 50
      }, {
        header: "状态",
        dataIndex: "billStatus",
        menuDisabled: true,
        sortable: false,
        width: 80,
        renderer: function (value) {
          if (value == "待出库") {
            return "<span style='color:red'>" + value
              + "</span>";
          } else if (value == "已退货") {
            return "<span style='color:blue'>" + value
              + "</span>";
          } else {
            return value;
          }
        }
      }, {
        header: "单号",
        dataIndex: "ref",
        width: 120,
        menuDisabled: true,
        sortable: false,
        renderer: function (value, md, record) {
          return "<a href='"
            + PSI.Const.BASE_URL
            + "Home/Bill/viewIndex?fid=2028&refType=销售出库&ref="
            + encodeURIComponent(record.get("ref"))
            + "' target='_blank'>" + value + "</a>";
        }
      }, {
        header: "业务日期",
        dataIndex: "bizDate",
        menuDisabled: true,
        sortable: false
      }, {
        header: "客户",
        dataIndex: "customerName",
        width: 300,
        menuDisabled: true,
        sortable: false
      }, {
        header: "收款方式",
        dataIndex: "receivingType",
        menuDisabled: true,
        sortable: false,
        width: 150,
        renderer: function (value) {
          if (value == 0) {
            return "记应收账款/月结现结";
          } else if (value == 1) {
            return "现金收款";
          } else if (value == 2) {
            return "用预收款支付";
          } else {
            return "";
          }
        }
      }, {
        header: "销售金额",
        dataIndex: "amount",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90
      }, {
        header: "出库仓库",
        dataIndex: "warehouseName",
        menuDisabled: true,
        sortable: false,
        width: 150
      }, {
        header: "业务员",
        dataIndex: "bizUserName",
        menuDisabled: true,
        sortable: false
      }, {
        header: "制单人",
        dataIndex: "inputUserName",
        menuDisabled: true,
        sortable: false
      }, {
        header: "制单时间",
        dataIndex: "dateCreated",
        width: 140,
        menuDisabled: true,
        sortable: false
      }, {
        header: "备注",
        dataIndex: "memo",
        width: 200,
        menuDisabled: true,
        sortable: false
      }],
      store: store
    });

    return me.__wsGrid;
  },

  refreshWSGrid: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var bill = item[0];

    var grid = me.getWSGrid();
    var el = grid.getEl();
    if (el) {
      el.mask(PSI.Const.LOADING);
    }

    var r = {
      url: me.URL("Home/SaleOrder/soBillWSBillList"),
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        var store = grid.getStore();

        store.removeAll();

        if (success) {
          var data = me.decodeJSON(response.responseText);
          store.add(data);
        }

        if (el) {
          el.unmask();
        }
      }
    };
    me.ajax(r);
  },

  onPrintPreview: function () {
    if (PSI.Const.ENABLE_LODOP != "1") {
      PSI.MsgBox.showInfo("请先在业务设置模块中启用Lodop打印");
      return;
    }

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("没有安装Lodop控件，无法打印");
      return;
    }

    var me = this;

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要打印的销售订单");
      return;
    }
    var bill = item[0];

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: PSI.Const.BASE_URL + "Home/SaleOrder/genSOBillPrintPage",
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.previewSOBill(bill.get("ref"), data);
        }
      }
    };
    me.ajax(r);
  },

  PRINT_PAGE_WIDTH: "216mm",
  PRINT_PAGE_HEIGHT: "140mm",

  previewSOBill: function (ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT("销售订单" + ref);
    lodop.SET_PRINT_PAGESIZE(1, me.PRINT_PAGE_WIDTH, me.PRINT_PAGE_HEIGHT,
      "");
    lodop.ADD_PRINT_HTM("0mm", "0mm", "100%", "100%", data);
    var result = lodop.PREVIEW("_blank");
  },

  onPrint: function () {
    if (PSI.Const.ENABLE_LODOP != "1") {
      PSI.MsgBox.showInfo("请先在业务设置模块中启用Lodop打印");
      return;
    }

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("没有安装Lodop控件，无法打印");
      return;
    }

    var me = this;

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要打印的销售订单");
      return;
    }
    var bill = item[0];

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: PSI.Const.BASE_URL + "Home/SaleOrder/genSOBillPrintPage",
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.printSOBill(bill.get("ref"), data);
        }
      }
    };
    me.ajax(r);
  },

  printSOBill: function (ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT("销售订单" + ref);
    lodop.SET_PRINT_PAGESIZE(1, me.PRINT_PAGE_WIDTH, me.PRINT_PAGE_HEIGHT,
      "");
    lodop.ADD_PRINT_HTM("0mm", "0mm", "100%", "100%", data);
    var result = lodop.PRINT();
  },

  onChangeOrder: function (grid, row) {
    var me = this;

    if (me.getPermission().confirm == "0") {
      me.showInfo("您没有订单变更的权限");
      return;
    }

    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要变更的销售订单");
      return;
    }
    var bill = item[0];
    if (parseInt(bill.get("billStatus")) >= 4000) {
      me.showInfo("订单已经关闭，不能再做变更操作");
      return;
    }

    var entity = grid.getStore().getAt(row);
    if (!entity) {
      me.showInfo("请选择要变更的明细记录");
      return;
    }

    var form = PCL.create("PSI.SaleOrder.ChangeOrderEditForm", {
      entity: entity,
      parentForm: me
    });
    form.show();
  },

  // 订单变更后刷新Grid
  refreshAterChangeOrder: function (detailId) {
    var me = this;

    me.refreshDetailGrid(detailId);

    // 刷新主表中金额相关字段
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var bill = item[0];

    var r = {
      url: me.URL("Home/SaleOrder/getSOBillDataAterChangeOrder"),
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {

        if (success) {
          var data = me.decodeJSON(response.responseText);
          if (data.goodsMoney) {
            bill.set("goodsMoney", data.goodsMoney);
            bill.set("tax", data.tax);
            bill.set("moneyWithTax", data.moneyWithTax);
            me.getMainGrid().getStore().commitChanges();
          }
        }
      }
    };
    me.ajax(r);
  },

  // 关闭订单
  onCloseSO: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要关闭的销售订单");
      return;
    }
    var bill = item[0];

    var info = "请确认是否关闭单号为: <span style='color:red'>" + bill.get("ref")
      + "</span> 的销售订单?";
    var id = bill.get("id");

    var funcConfirm = function () {
      var el = PCL.getBody();
      el.mask("正在提交中...");
      var r = {
        url: me.URL("Home/SaleOrder/closeSOBill"),
        params: {
          id: id
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(id);
              me.tip("成功关闭销售订单");
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };
      me.ajax(r);
    };
    me.confirm(info, funcConfirm);
  },

  // 取消关闭订单
  onCancelClosedSO: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要取消关闭状态的销售订单");
      return;
    }
    var bill = item[0];

    var info = "请确认是否取消单号为: <span style='color:red'>" + bill.get("ref")
      + "</span> 销售订单的关闭状态?";
    var id = bill.get("id");

    var funcConfirm = function () {
      var el = PCL.getBody();
      el.mask("正在提交中...");
      var r = {
        url: me.URL("Home/SaleOrder/cancelClosedSOBill"),
        params: {
          id: id
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(id);
              me.tip("成功取消销售订单关闭状态");
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      };
      me.ajax(r);
    };
    me.confirm(info, funcConfirm);
  }
});
