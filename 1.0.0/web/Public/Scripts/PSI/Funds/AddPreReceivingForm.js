/**
 * 预收款管理 - 收预收款
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Funds.AddPreReceivingForm", {
  extend: "PSI.AFX.Form.EditForm",

  initComponent: function () {
    var me = this;

    var t = "收取客户预付款";
    var f = "edit-form-money.png";
    var logoHtml = `
      <img style='float:left;margin:0px 20px 0px 10px;width:48px;height:48px;' 
        src='${PSI.Const.BASE_URL}Public/Images/${f}'></img>
      <div style='margin-left:60px;margin-top:0px;'>
        <h2 style='color:#196d83;margin-top:0px;'>${t}</h2>
        <p style='color:#196d83'>标记 <span style='color:red;font-weight:bold'>*</span>的是必须录入数据的字段</p>
      </div>
      <div style='margin:0px;border-bottom:1px solid #e6f7ff;height:1px' /></div>
      `;

    const width1 = 600;
    const width2 = 290;
    Ext.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 650,
      height: 300,
      layout: "border",
      defaultFocus: "editCustomer",
      listeners: {
        show: {
          fn: me.onWndShow,
          scope: me
        },
        close: {
          fn: me.onWndClose,
          scope: me
        }
      },
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "editForm",
        xtype: "form",
        layout: {
          type: "table",
          columns: 2,
          tableAttrs: PSI.Const.TABLE_LAYOUT,
        },
        height: "100%",
        bodyPadding: 5,
        defaultType: 'textfield',
        fieldDefaults: {
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side',
          width: width2,
          margin: "5"
        },
        items: [{
          id: "editCustomerId",
          xtype: "hidden",
          name: "customerId"
        }, {
          id: "editCustomer",
          fieldLabel: "客户",
          xtype: "psi_customerfield",
          allowBlank: false,
          blankText: "没有输入客户",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditCustomerSpecialKey,
              scope: me
            }
          }
        }, {
          id: "editBizDT",
          fieldLabel: "收款日期",
          allowBlank: false,
          blankText: "没有输入收款日期",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          xtype: "datefield",
          format: "Y-m-d",
          value: new Date(),
          name: "bizDT",
          listeners: {
            specialkey: {
              fn: me.onEditBizDTSpecialKey,
              scope: me
            }
          }
        }, {
          fieldLabel: "收款金额",
          allowBlank: false,
          blankText: "没有输入收款金额",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          xtype: "numberfield",
          hideTrigger: true,
          name: "inMoney",
          id: "editInMoney",
          listeners: {
            specialkey: {
              fn: me.onEditInMoneySpecialKey,
              scope: me
            }
          }
        }, {
          id: "editBizUserId",
          xtype: "hidden",
          name: "bizUserId"
        }, {
          id: "editBizUser",
          fieldLabel: "收款人",
          xtype: "psi_userfield",
          allowBlank: false,
          blankText: "没有输入收款人",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          listeners: {
            specialkey: {
              fn: me.onEditBizUserSpecialKey,
              scope: me
            }
          }
        }, {
          fieldLabel: "备注",
          name: "memo",
          id: "editMemo",
          listeners: {
            specialkey: {
              fn: me.onEditMemoSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1,
        }],
        buttons: [{
          text: "保存",
          //iconCls: "PSI-button-ok",
          formBind: true,
          handler: me.onOK,
          scope: me
        }, {
          text: "取消",
          handler: function () {
            me.close();
          },
          scope: me
        }]
      }]
    });

    me.callParent(arguments);
  },

  onWindowBeforeUnload: function (e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndClose: function () {
    var me = this;

    Ext.get(window).un('beforeunload', me.onWindowBeforeUnload);
  },

  onWndShow: function () {
    var me = this;

    Ext.get(window).on('beforeunload', me.onWindowBeforeUnload);

    var f = Ext.getCmp("editForm");
    var el = f.getEl();
    el.mask(PSI.Const.LOADING);
    Ext.Ajax.request({
      url: PSI.Const.BASE_URL + "Home/Funds/addPreReceivingInfo",
      params: {},
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = Ext.JSON.decode(response.responseText);

          Ext.getCmp("editBizUserId").setValue(data.bizUserId);
          Ext.getCmp("editBizUser").setValue(data.bizUserName);
          Ext.getCmp("editBizUser").setIdValue(data.bizUserId);
        } else {
          PSI.MsgBox.showInfo("网络错误")
        }
      }
    });
  },

  // private
  onOK: function () {
    var me = this;
    Ext.getCmp("editBizUserId").setValue(Ext.getCmp("editBizUser").getIdValue());
    Ext.getCmp("editCustomerId").setValue(Ext.getCmp("editCustomer").getIdValue());

    var f = Ext.getCmp("editForm");
    var el = f.getEl();
    el.mask(PSI.Const.SAVING);
    f.submit({
      url: PSI.Const.BASE_URL + "Home/Funds/addPreReceiving",
      method: "POST",
      success: function (form, action) {
        el.unmask();

        me.close();

        me.getParentForm().onQuery();
      },
      failure: function (form, action) {
        el.unmask();
        PSI.MsgBox.showInfo(action.result.msg, function () {
          Ext.getCmp("editBizDT").focus();
        });
      }
    });
  },

  onEditCustomerSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      Ext.getCmp("editBizDT").focus();
    }
  },

  onEditBizDTSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      Ext.getCmp("editInMoney").focus();
    }
  },

  onEditInMoneySpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      Ext.getCmp("editBizUser").focus();
    }
  },

  onEditBizUserSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      Ext.getCmp("editMemo").focus();
    }
  },

  onEditMemoSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      var f = Ext.getCmp("editForm");
      if (f.getForm().isValid()) {
        var me = this;
        PSI.MsgBox.confirm("请确认是否录入收款记录?", function () {
          me.onOK();
        });
      }
    }
  }
});
