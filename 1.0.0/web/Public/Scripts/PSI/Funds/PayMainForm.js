/**
 * 应付账款 - 主界面
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Funds.PayMainForm", {
  extend: "PSI.AFX.BaseMainExForm",

  initComponent: function () {
    var me = this;

    Ext.define("PSICACategory", {
      extend: "Ext.data.Model",
      fields: ["id", "name"]
    });

    Ext.apply(me, {
      tbar: [{
        xtype: "displayfield",
        margin: "5 0 0 0",
        value: "往来单位："
      }, {
        cls: "PSI-toolbox",
        xtype: "combo",
        id: "comboCA",
        queryMode: "local",
        editable: false,
        valueField: "id",
        store: Ext.create("Ext.data.ArrayStore", {
          fields: ["id", "text"],
          data: [["supplier", "供应商"],
          ["customer", "客户"],
          /*["factory", "工厂"]*/]
        }),
        value: "supplier",
        listeners: {
          select: {
            fn: me.onComboCASelect,
            scope: me
          }
        }
      }, {
        xtype: "displayfield",
        margin: "5 0 0 0",
        value: "分类"
      }, {
        cls: "PSI-toolbox",
        xtype: "combobox",
        id: "comboCategory",
        queryMode: "local",
        editable: false,
        valueField: "id",
        displayField: "name",
        store: Ext.create("Ext.data.Store", {
          model: "PSICACategory",
          autoLoad: false,
          data: []
        })
      }, " ", "-", " ", {
        id: "editQueryLabel",
        xtype: "displayfield",
        margin: "5 0 0 0",
        value: "供应商 "
      }, {
        cls: "PSI-toolbox",
        id: "editSupplierQuery",
        xtype: "psi_supplierfield",
        width: 200,
        showModal: true
      }, {
        cls: "PSI-toolbox",
        id: "editCustomerQuery",
        xtype: "psi_customerfield",
        hidden: true,
        width: 200,
        showModal: true
      }, {
        cls: "PSI-toolbox",
        id: "editFactoryQuery",
        xtype: "psi_factoryfield",
        hidden: true,
        width: 200,
        showModal: true
      }, {
        text: "查询",
        //iconCls: "PSI-button-refresh",,
        handler: me.onQuery,
        scope: me
      }, {
        text: "清空查询条件",
        handler: me.onClearQuery,
        scope: me
      }, "-", {
        text: "关闭",
        handler: function () {
          me.closeWindow();
        }
      }],
      layout: "border",
      border: 0,
      items: [{
        region: "north",
        height: 2,
        border: 0,
      }, {
        region: "center",
        layout: "fit",
        border: 0,
        items: [me.getPayGrid()]
      }, {
        region: "south",
        layout: "border",
        border: 0,
        split: true,
        height: "50%",
        items: [{
          region: "center",
          border: 0,
          layout: "fit",
          items: [me.getPayDetailGrid()]
        }, {
          region: "east",
          layout: "fit",
          border: 0,
          width: "40%",
          split: true,
          items: [me.getPayRecordGrid()]
        }]
      }]

    });

    me.callParent(arguments);

    me.onComboCASelect();
  },

  getPayGrid: function () {
    var me = this;
    if (me.__payGrid) {
      return me.__payGrid;
    }

    Ext.define("PSIPay", {
      extend: "Ext.data.Model",
      fields: ["id", "caId", "code", "name", "payMoney", "billMoney",
        "actMoney", "balanceMoney"]
    });

    var store = Ext.create("Ext.data.Store", {
      model: "PSIPay",
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL + "Home/Funds/payList",
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: false,
      data: []
    });

    store.on("beforeload", function () {
      Ext.apply(store.proxy.extraParams, {
        caType: Ext.getCmp("comboCA").getValue(),
        categoryId: Ext.getCmp("comboCategory")
          .getValue(),
        customerId: Ext.getCmp("editCustomerQuery")
          .getIdValue(),
        supplierId: Ext.getCmp("editSupplierQuery")
          .getIdValue(),
        factoryId: Ext.getCmp("editFactoryQuery")
          .getIdValue()
      });
    });

    me.__payGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI-FC",
      bbar: ["->", {
        xtype: "pagingtoolbar",
        border: 0,
        store: store
      }],
      columnLines: true,
      columns: [{
        header: "编码",
        dataIndex: "code",
        menuDisabled: true,
        sortable: false
      }, {
        header: "名称",
        dataIndex: "name",
        menuDisabled: true,
        sortable: false,
        width: 300
      }, {
        header: "账单金额",
        dataIndex: "billMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 160
      }, {
        header: "应付金额",
        dataIndex: "payMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 160
      }, {
        header: "已付金额",
        dataIndex: "actMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 160
      }, {
        header: "未付金额",
        dataIndex: "balanceMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 160
      }],
      store: store,
      listeners: {
        select: {
          fn: me.onPayGridSelect,
          scope: me
        }
      }
    });

    return me.__payGrid;

  },

  getPayDetailGrid: function () {
    var me = this;
    if (me.__payDetailGrid) {
      return me.__payDetailGrid;
    }

    Ext.define("PSIPayDetail", {
      extend: "Ext.data.Model",
      fields: ["id", "payMoney", "billMoney", "actMoney", "balanceMoney","remark",
        "refType", "refNumber", "bizDT", "dateCreated"]
    });

    var store = Ext.create("Ext.data.Store", {
      model: "PSIPayDetail",
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL + "Home/Funds/payDetailList",
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: false,
      data: []
    });

    store.on("beforeload", function () {
      var item = me.getPayGrid().getSelectionModel()
        .getSelection();
      var pay;
      if (item == null || item.length != 1) {
        pay = null;
      } else {
        pay = item[0];
      }

      Ext.apply(store.proxy.extraParams, {
        caType: Ext.getCmp("comboCA").getValue(),
        caId: pay == null ? null : pay.get("caId")
      });
    });

    me.__payDetailGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI-HL",
      viewConfig: {
        enableTextSelection: true,
        getRowClass:function(record,index,p,ds) {
          var cls = 'white-row';
          if(record.data.balanceMoney <= 0)
          {
            cls = 'x-grid-record-green';
          }
          return cls;
        }
      },
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("业务单据")
      },
      bbar: ["->", {
        id:"pagingToobar",
        xtype: "pagingtoolbar",
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
          data: [["20"], ["50"], ["100"], ["300"],
            ["1000"]]
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
      }],
      columnLines: true,
      tbar: [{
        text: "修改应付金额",
        iconCls: "PSI-button-add-record",
        handler: me.onEditPay,
        scope: me,
        //hidden: me.getPReceivingPay() != '1', true : false,
      }],
      columns: [{
        header: "业务类型",
        dataIndex: "refType",
        menuDisabled: true,
        sortable: false,
        width: 120
      }, {
        header: "单号",
        dataIndex: "refNumber",
        menuDisabled: true,
        sortable: false,
        width: 120,
        renderer: function (value, md, record) {
          if (record.get("refType") == "应付账款期初建账") {
            return value;
          }

          return "<a href='"
            + PSI.Const.BASE_URL
            + "Home/Bill/viewIndex?fid=2005&refType="
            + encodeURIComponent(record
              .get("refType"))
            + "&ref="
            + encodeURIComponent(record
              .get("refNumber"))
            + "' target='_blank'>" + value
            + "</a>";
        }
      }, {
        header: "业务日期",
        dataIndex: "bizDT",
        menuDisabled: true,
        sortable: false
      }, {
        header: "账单金额",
        dataIndex: "billMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "应付金额",
        dataIndex: "payMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "已付金额",
        dataIndex: "actMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "未付金额",
        dataIndex: "balanceMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "备注",
        dataIndex: "remark",
        menuDisabled: true,
        sortable: false,
      }, {
        header: "创建时间",
        dataIndex: "dateCreated",
        menuDisabled: true,
        sortable: false,
        width: 140
      }],
      store: store,
      listeners: {
        select: {
          fn: me.onPayDetailGridSelect,
          scope: me
        },
        itemdblclick: {
          fn: me.onEditPay,
          scope: me
        }
      }
    });

    return me.__payDetailGrid;

  },

  getPayRecordGrid: function () {
    var me = this;
    if (me.__payRecordGrid) {
      return me.__payRecordGrid;
    }

    Ext.define("PSIPayRecord", {
      extend: "Ext.data.Model",
      fields: ["id", "actMoney", "bizDate", "bizUserName",
        "inputUserName", "dateCreated", "remark"]
    });

    var store = Ext.create("Ext.data.Store", {
      model: "PSIPayRecord",
      pageSize: 20,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL + "Home/Funds/payRecordList",
        reader: {
          root: 'dataList',
          totalProperty: 'totalCount'
        }
      },
      autoLoad: false,
      data: []
    });

    store.on("beforeload", function () {
      var payDetail
      var item = me.getPayDetailGrid().getSelectionModel().getSelection();
      if (item == null || item.length != 1) {
        payDetail = null;
      } else {
        payDetail = item[0];
      }

      Ext.apply(store.proxy.extraParams, {
        refType: payDetail == null ? null : payDetail
          .get("refType"),
        refNumber: payDetail == null ? null : payDetail
          .get("refNumber")
      });
    });

    me.__payRecordGrid = Ext.create("Ext.grid.Panel", {
      cls: "PSI-HL",
      header: {
        height: 30,
        title: me.formatGridHeaderTitle("付款记录")
      },
      tbar: [{
        text: "录入付款记录",
        iconCls: "PSI-button-add-record",
        handler: me.onAddPayment,
        scope: me
      }],
      bbar: ["->", {
        xtype: "pagingtoolbar",
        border: 0,
        store: store
      }],
      columnLines: true,
      columns: [{
        header: "付款日期",
        dataIndex: "bizDate",
        menuDisabled: true,
        sortable: false,
        width: 80
      }, {
        header: "付款金额",
        dataIndex: "actMoney",
        menuDisabled: true,
        sortable: false,
        align: "right",
        xtype: "numbercolumn"
      }, {
        header: "付款人",
        dataIndex: "bizUserName",
        menuDisabled: true,
        sortable: false,
        width: 80
      }, {
        header: "录入时间",
        dataIndex: "dateCreated",
        menuDisabled: true,
        sortable: false,
        width: 140
      }, {
        header: "录入人",
        dataIndex: "inputUserName",
        menuDisabled: true,
        sortable: false,
        width: 80
      }, {
        header: "备注",
        dataIndex: "remark",
        menuDisabled: true,
        sortable: false,
        width: 150
      }],
      store: store
    });

    return me.__payRecordGrid;
  },

  onComboCASelect: function () {
    var me = this;

    var caType = Ext.getCmp("comboCA").getValue();
    if (caType == "supplier") {
      // 供应商
      Ext.getCmp("editQueryLabel").setValue("供应商");
      Ext.getCmp("editSupplierQuery").setVisible(true);
      Ext.getCmp("editCustomerQuery").setVisible(false);
      Ext.getCmp("editFactoryQuery").setVisible(false);
    } else if (caType == "customer") {
      // 客户
      Ext.getCmp("editQueryLabel").setValue("客户");
      Ext.getCmp("editSupplierQuery").setVisible(false);
      Ext.getCmp("editCustomerQuery").setVisible(true);
      Ext.getCmp("editFactoryQuery").setVisible(false);
    } else {
      // 工厂
      Ext.getCmp("editQueryLabel").setValue("工厂");
      Ext.getCmp("editSupplierQuery").setVisible(false);
      Ext.getCmp("editCustomerQuery").setVisible(false);
      Ext.getCmp("editFactoryQuery").setVisible(true);
    }

    me.getPayGrid().getStore().removeAll();
    me.getPayDetailGrid().getStore().removeAll();
    me.getPayRecordGrid().getStore().removeAll();

    var el = Ext.getBody();
    el.mask(PSI.Const.LOADING);
    Ext.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/Funds/payCategoryList",
      params: {
        id: Ext.getCmp("comboCA").getValue()
      },
      method: "POST",
      callback: function (options, success, response) {
        var combo = Ext.getCmp("comboCategory");
        var store = combo.getStore();

        store.removeAll();

        if (success) {
          var data = Ext.JSON.decode(response.responseText);
          store.add(data);

          if (store.getCount() > 0) {
            combo.setValue(store.getAt(0).get("id"))
          }
        }

        el.unmask();
      }
    });
  },

  onQuery: function () {
    var me = this;
    me.getPayDetailGrid().getStore().removeAll();
    me.getPayRecordGrid().getStore().removeAll();
    me.getPayRecordGrid().setTitle(me.formatGridHeaderTitle("付款记录"));

    me.getPayGrid().getStore().loadPage(1);
  },

  onPayGridSelect: function () {
    var me = this;

    this.getPayRecordGrid().getStore().removeAll();
    this.getPayRecordGrid().setTitle(me.formatGridHeaderTitle("付款记录"));

    this.getPayDetailGrid().getStore().loadPage(1);
  },

  onPayDetailGridSelect: function () {
    var me = this;

    var grid = this.getPayRecordGrid();
    var item = this.getPayDetailGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      grid.setTitle(me.formatGridHeaderTitle("付款记录"));
      return null;
    }

    var payDetail = item[0];

    grid.setTitle(me.formatGridHeaderTitle(payDetail.get("refType")
      + " - 单号: " + payDetail.get("refNumber") + " 的付款记录"));
    grid.getStore().loadPage(1);
  },

  onAddPayment: function () {
    var me = this;
    var item = me.getPayDetailGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PSI.MsgBox.showInfo("请选择要做付款记录的业务单据");
      return;
    }

    var payDetail = item[0];

    var form = Ext.create("PSI.Funds.PaymentEditForm", {
      parentForm: me,
      payDetail: payDetail
    })
    form.show();
  },
  onEditPay: function () {
    var me = this;
    var item = me.getPayDetailGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      PSI.MsgBox.showInfo("请选择要修改应付金额的业务单据");
      return;
    }

    var payDetail = item[0];

    var form = Ext.create("PSI.Funds.PayEditForm", {
      parentForm: me,
      payDetail: payDetail
    })
    form.show();
  },
  refreshPayInfo: function () {
    var me = this;
    var item = me.getPayGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var pay = item[0];

    Ext.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/Funds/refreshPayInfo",
      method: "POST",
      params: {
        id: pay.get("id")
      },
      callback: function (options, success, response) {
        if (success) {
          var data = Ext.JSON.decode(response.responseText);
          pay.set("actMoney", data.actMoney);
          pay.set("balanceMoney", data.balanceMoney);
          pay.set("payMoney", data.payMoney);
          me.getPayGrid().getStore().commitChanges();
        }
      }

    });
  },

  refreshPayDetailInfo: function () {
    var me = this;
    var item = me.getPayDetailGrid().getSelectionModel().getSelection();
    if (item == null || item.length != 1) {
      return;
    }
    var payDetail = item[0];

    Ext.Ajax.request({
      url: PSI.Const.BASE_URL
        + "Home/Funds/refreshPayDetailInfo",
      method: "POST",
      params: {
        id: payDetail.get("id")
      },
      callback: function (options, success, response) {
        if (success) {
          var data = Ext.JSON.decode(response.responseText);
          payDetail.set("actMoney", data.actMoney);
          payDetail.set("balanceMoney", data.balanceMoney);
          payDetail.set("payMoney", data.payMoney);
          payDetail.set("remark", data.remark);
          me.getPayDetailGrid().getStore().commitChanges();
        }
      }

    });
  },

  onClearQuery: function () {
    var me = this;

    Ext.getCmp("editCustomerQuery").clearIdValue();
    Ext.getCmp("editSupplierQuery").clearIdValue();
    Ext.getCmp("editFactoryQuery").clearIdValue();
    me.onQuery();
  }

});
