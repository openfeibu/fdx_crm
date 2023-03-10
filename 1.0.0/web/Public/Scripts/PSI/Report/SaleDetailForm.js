/**
 * 销售出库明细表
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Report.SaleDetailForm", {
  extend: "PSI.AFX.BaseMainExForm",

  initComponent: function () {
    var me = this;

    var store = me.getMainGrid().getStore();

    PCL.apply(me, {
      tbar: [{
        id: "pagingToobar",
        cls: "PSI-toolbox",
        xtype: "pagingtoolbar",
        border: 0,
        store: store
      }, "-", {
        xtype: "displayfield",
        value: "每页显示"
      }, {
        id: "comboCountPerPage",
        cls: "PSI-toolbox",
        xtype: "combobox",
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
        value: "条记录"
      }, "-", {
        text: "查询",
        //iconCls: "PSI-button-refresh",,
        handler: me.onQuery,
        scope: me
      }, "-", {
        text: "打印",hidden: true,
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
        text: "导出",
        menu: [{
          text: "导出PDF",
          iconCls: "PSI-button-pdf",
          scope: me,
          handler: me.onPDF
        }, "-", {
          text: "导出Excel",
          iconCls: "PSI-button-excel",
          scope: me,
          handler: me.onExcel
        }]
      }, "-", {
        text: "关闭",
        handler: function () {
          me.closeWindow();
        }
      }],
      items: [{
        id: "panelQueryCmp",
        region: "north",
        height: 65,
        layout: "fit",
        border: 0,
        header: false,
        collapsible: true,
        collapseMode: "mini",
        layout: {
          type: "table",
          columns: 4
        },
        items: me.getQueryCmp()
      }, {
        region: "center",
        layout: "fit",
        items: [me.getMainGrid()]
      }]
    });

    me.callParent(arguments);
  },

  getQueryCmp: function () {
    var me = this;

    PCL.define("PSILogCategory", {
      extend: "PCL.data.Model",
      fields: ["id", "name"]
    });

    return [{
      id: "editQueryCustomer",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "客户",
      margin: "5, 0, 0, 0",
      showModal: true,
      xtype: "psi_customerfield"
    }, {
      id: "editQueryWarehouse",
      labelAlign: "right",
      labelSeparator: "",
      fieldLabel: "出库仓库",
      margin: "5, 0, 0, 0",
      showModal: true,
      xtype: "psi_warehousefield"
    }, {
      xtype: "container",
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
      }]
    }, {
      xtype: "container",
      items: [{
        xtype: "button",
        iconCls: "PSI-button-hide",
        text: "隐藏查询条件栏",
        width: 130,
        height: 26,
        margin: "5 0 0 10",
        handler: function () {
          PCL.getCmp("panelQueryCmp").collapse();
        },
        scope: me
      }]
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
    }];
  },

  getMainGrid: function () {
    var me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    var modelName = "PSISaleDetailReport";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["customerName", "soBillRef", "wsBillRef", "bizDate", "warehouseName", "goodsCode",
        "goodsName", "goodsSpec", "unitName", { name: "goodsCount", type: "float"} , { name: "goodsMoney", type: "float"},
        "goodsPrice", "memo", "taxRate", "tax",
        "moneyWithTax", "goodsPriceWithTax"]
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
        url: me.URL("Home/Report/saleDetailQueryData"),
        reader: {
          root: "dataList",
          totalProperty: "totalCount"
        }
      }
    });
    store.on("beforeload", function () {
      store.proxy.extraParams = me.getQueryParam();
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
      border: 0,
      columnLines: true,
      columns: {
        defaults: {
          menuDisabled: true,
          sortable: false
        },
        items: [{
          xtype: "rownumberer",
          width: 50
        }, {
          header: "销售订单号",
          dataIndex: "soBillRef",
          width: 120,
          renderer: function (value, md, record) {
            return "<a href='"
              + PSI.Const.BASE_URL
              + "Home/Bill/viewIndex?fid=2027&refType="
              + encodeURIComponent("销售订单")
              + "&ref="
              + encodeURIComponent(record.get("soBillRef"))
              + "' target='_blank'>" + value
              + "</a>";
          }
        }, {
          header: "出库单单号",
          dataIndex: "wsBillRef",
          width: 120,
          renderer: function (value, md, record) {
            return "<a href='"
              + PSI.Const.BASE_URL
              + "Home/Bill/viewIndex?fid=2001&refType="
              + encodeURIComponent("销售出库")
              + "&ref="
              + encodeURIComponent(record.get("wsBillRef"))
              + "' target='_blank'>" + value
              + "</a>";
          }
        }, {
          header: "出库单业务日期",
          dataIndex: "bizDate",
          width: 120
        }, {
          header: "出库仓库",
          dataIndex: "warehouseName",
          width: 120
        }, {
          header: "客户",
          dataIndex: "customerName",
          width: 200
        }, {
          header: "商品编码",
          dataIndex: "goodsCode",
          width: 120
        }, {
          header: "商品名称",
          dataIndex: "goodsName",
          width: 200
        }, {
          header: "规格型号",
          dataIndex: "goodsSpec",
          width: 200
        }, {
          header: "出库数量",
          width: 120,
          dataIndex: "goodsCount",
          align: "right",
          summaryType: "sum"
        }, {
          header: "单位",
          dataIndex: "unitName",
          width: 60
        }, {
          header: "单价",
          dataIndex: "goodsPrice",
          align: "right",
          xtype: "numbercolumn",
          width: 150
        }, {
          header: "销售金额",
          dataIndex: "goodsMoney",
          align: "right",
          xtype: "numbercolumn",
          width: 150,
          summaryType: "sum"
        }, {
          header: "税率(%)", hidden: true, //隐藏税率
          dataIndex: "taxRate",
          align: "right",
          xtype: "numbercolumn",
          format: "0"
        }, {
          header: "税金", hidden: true, //隐藏税金
          dataIndex: "tax",
          align: "right",
          xtype: "numbercolumn",
          width: 150
        }, {
          header: "价税合计", hidden: true, //价税合计
          dataIndex: "moneyWithTax",
          align: "right",
          xtype: "numbercolumn",
          width: 150
        }, {
          header: "含税价", hidden: true, //隐藏含税价
          dataIndex: "goodsPriceWithTax",
          align: "right",
          xtype: "numbercolumn",
          width: 150
        }, {
          header: "备注",
          dataIndex: "memo",
          width: 200
        }]
      },
      store: store
    });

    return me.__mainGrid;
  },

  onQuery: function () {
    this.refreshMainGrid();
  },

  getQueryParam: function () {
    var result = {
      customerId: PCL.getCmp("editQueryCustomer").getIdValue(),
      warehouseId: PCL.getCmp("editQueryWarehouse").getIdValue()
    };

    var fromDT = PCL.getCmp("editQueryFromDT").getValue();
    if (fromDT) {
      result.fromDT = PCL.Date.format(fromDT, "Y-m-d");
    }

    var toDT = PCL.getCmp("editQueryToDT").getValue();
    if (toDT) {
      result.toDT = PCL.Date.format(toDT, "Y-m-d");
    }

    return result;
  },

  onClearQuery: function () {
    var me = this;

    PCL.getCmp("editQueryCustomer").clearIdValue();
    PCL.getCmp("editQueryWarehouse").clearIdValue();
    PCL.getCmp("editQueryFromDT").setValue(null);
    PCL.getCmp("editQueryToDT").setValue(null);

    me.getMainGrid().getStore().currentPage = 1;

    me.onQuery();
  },

  refreshMainGrid: function (id) {
    PCL.getCmp("pagingToobar").doRefresh();
  },

  onPrintPreview: function () {
    var me = this;
    me.showInfo("TODO");
    return;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("没有安装Lodop控件，无法打印");
      return;
    }

    var me = this;

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: me.URL("Home/Report/genInventoryUpperPrintPage"),
      params: {
        limit: -1
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.previewReport("采购入库明细表", data);
        }
      }
    };
    me.ajax(r);
  },

  PRINT_PAGE_WIDTH: "216mm",
  PRINT_PAGE_HEIGHT: "140mm",

  previewReport: function (ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT(ref);
    lodop.SET_PRINT_PAGESIZE(1, me.PRINT_PAGE_WIDTH, me.PRINT_PAGE_HEIGHT,
      "");
    lodop.ADD_PRINT_HTM("0mm", "0mm", "100%", "100%", data);
    var result = lodop.PREVIEW("_blank");
  },

  onPrint: function () {
    var me = this;
    me.showInfo("TODO");
    return;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("没有安装Lodop控件，无法打印");
      return;
    }

    var me = this;

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: me.URL("Home/Report/genPurchaseDetailPrintPage"),
      params: {
        limit: -1
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.printReport("采购入库明细表", data);
        }
      }
    };
    me.ajax(r);
  },

  printReport: function (ref, data) {
    var me = this;

    var lodop = getLodop();
    if (!lodop) {
      PSI.MsgBox.showInfo("Lodop打印控件没有正确安装");
      return;
    }

    lodop.PRINT_INIT(ref);
    lodop.SET_PRINT_PAGESIZE(1, me.PRINT_PAGE_WIDTH, me.PRINT_PAGE_HEIGHT,
      "");
    lodop.ADD_PRINT_HTM("0mm", "0mm", "100%", "100%", data);
    var result = lodop.PRINT();
  },

  onPDF: function () {
    var me = this;

    var url = "Home/Report/saleDetailPdf?limit=-1";
    var customerId = PCL.getCmp("editQueryCustomer").getIdValue();
    if (customerId) {
      url = url + "&customerId=" + customerId;
    }
    var warehouseId = PCL.getCmp("editQueryWarehouse").getIdValue();
    if (warehouseId) {
      url = url + "&warehouseId=" + warehouseId;
    }
    var fromDT = PCL.getCmp("editQueryFromDT").getValue();
    if (fromDT) {
      var dt = PCL.Date.format(fromDT, "Y-m-d");
      url = url + "&fromDT=" + dt;
    }
    var toDT = PCL.getCmp("editQueryToDT").getValue();
    if (toDT) {
      var dt = PCL.Date.format(toDT, "Y-m-d");
      url = url + "&toDT=" + dt;
    }

    window.open(me.URL(url));
  },

  onExcel: function () {
    var me = this;

    var url = "Home/Report/saleDetailExcel?limit=-1";
    var customerId = PCL.getCmp("editQueryCustomer").getIdValue();
    if (customerId) {
      url = url + "&customerId=" + customerId;
    }
    var warehouseId = PCL.getCmp("editQueryWarehouse").getIdValue();
    if (warehouseId) {
      url = url + "&warehouseId=" + warehouseId;
    }
    var fromDT = PCL.getCmp("editQueryFromDT").getValue();
    if (fromDT) {
      var dt = PCL.Date.format(fromDT, "Y-m-d");
      url = url + "&fromDT=" + dt;
    }
    var toDT = PCL.getCmp("editQueryToDT").getValue();
    if (toDT) {
      var dt = PCL.Date.format(toDT, "Y-m-d");
      url = url + "&toDT=" + dt;
    }

    window.open(me.URL(url));
  }
});
