/**
 * 采购订单 - 新增或编辑界面
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.PurchaseOrder.POEditForm", {
  extend: "PSI.AFX.BaseDialogForm",

  config: {
    showAddGoodsButton: "0",
    genBill: false,
    sobillRef: null
  },

  mixins: ["PSI.Mix.GoodsPrice"],

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;
    me.__readOnly = false;
    var entity = me.getEntity();
    me.adding = entity == null;

    var title = entity == null ? "新建采购订单" : "编辑采购订单";
    title = me.formatTitle(title);

    PCL.apply(me, {
      header: {
        title: title,
        height: 40
      },
      maximized: true,
      width: 1000,
      height: 600,
      layout: "border",
      defaultFocus: "editSupplier",
      tbar: [{
        text: "保存",
        id: "buttonSave",
        //iconCls: "PSI-button-ok",
        handler: me.onOK,
        scope: me
      }, "-", {
        text: "取消",
        id: "buttonCancel",
        handler: function () {
          if (me.__readonly) {
            me.close();
            return;
          }

          PSI.MsgBox.confirm("请确认是否取消当前操作？", function () {
            me.close();
          });
        },
        scope: me
      }, "->", /*{
        text: "表单通用操作指南",
        iconCls: "PSI-help",
        handler: function () {
          me.focus();
          window.open(me.URL("Home/Help/index?t=commBill"));
        }
      }, "-",*/ /*{
        fieldLabel: "快捷访问",
        labelSeparator: "",
        margin: "5 5 5 0",
        cls: "PSI-toolbox",
        labelAlign: "right",
        labelWidth: 50,
        emptyText: "双击此处弹出选择框",
        xtype: "psi_mainmenushortcutfield"
      }*/],
      items: [{
        region: "center",
        layout: "fit",
        border: 0,
        bodyPadding: 10,
        items: [me.getGoodsGrid()]
      }, {
        region: "north",
        id: "editForm",
        layout: {
          type: "table",
          columns: 4
        },
        height: 120,
        bodyPadding: 10,
        border: 0,
        items: [{
          xtype: "hidden",
          id: "hiddenId",
          name: "id",
          value: entity == null ? null : entity
            .get("id")
        }, {
          id: "editRef",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "单号",
          xtype: "displayfield",
          value: me.toFieldNoteText("保存后自动生成")
        }, {
          id: "editDealDate",
          fieldLabel: "交货日期",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          allowBlank: false,
          blankText: "没有输入交货日期",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          xtype: "datefield",
          format: "Y-m-d",
          value: new Date(),
          name: "bizDT",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editSupplier",
          colspan: 2,
          width: 430,
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          xtype: "psi_supplierfield",
          fieldLabel: "供应商",
          allowBlank: false,
          blankText: "没有输入供应商",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          showAddButton: true,
          callbackFunc: me.__setSupplierExtData,
          callbackScope: me
        }, {
          id: "editDealAddress",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "交货地址",
          colspan: 2,
          width: 430,
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editContact",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "联系人",
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editTel",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "电话",
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editFax",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "传真",
          xtype: "textfield",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editOrg",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "组织机构",
          xtype: "psi_orgwithdataorgfield",
          colspan: 2,
          width: 430,
          allowBlank: false,
          blankText: "没有输入组织机构",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editBizUser",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "业务员",
          xtype: "psi_userfield",
          allowBlank: false,
          blankText: "没有输入业务员",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editPaymentType",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "付款方式",
          xtype: "combo",
          queryMode: "local",
          editable: false,
          valueField: "id",
          store: PCL.create("PCL.data.ArrayStore", {
            fields: ["id", "text"],
            data: [["0", "记应付账款"],
            ["1", "现金付款"],
            /*["2", "预付款"]*/]
          }),
          value: "0",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editBillMemo",
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          fieldLabel: "备注",
          xtype: "textfield",
          colspan: 3,
          width: 645,
          listeners: {
            specialkey: {
              fn: me.onLastEditSpecialKey,
              scope: me
            }
          }
        }]
      }],
      listeners: {
        show: {
          fn: me.onWndShow,
          scope: me
        },
        close: {
          fn: me.onWndClose,
          scope: me
        }
      }
    });

    me.callParent(arguments);

    me.__editorList = ["editDealDate", "editSupplier", "editDealAddress",
      "editContact", "editTel", "editFax", "editOrg", "editBizUser",
      "editPaymentType", "editBillMemo"];
  },

  onWindowBeforeUnload: function (e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndClose: function () {
    // 加上这个调用是为了解决 #IMQB2 - https://gitee.com/crm8000/PSI/issues/IMQB2
    // 这个只是目前的临时应急方法，实现的太丑陋了
    PCL.WindowManager.hideAll();

    PCL.get(window).un('beforeunload', this.onWindowBeforeUnload);
  },

  onWndShow: function () {
    PCL.get(window).on('beforeunload', this.onWindowBeforeUnload);

    var me = this;

    var el = me.getEl() || PCL.getBody();
    el.mask(PSI.Const.LOADING);
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/PurchaseOrder/poBillInfo",
      params: {
        id: PCL.getCmp("hiddenId").getValue(),
        genBill: me.getGenBill(),
        sobillRef: me.getSobillRef()
      },
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);

          if (data.ref) {
            PCL.getCmp("editRef").setValue(me.toFieldNoteText(data.ref));
            PCL.getCmp("editSupplier").setIdValue(data.supplierId);
            PCL.getCmp("editSupplier").setValue(data.supplierName);
            PCL.getCmp("editBillMemo").setValue(data.billMemo);
            PCL.getCmp("editDealDate").setValue(data.dealDate);
            PCL.getCmp("editDealAddress").setValue(data.dealAddress);
            PCL.getCmp("editContact").setValue(data.contact);
            PCL.getCmp("editTel").setValue(data.tel);
            PCL.getCmp("editFax").setValue(data.fax);
          }

          PCL.getCmp("editBizUser").setIdValue(data.bizUserId);
          PCL.getCmp("editBizUser").setValue(data.bizUserName);
          if (data.orgId) {
            PCL.getCmp("editOrg").setIdValue(data.orgId);
            PCL.getCmp("editOrg").setValue(data.orgFullName);
          }

          if (data.paymentType) {
            PCL.getCmp("editPaymentType").setValue(data.paymentType);
          }

          var store = me.getGoodsGrid().getStore();
          store.removeAll();
          if (data.items) {
            store.add(data.items);
          }
          if (store.getCount() == 0) {
            store.add({});
          }

          if (data.billStatus && data.billStatus != 0) {
            me.setBillReadonly();
          }
        }
      }
    });
  },

  onOK: function () {
    var me = this;
    PCL.getBody().mask("正在保存中...");
    PCL.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/PurchaseOrder/editPOBill",
      method: "POST",
      params: {
        adding: me.adding ? "1" : "0",
        jsonStr: me.getSaveData()
      },
      callback: function (options, success, response) {
        PCL.getBody().unmask();

        if (success) {
          var data = PCL.JSON.decode(response.responseText);
          if (data.success) {
            me.close();
            if (!me.getGenBill()) {
              me.getParentForm().refreshMainGrid(data.id);
            }
            me.tip("成功保存数据");
          } else {
            PSI.MsgBox.showInfo(data.msg);
          }
        }
      }
    });
  },

  onEditSpecialKey: function (field, e) {
    if (e.getKey() === e.ENTER) {
      var me = this;
      var id = field.getId();
      for (var i = 0; i < me.__editorList.length; i++) {
        var editorId = me.__editorList[i];
        if (id === editorId) {
          var edit = PCL.getCmp(me.__editorList[i + 1]);
          edit.focus();
          edit.setValue(edit.getValue());
        }
      }
    }
  },

  onLastEditSpecialKey: function (field, e) {
    if (this.__readonly) {
      return;
    }

    if (e.getKey() == e.ENTER) {
      var me = this;
      var store = me.getGoodsGrid().getStore();
      if (store.getCount() == 0) {
        store.add({});
      }
      me.getGoodsGrid().focus();
      me.__cellEditing.startEdit(0, 1);
    }
  },

  getGoodsGrid: function () {
    var me = this;
    if (me.__goodsGrid) {
      return me.__goodsGrid;
    }
    var modelName = "PSIPOBill_EditForm";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "goodsId", "goodsCode", "goodsName",
        "goodsSpec", "unitName", "goodsCount", {
          name: "goodsMoney",
          type: "float"
        }, "goodsPrice", {
          name: "taxRate",
          type: "int"
        }, {
          name: "tax",
          type: "float"
        }, {
          name: "moneyWithTax",
          type: "float"
        }, "memo", "goodsPriceWithTax"]
    });
    var store = PCL.create("PCL.data.Store", {
      autoLoad: false,
      model: modelName,
      data: []
    });

    me.__cellEditing = PCL.create("PSI.UX.CellEditing", {
      clicksToEdit: 1,
      listeners: {
        edit: {
          fn: me.cellEditingAfterEdit,
          scope: me
        }
      }
    });

    me.__goodsGrid = PCL.create("PCL.grid.Panel", {
      cls: "PSI-EF",
      viewConfig: {
        enableTextSelection: true,
        markDirty: !me.adding
      },
      features: [{
        ftype: "summary"
      }],
      plugins: [me.__cellEditing],
      columnLines: true,
      columns: [{
        xtype: "rownumberer",
        text: "#",
        width: 30
      }, {
        header: "物料编码",
        dataIndex: "goodsCode",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        editor: {
          xtype: "psi_goods_with_purchaseprice_field",
          parentCmp: me,
          //showAddButton: me.getShowAddGoodsButton() == "1",
          supplierIdFunc: me.__supplierIdFunc,
          supplierIdScope: me
        }
      }, {
        header: "品名/规格型号",
        dataIndex: "goodsName",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        width: 330,
        renderer: function (value, metaData, record) {
          return record.get("goodsName") + " " + record.get("goodsSpec");
        }
      }, {
        header: "采购数量",
        dataIndex: "goodsCount",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        width: 80,
        editor: {
          xtype: "numberfield",
          allowDecimals: PSI.Const.GC_DEC_NUMBER > 0,
          decimalPrecision: PSI.Const.GC_DEC_NUMBER,
          minValue: 0,
          hideTrigger: true
        }
      }, {
        header: "单位",
        dataIndex: "unitName",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "center",
        width: 50
      }, {
        header: "采购单价",
        dataIndex: "goodsPrice",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryRenderer: function () {
          return "金额合计";
        }
      }, {
        header: "采购金额",
        dataIndex: "goodsMoney",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryType: "sum"
      }, {
        header: "含税价", hidden: true, //隐藏含税价
        dataIndex: "goodsPriceWithTax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        }
      }, {
        header: "税率(%)", hidden: true, //隐藏税率
        dataIndex: "taxRate",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        format: "0",
        width: 60
      }, {
        header: "税金", hidden: true, //隐藏税金
        dataIndex: "tax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryType: "sum"
      }, {
        header: "价税合计", hidden: true, //价税合计
        dataIndex: "moneyWithTax",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        align: "right",
        xtype: "numbercolumn",
        width: 90,
        editor: {
          xtype: "numberfield",
          hideTrigger: true
        },
        summaryType: "sum"
      }, {
        header: "备注",
        dataIndex: "memo",
        menuDisabled: true,
        sortable: false,
        draggable: false,
        editor: {
          xtype: "textfield"
        }
      }, {
        header: "",
        id: "columnActionDelete",
        align: "center",
        menuDisabled: true,
        draggable: false,
        width: 40,
        xtype: "actioncolumn",
        items: [{
          icon: PSI.Const.BASE_URL
            + "Public/Images/icons/delete.png",
          tooltip: "删除当前记录",
          handler: function (grid, row) {
            var store = grid.getStore();
            store.remove(store.getAt(row));
            if (store.getCount() == 0) {
              store.add({});
            }
          },
          scope: me
        }]
      }, {
        header: "",
        id: "columnActionAdd",
        align: "center",
        menuDisabled: true,
        draggable: false,
        width: 40,
        xtype: "actioncolumn",
        items: [{
          icon: PSI.Const.BASE_URL
            + "Public/Images/icons/insert.png",
          tooltip: "在当前记录之前插入新记录",
          handler: function (grid, row) {
            var store = grid.getStore();
            store.insert(row, [{}]);
          },
          scope: me
        }]
      }, {
        header: "",
        id: "columnActionAppend",
        align: "center",
        menuDisabled: true,
        draggable: false,
        width: 40,
        xtype: "actioncolumn",
        items: [{
          icon: PSI.Const.BASE_URL
            + "Public/Images/icons/add.png",
          tooltip: "在当前记录之后新增记录",
          handler: function (grid, row) {
            var store = grid.getStore();
            store.insert(row + 1, [{}]);
          },
          scope: me
        }]
      }],
      store: store,
      listeners: {
        cellclick: function () {
          return !me.__readonly;
        }
      }
    });

    return me.__goodsGrid;
  },

  // 控件 xtype:psi_goods_with_purchaseprice_field 会回调本方法
  // 见PSI.Goods.GoodsWithPurchaseFieldField的onOK方法
  __setGoodsInfo: function (data) {
    var me = this;
    var item = me.getGoodsGrid().getSelectionModel().getSelection();
    var selectStore = me.getGoodsGrid().getStore();

    if (item == null) {
      return;
    }else if(data.length != 1){
      var selectData = [];

      data.forEach(v => {
        if (me.__taxRateBySupplier) {
          if (v.taxRateType > 1) {
            // 该物料设置了自己的特定税率
            var taxRate =  v.taxRate;
          } else {
            // 设置了供应商税率，优先使用供应商税率
            var taxRate = me.__taxRateBySupplier;
          }
        } else {
          // 没有设置供应商税率
          var taxRate =  v.taxRate;
        }
        var goods = {
          "goodsId":v.id,
          "goodsCode":v.code,
          "goodsName":v.name,
          "unitName":v.unitName,
          "goodsSpec":v.spec,
          "taxRate":taxRate,
          "goodsPrice": v.purchasePrice,
        };
        me.calcMoney(goods);
        selectData.push(goods);
      })
      if(item[0].data.goodsId.length == 0){
        selectStore.remove(item)
      }
      selectStore.add(selectData);
    }else{

      var goods = item[0];
      var dataInfo = data[0];

      goods.set("goodsId", dataInfo.id);
      goods.set("goodsCode", dataInfo.code);
      goods.set("goodsName", dataInfo.name);
      goods.set("unitName", dataInfo.unitName);
      goods.set("goodsSpec", dataInfo.spec);
      if (me.__taxRateBySupplier) {
        if (dataInfo.taxRateType > 1) {
          // 该物料设置了自己的特定税率
          goods.set("taxRate", dataInfo.taxRate);
        } else {
          // 设置了供应商税率，优先使用供应商税率
          goods.set("taxRate", me.__taxRateBySupplier);
        }
      } else {
        // 没有设置供应商税率
        goods.set("taxRate", dataInfo.taxRate);
      }

      // 设置建议采购价
      goods.set("goodsPrice", dataInfo.purchasePrice);

      me.calcMoney(goods);
    }

  },

  cellEditingAfterEdit: function (editor, e) {
    var me = this;

    if (me.__readonly) {
      return;
    }

    var fieldName = e.field;
    var goods = e.record;
    var oldValue = e.originalValue;
    if (fieldName == "memo") {
      var store = me.getGoodsGrid().getStore();
      if (e.rowIdx == store.getCount() - 1) {
        store.add({});
        var row = e.rowIdx + 1;
        me.getGoodsGrid().getSelectionModel().select(row);
        me.__cellEditing.startEdit(row, 1);
      }
    } else if (fieldName == "moneyWithTax") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcTax(goods);
      }
    } else if (fieldName == "tax") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcMoneyWithTax(goods);
      }
    } else if (fieldName == "goodsMoney") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcPrice(goods);
      }
    } else if (fieldName == "goodsCount") {
      if (goods.get(fieldName) != oldValue) {
        me.calcMoney(goods);
      }
    } else if (fieldName == "goodsPrice") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcMoney(goods);
      }
    } else if (fieldName == "goodsPriceWithTax") {
      if (goods.get(fieldName) != (new Number(oldValue)).toFixed(2)) {
        me.calcMoney2(goods);
      }
    }

    // 上述代码的技术说明
    // 各个calcXXXX函数实现在PSI.Mix.GoodsPrice中
    // 这是利用ExtJS的mix技术
  },

  getSaveData: function () {
    var me = this;

    var result = {
      id: PCL.getCmp("hiddenId").getValue(),
      dealDate: PCL.Date.format(PCL.getCmp("editDealDate").getValue(),
        "Y-m-d"),
      supplierId: PCL.getCmp("editSupplier").getIdValue(),
      dealAddress: PCL.getCmp("editDealAddress").getValue(),
      contact: PCL.getCmp("editContact").getValue(),
      tel: PCL.getCmp("editTel").getValue(),
      fax: PCL.getCmp("editFax").getValue(),
      orgId: PCL.getCmp("editOrg").getIdValue(),
      bizUserId: PCL.getCmp("editBizUser").getIdValue(),
      paymentType: PCL.getCmp("editPaymentType").getValue(),
      billMemo: PCL.getCmp("editBillMemo").getValue(),
      sobillRef: me.getSobillRef(),
      items: []
    };

    var store = me.getGoodsGrid().getStore();
    for (var i = 0; i < store.getCount(); i++) {
      var item = store.getAt(i);
      result.items.push({
        id: item.get("id"),
        goodsId: item.get("goodsId"),
        goodsCount: item.get("goodsCount"),
        goodsPrice: item.get("goodsPrice"),
        goodsPriceWithTax: item.get("goodsPriceWithTax"),
        goodsMoney: item.get("goodsMoney"),
        tax: item.get("tax"),
        taxRate: item.get("taxRate"),
        moneyWithTax: item.get("moneyWithTax"),
        memo: item.get("memo")
      });
    }

    return PCL.JSON.encode(result);
  },

  setBillReadonly: function () {
    var me = this;
    me.__readonly = true;
    me.setTitle("<span style='font-size:160%;'>查看采购订单</span>");
    PCL.getCmp("buttonSave").setDisabled(true);
    PCL.getCmp("buttonCancel").setText("关闭");
    PCL.getCmp("editDealDate").setReadOnly(true);
    PCL.getCmp("editSupplier").setReadOnly(true);
    PCL.getCmp("editDealAddress").setReadOnly(true);
    PCL.getCmp("editContact").setReadOnly(true);
    PCL.getCmp("editTel").setReadOnly(true);
    PCL.getCmp("editFax").setReadOnly(true);
    PCL.getCmp("editOrg").setReadOnly(true);
    PCL.getCmp("editBizUser").setReadOnly(true);
    PCL.getCmp("editPaymentType").setReadOnly(true);
    PCL.getCmp("editBillMemo").setReadOnly(true);

    PCL.getCmp("columnActionDelete").hide();
    PCL.getCmp("columnActionAdd").hide();
    PCL.getCmp("columnActionAppend").hide();
  },

  // xtype:psi_supplierfield回调本方法
  // 参见PSI.Supplier.SupplierField的onOK方法
  __setSupplierExtData(data, scope) {
    const me = scope;
    const editDealAddress = PCL.getCmp("editDealAddress");
    if (!editDealAddress.getValue()) {
      editDealAddress.setValue(data.address_shipping);
    }
    const editTel = PCL.getCmp("editTel");
    if (!editTel.getValue()) {
      editTel.setValue(data.tel01);
    }

    const editFax = PCL.getCmp("editFax");
    if (!editFax.getValue()) {
      editFax.setValue(data.fax);
    }

    const editContact = PCL.getCmp("editContact");
    if (!editContact.getValue()) {
      editContact.setValue(data.contact01);
    }

    me.__taxRateBySupplier = data.taxRate;

    // 通常情况下，是先录入供应商，再录入物料明细，这时候其实并不需要调用recalcGoodsTaxRate
    // 但是如果先录入了物料明细，再录入供应商，就需要调用recalcGoodsTaxRate
    // 一个应用的场景：由销售订单创建采购订单的时候，就是先有了物料明细数据，再录入供应商
    me.recalcGoodsTaxRate();
  },

  /**
   * 重新计算税率、税金和价税合计
   * @private
   */
  recalcGoodsTaxRate() {
    const me = this;
    const store = me.getGoodsGrid().getStore();
    if (store.getCount() == 0) {
      return;
    }

    const list = [];
    for (let i = 0; i < store.getCount(); i++) {
      const goods = store.getAt(i);
      list.push(goods.get("goodsId"));
    }

    PCL.getBody().mask("数据查询中...");
    const r = {
      url: me.URL("Home/PurchaseOrder/queryTaxRate"),
      method: "POST",
      params: {
        adding: me.adding ? "1" : "0",
        supplierId: PCL.getCmp("editSupplier").getIdValue(),
        goodsIdList: list.join(","),
      },
      callback: function (options, success, response) {
        PCL.getBody().unmask();
        if (success) {
          const data = me.decodeJSON(response.responseText);
          if (data.length == store.getCount()) {
            for (let i = 0; i < store.getCount(); i++) {
              const taxRate = parseInt(data[i]);
              const goods = store.getAt(i);
              const r = parseInt(goods.get("taxRate"));
              if (taxRate != r) {
                // 税率不同，需要重新计算税金和价税合计
                goods.set("taxRate", taxRate);
                me.calcMoney(goods);
              }
            }
          }
        }
      }
    };

    PCL.Ajax.request(r);
  },

  __supplierIdFunc: function () {
    return PCL.getCmp("editSupplier").getIdValue();
  }
});
