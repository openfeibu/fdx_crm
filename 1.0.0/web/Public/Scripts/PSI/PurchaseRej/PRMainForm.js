/**
 * 采购退货出库 - 主界面
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.PurchaseRej.PRMainForm", {
  extend: "PSI.AFX.BaseMainExForm",

  config: {
    permission: null
  },

  initComponent: function () {
    var me = this;

    PCL.apply(me, {
      items: [{
        tbar: me.getToolbarCmp(),
        id: "panelQueryCmp",
        region: "north",
        height: 95,
        layout: "fit",
        header: false,
        border: 0,
        collapsible: true,
        collapseMode: "mini",
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
          border: 0,
          items: [me.getDetailGrid()]
        }]
      }]
    });

    me.callParent(arguments);

    me.refreshMainGrid();
  },

  getToolbarCmp: function () {
    var me = this;
    return [{
      text: "新建采购退货出库单",
      id: "buttonAdd",
      hidden: me.getPermission().add == "0",
      scope: me,
      handler: me.onAddBill
    }, {
      xtype: "tbseparator",
      hidden: me.getPermission().add == "0"
    }, {
      text: "编辑采购退货出库单",
      id: "buttonEdit",
      hidden: me.getPermission().edit == "0",
      scope: me,
      handler: me.onEditBill
    }, {
      xtype: "tbseparator",
      hidden: me.getPermission().edit == "0"
    }, {
      text: "删除采购退货出库单",
      id: "buttonDelete",
      hidden: me.getPermission().del == "0",
      scope: me,
      handler: me.onDeleteBill
    }, {
      xtype: "tbseparator",
      hidden: me.getPermission().del == "0"
    }, {
      text: "提交出库",
      id: "buttonCommit",
      hidden: me.getPermission().commit == "0",
      scope: me,
      handler: me.onCommit
    }, {
      xtype: "tbseparator",
      hidden: me.getPermission().commit == "0"
    }, {
      text: "导出",
      hidden: me.getPermission().genPDF == "0",
      menu: [{
        text: "单据生成pdf",
        id: "buttonPDF",
        iconCls: "PSI-button-pdf",
        scope: me,
        handler: me.onPDF
      }]
    }, {
      xtype: "tbseparator",
      hidden: me.getPermission().genPDF == "0"
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
        window.open(me.URL("Home/Help/index?t=prbill"));
      }
    }, "-",*/ {
      text: "关闭",
      handler: function () {
        me.closeWindow();
      }
    }].concat(me.getPagination());
  },

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
        data: [[-1, "全部"], [0, "待出库"], [1000, "已出库"]]
      }),
      value: -1
    }, {
      id: "editQueryRef",
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
      fieldLabel: "业务日期（起）"
    }, {
      id: "editQueryToDT",
      xtype: "datefield",
      margin: "5, 0, 0, 0",
      format: "Y-m-d",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "业务日期（止）"
    }, {
      id: "editQuerySupplier",
      xtype: "psi_supplierfield",
      showModal: true,
      labelAlign: "right",
      labelSeparator: "",
      margin: "5, 0, 0, 0",
      fieldLabel: "供应商"
    }, {
      id: "editQueryWarehouse",
      xtype: "psi_warehousefield",
      showModal: true,
      labelAlign: "right",
      labelSeparator: "",
      labelWidth: 60,
      margin: "5, 0, 0, 0",
      fieldLabel: "仓库"
    }, {
      id: "editQueryReceivingType",
      margin: "5, 0, 0, 0",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "收款方式",
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
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "物料",
      margin: "5, 0, 0, 0",
      xtype: "psi_goodsfield",
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

  refreshMainGrid: function (id) {
    var me = this;

    PCL.getCmp("buttonEdit").setDisabled(true);
    PCL.getCmp("buttonDelete").setDisabled(true);
    PCL.getCmp("buttonCommit").setDisabled(true);

    var gridDetail = me.getDetailGrid();
    gridDetail.setTitle(me.formatGridHeaderTitle("采购退货出库单明细"));
    gridDetail.getStore().removeAll();
    PCL.getCmp("pagingToobar").doRefresh();
    me.__lastId = id;
  },

  /**
   * 新增采购退货出库单
   */
  onAddBill: function () {
    var me = this;
    var form = PCL.create("PSI.PurchaseRej.PREditForm", {
      parentForm: me,
      viewPrice: me.getPermission().viewPrice == "1"
    });
    form.show();
  },

  /**
   * 编辑采购退货出库单
   */
  onEditBill: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要编辑的采购退货出库单");
      return;
    }
    var bill = item[0];
    var form = PCL.create("PSI.PurchaseRej.PREditForm", {
      parentForm: me,
      viewPrice: me.getPermission().viewPrice == "1",
      entity: bill
    });
    form.show();
  },

  /**
   * 删除采购退货出库单
   */
  onDeleteBill: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("请选择要删除的采购退货出库单");
      return;
    }
    var bill = item[0];

    if (bill.get("billStatus") == "已出库") {
      me.showInfo("当前采购退货出库单已经提交出库，不能删除");
      return;
    }

    var info = "请确认是否删除采购退货出库单: <span style='color:red'>" + bill.get("ref")
      + "</span>";

    me.confirm(info, function () {
      var el = PCL.getBody();
      el.mask("正在删除中...");
      me.ajax({
        url: me.URL("Home/PurchaseRej/deletePRBill"),
        params: {
          id: bill.get("id")
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid();
              me.tip("成功完成删除操作");
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }

      });
    });
  },

  /**
   * 提交采购退货出库单
   */
  onCommit: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要提交的采购退货出库单");
      return;
    }
    var bill = item[0];

    if (bill.get("billStatus") == "已出库") {
      me.showInfo("当前采购退货出库单已经提交出库，不能再次提交");
      return;
    }

    var info = "请确认是否提交单号: <span style='color:red'>" + bill.get("ref")
      + "</span> 的采购退货出库单?";
    me.confirm(info, function () {
      var el = PCL.getBody();
      el.mask("正在提交中...");
      me.ajax({
        url: me.URL("Home/PurchaseRej/commitPRBill"),
        params: {
          id: bill.get("id")
        },
        callback: function (options, success, response) {
          el.unmask();

          if (success) {
            var data = me.decodeJSON(response.responseText);
            if (data.success) {
              me.refreshMainGrid(data.id);
              me.tip("成功完成提交操作");
            } else {
              me.showInfo(data.msg);
            }
          } else {
            me.showInfo("网络错误");
          }
        }
      });
    });
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

  getMainGrid: function () {
    var me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    var modelName = "PSIPRBill";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "ref", "bizDT", "warehouseName",
        "supplierName", "inputUserName", "bizUserName",
        "billStatus", "rejMoney", "dateCreated",
        "receivingType", "billMemo", "tax", "rejMoneyWithTax"]
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
        url: me.URL("Home/PurchaseRej/prbillList"),
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
      border: 1,
      columnLines: true,
      columns: [{
        xtype: "rownumberer",
        text: "#",
        width: 40
      }, {
        header: "状态",
        dataIndex: "billStatus",
        menuDisabled: true,
        sortable: false,
        width: 60,
        renderer: function (value) {
          return value == "待出库"
            ? "<span style='color:red'>"
            + value + "</span>"
            : value;
        }
      }, {
        header: "单号",
        dataIndex: "ref",
        width: 110,
        menuDisabled: true,
        sortable: false
      }, {
        header: "业务日期",
        dataIndex: "bizDT",
        menuDisabled: true,
        sortable: false,
        width: 80,
        align: "center"
      }, {
        header: "供应商",
        dataIndex: "supplierName",
        menuDisabled: true,
        sortable: false,
        width: 300
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
        header: "出库仓库",
        dataIndex: "warehouseName",
        menuDisabled: true,
        sortable: false,
        width: 150
      }, {
        header: "退货金额", //退货金额(不含税)
        dataIndex: "rejMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 110,
        hidden: me.getPermission().viewPrice == "0",
      }, {
        header: "税金(红字)", hidden: true, //隐藏税金
        dataIndex: "tax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90
      }, {
        header: "退货金额(含税)", hidden: true, //隐藏
        dataIndex: "rejMoneyWithTax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 100
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
        dataIndex: "billMemo",
        width: 300,
        menuDisabled: true,
        sortable: false
      }],
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
      },
      store: store,
      // bbar: ["->", {
      //   id: "pagingToobar",
      //   xtype: "pagingtoolbar",
      //   border: 0,
      //   store: store
      // }, "-", {
      //     xtype: "displayfield",
      //     value: "每页显示"
      //   }, {
      //     id: "comboCountPerPage",
      //     xtype: "combobox",
      //     editable: false,
      //     width: 60,
      //     store: PCL.create("PCL.data.ArrayStore", {
      //       fields: ["text"],
      //       data: [["20"], ["50"], ["100"],
      //       ["300"], ["1000"]]
      //     }),
      //     value: 20,
      //     listeners: {
      //       change: {
      //         fn: function () {
      //           store.pageSize = Ext
      //             .getCmp("comboCountPerPage")
      //             .getValue();
      //           store.currentPage = 1;
      //           PCL.getCmp("pagingToobar")
      //             .doRefresh();
      //         },
      //         scope: me
      //       }
      //     }
      //   }, {
      //     xtype: "displayfield",
      //     value: "条记录"
      //   }]
    });

    return me.__mainGrid;
  },

  getDetailGrid: function () {
    var me = this;
    if (me.__detailGrid) {
      return me.__detailGrid;
    }

    var modelName = "PSIITBillDetail";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "goodsCode", "goodsName", "goodsSpec",
        "unitName", "rejCount", "rejPrice", "rejMoney",
        "memo", "tax", "taxRate", "rejPriceWithTax", "rejMoneyWithTax"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__detailGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      viewConfig: {
        enableTextSelection: true
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("采购退货出库单明细")
      },
      columnLines: true,
      columns: [PCL.create("PCL.grid.RowNumberer", {
        text: "#",
        width: 40
      }), {
        header: "物料编码",
        dataIndex: "goodsCode",
        menuDisabled: true,
        sortable: false
      }, {
        header: "品名/规格型号",
        dataIndex: "goodsName",
        menuDisabled: true,
        sortable: false,
        width: 330,
        renderer: function (value, metaData, record) {
          return record.get("goodsName") + " " + record.get("goodsSpec");
        }
      }, {
        header: "退货数量",
        dataIndex: "rejCount",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 80
      }, {
        header: "单位",
        dataIndex: "unitName",
        menuDisabled: true,
        sortable: false,
        width: 50,
        align: "center"
      }, {
        header: "退货单价", //退货单价(不含税)
        dataIndex: "rejPrice",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 110,
        xtype: "numbercolumn",
        hidden: me.getPermission().viewPrice == "0",
      }, {
        header: "退货金额", //退货金额(不含税)
        dataIndex: "rejMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 110,
        xtype: "numbercolumn",
        hidden: me.getPermission().viewPrice == "0",
      }, {
        header: "税率(%)", hidden: true, //隐藏税率
        dataIndex: "taxRate",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 60,
        xtype: "numbercolumn",
        format: "#"
      }, {
        header: "税金(红字)", hidden: true, //隐藏税金
        dataIndex: "tax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 90,
        xtype: "numbercolumn"
      }, {
        header: "退货单价(含税)", hidden: true, //隐藏退货单价(含税)
        dataIndex: "rejPriceWithTax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 110,
        xtype: "numbercolumn"
      }, {
        header: "退货金额(含税)", hidden: true, //隐藏退货金额(含税)
        dataIndex: "rejMoneyWithTax",
        menuDisabled: true,
        sortable: false,
        align: "right",
        width: 110,
        xtype: "numbercolumn"
      }, {
        header: "备注",
        dataIndex: "memo",
        menuDisabled: true,
        sortable: false,
        width: 200
      }],
      store: store
    });

    return me.__detailGrid;
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

  onMainGridSelect: function () {
    var me = this;
    me.getDetailGrid().setTitle(me.formatGridHeaderTitle("采购退货出库单明细"));
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PCL.getCmp("buttonEdit").setDisabled(true);
      PCL.getCmp("buttonDelete").setDisabled(true);
      PCL.getCmp("buttonCommit").setDisabled(true);

      return;
    }
    var bill = item[0];

    var commited = bill.get("billStatus") == "已出库";
    PCL.getCmp("buttonDelete").setDisabled(commited);
    PCL.getCmp("buttonCommit").setDisabled(commited);

    var buttonEdit = PCL.getCmp("buttonEdit");
    buttonEdit.setDisabled(false);
    if (commited) {
      buttonEdit.setText("查看采购退货出库单");
    } else {
      buttonEdit.setText("编辑采购退货出库单");
    }

    me.refreshDetailGrid();
  },

  refreshDetailGrid: function (id) {
    var me = this;
    me.getDetailGrid().setTitle(me.formatGridHeaderTitle("采购退货出库单明细"));
    var grid = me.getMainGrid();
    var item = grid.getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var bill = item[0];

    grid = me.getDetailGrid();
    grid.setTitle(me.formatGridHeaderTitle("单号: " + bill.get("ref")
      + " 出库仓库: " + bill.get("warehouseName")));
    var el = grid.getEl();
    el.mask(PSI.Const.LOADING);
    me.ajax({
      url: me.URL("Home/PurchaseRej/prBillDetailList"),
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
    });
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

  onQuery: function () {
    var me = this;

    me.getMainGrid().getStore().currentPage = 1;
    me.refreshMainGrid();
  },

  onClearQuery: function () {
    var me = this;

    PCL.getCmp("editQueryBillStatus").setValue(-1);
    PCL.getCmp("editQueryRef").setValue(null);
    PCL.getCmp("editQueryFromDT").setValue(null);
    PCL.getCmp("editQueryToDT").setValue(null);
    PCL.getCmp("editQuerySupplier").clearIdValue();
    PCL.getCmp("editQueryWarehouse").clearIdValue();
    PCL.getCmp("editQueryReceivingType").setValue(-1);
    PCL.getCmp("editQueryGoods").clearIdValue();

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

    var supplierId = PCL.getCmp("editQuerySupplier").getIdValue();
    if (supplierId) {
      result.supplierId = supplierId;
    }

    var warehouseId = PCL.getCmp("editQueryWarehouse").getIdValue();
    if (warehouseId) {
      result.warehouseId = warehouseId;
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

    return result;
  },

  onPDF: function () {
    var me = this;
    var item = me.getMainGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      me.showInfo("没有选择要生成pdf文件的采购退货出库单");
      return;
    }
    var bill = item[0];

    var url = PSI.Const.BASE_URL + "Home/PurchaseRej/prBillPdf?ref="
      + bill.get("ref");
    window.open(url);
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
      me.showInfo("没有选择要打印的采购退货出库单");
      return;
    }
    var bill = item[0];

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: PSI.Const.BASE_URL + "Home/PurchaseRej/genPRBillPrintPage",
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.previewPRBill(bill.get("ref"), data);
        }
      }
    };
    me.ajax(r);
  },

  PRINT_PAGE_WIDTH: "216mm",
  PRINT_PAGE_HEIGHT: "140mm",

  previewPRBill: function (ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT("采购退货出库单" + ref);
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
      me.showInfo("没有选择要打印的采购退货出库单");
      return;
    }
    var bill = item[0];

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: PSI.Const.BASE_URL + "Home/PurchaseRej/genPRBillPrintPage",
      params: {
        id: bill.get("id")
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.printPRBill(bill.get("ref"), data);
        }
      }
    };
    me.ajax(r);
  },

  printPRBill: function (ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT("采购入库单" + ref);
    lodop.SET_PRINT_PAGESIZE(1, me.PRINT_PAGE_WIDTH, me.PRINT_PAGE_HEIGHT,
      "");
    lodop.ADD_PRINT_HTM("0mm", "0mm", "100%", "100%", data);
    var result = lodop.PRINT();
  }
});
