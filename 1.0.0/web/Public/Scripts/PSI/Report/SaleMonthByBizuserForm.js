/**
 * 销售月报表(按业务员汇总)
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Report.SaleMonthByBizuserForm", {
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
        id: "editQueryYear",
        cls: "PSI-toolbox",
        xtype: "numberfield",
        margin: "5, 0, 0, 0",
        labelAlign: "right",
        labelSeparator: "",
        fieldLabel: "年",
        labelWidth: 20,
        width: 100,
        value: (new Date()).getFullYear()
      }, {
        id: "editQueryMonth",
        cls: "PSI-toolbox",
        xtype: "combobox",
        margin: "5, 0, 0, 0",
        labelAlign: "right",
        labelSeparator: "",
        labelWidth: 20,
        fieldLabel: " ",
        store: PCL.create("PCL.data.ArrayStore", {
          fields: ["id", "text"],
          data: [[1, "一月"], [2, "二月"],
          [3, "三月"], [4, "四月"],
          [5, "五月"], [6, "六月"],
          [7, "七月"], [8, "八月"],
          [9, "九月"], [10, "十月"],
          [11, "十一月"], [12, "十二月"]]
        }),
        valueField: "id",
        displayFIeld: "text",
        queryMode: "local",
        editable: false,
        value: (new Date()).getMonth() + 1,
        width: 90
      }, " ", {
        text: "查询",
        //iconCls: "PSI-button-refresh",,
        handler: me.onQuery,
        scope: me
      }, {
        text: "重置查询条件",
        handler: me.onClearQuery,
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
        region: "center",
        layout: "border",
        border: 0,
        items: [{
          region: "center",
          layout: "fit",
          border: 0,
          items: [me.getMainGrid()]
        }, {
          region: "south",
          layout: "fit",
          height: 100,
          items: [me.getSummaryGrid()]
        }]
      }]
    });

    me.callParent(arguments);
  },

  getMainGrid: function () {
    var me = this;
    if (me.__mainGrid) {
      return me.__mainGrid;
    }

    var modelName = "PSIReportSaleMonthByBizuser";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["bizDT", "userCode", "userName", "saleMoney",
        "rejMoney", "m", "profit", "rate"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: [],
      pageSize: 20,
      remoteSort: true,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL
          + "Home/Report/saleMonthByBizuserQueryData",
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
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
      border: 0,
      columnLines: true,
      columns: [{
        xtype: "rownumberer"
      }, {
        header: "月份",
        dataIndex: "bizDT",
        menuDisabled: true,
        sortable: false,
        width: 80
      }, {
        header: "业务员编码",
        dataIndex: "userCode",
        menuDisabled: true,
        sortable: true
      }, {
        header: "业务员",
        dataIndex: "userName",
        menuDisabled: true,
        sortable: false
      }, {
        header: "销售出库金额",
        dataIndex: "saleMoney",
        menuDisabled: true,
        sortable: true,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "退货入库金额",
        dataIndex: "rejMoney",
        menuDisabled: true,
        sortable: true,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "净销售金额",
        dataIndex: "m",
        menuDisabled: true,
        sortable: true,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "毛利",
        dataIndex: "profit",
        menuDisabled: true,
        sortable: true,
        align: "right",
        xtype: "numbercolumn"
      },{
        header: "毛利率",
        dataIndex: "rate",
        menuDisabled: true,
        sortable: true,
        align: "right"
      }],
      store: store
    });

    return me.__mainGrid;
  },

  getSummaryGrid: function () {
    var me = this;
    if (me.__summaryGrid) {
      return me.__summaryGrid;
    }

    var modelName = "PSIReportSaleMonthByBizuserSummary";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["bizDT", "saleMoney", "rejMoney", "m", "profit",
        "rate"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__summaryGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("月销售汇总")
      },
      viewConfig: {
        enableTextSelection: true
      },
      border: 0,
      columnLines: true,
      columns: [{
        header: "月份",
        dataIndex: "bizDT",
        menuDisabled: true,
        sortable: false,
        width: 80
      }, {
        header: "销售出库金额",
        dataIndex: "saleMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "退货入库金额",
        dataIndex: "rejMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "净销售金额",
        dataIndex: "m",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "毛利",
        dataIndex: "profit",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      },{
        header: "毛利率",
        dataIndex: "rate",
        menuDisabled: true,
        sortable: false,
        align: "right"
      }],
      store: store
    });

    return me.__summaryGrid;
  },

  onQuery: function () {
    this.refreshMainGrid();
    this.refreshSummaryGrid();
  },

  refreshSummaryGrid: function () {
    var me = this;
    var grid = me.getSummaryGrid();
    var el = grid.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL
        + "Home/Report/saleMonthByBizuserSummaryQueryData",
      params: me.getQueryParam(),
      method: "POST",
      callback: function (options, success, response) {
        var store = grid.getStore();

        store.removeAll();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);
          store.add(data);
        }

        el.unmask();
      }
    });
  },

  onClearQuery: function () {
    var me = this;

    PCL.getCmp("editQueryYear").setValue((new Date()).getFullYear());
    PCL.getCmp("editQueryMonth").setValue((new Date()).getMonth() + 1);

    me.onQuery();
  },

  getQueryParam: function () {
    var me = this;

    var result = {};

    var year = PCL.getCmp("editQueryYear").getValue();
    if (year) {
      result.year = year;
    } else {
      year = (new Date()).getFullYear();
      PCL.getCmp("editQueryYear").setValue(year);
      result.year = year;
    }

    var month = PCL.getCmp("editQueryMonth").getValue();
    if (month) {
      result.month = month;
    } else {
      month = (new Date()).getMonth() + 1;
      PCL.getCmp("editQueryMonth").setValue(month);
      result.month = month;
    }

    return result;
  },

  refreshMainGrid: function (id) {
    PCL.getCmp("pagingToobar").doRefresh();
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

    var store = me.getMainGrid().getStore();
    var sorter = null;
    if (store.sorters.getCount() > 0) {
      sorter = PCL.JSON.encode([store.sorters.getAt(0)]);
    }

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: PSI.Const.BASE_URL
        + "Home/Report/genSaleMonthByBizuserPrintPage",
      params: {
        year: PCL.getCmp("editQueryYear").getValue(),
        month: PCL.getCmp("editQueryMonth").getValue(),
        sort: sorter,
        limit: -1
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.previewReport("销售月报表(按业务员汇总)", data);
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

    var store = me.getMainGrid().getStore();
    var sorter = null;
    if (store.sorters.getCount() > 0) {
      sorter = PCL.JSON.encode([store.sorters.getAt(0)]);
    }

    var el = PCL.getBody();
    el.mask("数据加载中...");
    var r = {
      url: PSI.Const.BASE_URL
        + "Home/Report/genSaleMonthByBizuserPrintPage",
      params: {
        year: PCL.getCmp("editQueryYear").getValue(),
        month: PCL.getCmp("editQueryMonth").getValue(),
        sort: sorter,
        limit: -1
      },
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = response.responseText;
          me.printReport("销售月报表(按业务员汇总)", data);
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

    var store = me.getMainGrid().getStore();
    var sorter = null;
    if (store.sorters.getCount() > 0) {
      sorter = PCL.JSON.encode([store.sorters.getAt(0)]);
    }

    var year = PCL.getCmp("editQueryYear").getValue();
    var month = PCL.getCmp("editQueryMonth").getValue();

    var url = "Home/Report/saleMonthByBizuserPdf?limit=-1&year=" + year
      + "&month=" + month;
    if (sorter) {
      url += "&sort=" + sorter;
    }

    window.open(me.URL(url));
  },

  onExcel: function () {
    var me = this;

    var store = me.getMainGrid().getStore();
    var sorter = null;
    if (store.sorters.getCount() > 0) {
      sorter = PCL.JSON.encode([store.sorters.getAt(0)]);
    }

    var year = PCL.getCmp("editQueryYear").getValue();
    var month = PCL.getCmp("editQueryMonth").getValue();

    var url = "Home/Report/saleMonthByBizuserExcel?limit=-1&year=" + year
      + "&month=" + month;
    if (sorter) {
      url += "&sort=" + sorter;
    }

    window.open(me.URL(url));
  }
});
