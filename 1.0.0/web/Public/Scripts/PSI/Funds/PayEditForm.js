/**
 * 应付账款 - 付款记录
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
Ext.define("PSI.Funds.PayEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  config: {
    payDetail: null
  },

  initComponent: function () {
    var me = this;

    var t = "修改应付金额";
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
      height: 340,
      layout: "border",
      defaultFocus: "editActMoney",
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
          xtype: "hidden",
          id: "hiddenId",
          name: "id",
          value: me.getPayDetail().get("id")
        }, {
          fieldLabel: "业务类型",
          xtype: "displayfield",
          value: me.toFieldNoteText(me.getPayDetail().get("refType"))
        }, {
          fieldLabel: "单号",
          xtype: "displayfield",
          value: me.toFieldNoteText(me.getPayDetail().get("refNumber"))
        }, {
          fieldLabel: "账单金额",
          xtype: "displayfield",
          value: me.toFieldNoteText(me.getPayDetail().get("billMoney"))
        }, {
          fieldLabel: "应付金额",
          allowBlank: false,
          blankText: "没有输入付款金额",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          xtype: "numberfield",
          hideTrigger: true,
          name: "payMoney",
          id: "editPayMoney",
          value: me.getPayDetail().get("payMoney"),
          listeners: {
            specialkey: {
              fn: me.onEditActMoneySpecialKey,
              scope: me
            }
          }
        }, {
          fieldLabel: "备注",
          name: "remark",
          id: "editRemark",
          value: me.getPayDetail().get("remark"),
          listeners: {
            specialkey: {
              fn: me.onEditRemarkSpecialKey,
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
      url: PSI.Const.BASE_URL + "Home/Funds/payDetailInfo",
      params: {
        id: PCL.getCmp("hiddenId").getValue(),
      },
      method: "POST",
      callback: function (options, success, response) {
        el.unmask();

        if (success) {
          var data = Ext.JSON.decode(response.responseText);
          Ext.getCmp("editPayMoney")
            .setValue(data.payMoney);
        } else {
          PSI.MsgBox.showInfo("网络错误")
        }
      }
    });
  },

  // private
  onOK: function () {
    var me = this;
    var f = Ext.getCmp("editForm");
    var el = f.getEl();
    el.mask(PSI.Const.SAVING);
    f.submit({
      url: PSI.Const.BASE_URL + "Home/Funds/editPayDetail",
      method: "POST",
      success: function (form, action) {
        el.unmask();

        me.close();
        var pf = me.getParentForm();
        pf.refreshPayInfo();
        pf.refreshPayDetailInfo();
        pf.getPayRecordGrid().getStore().loadPage(1);
      },
      failure: function (form, action) {
        el.unmask();
        PSI.MsgBox.showInfo(action.result.msg, function () {
          Ext.getCmp("editPayMoney").focus();
        });
      }
    });
  },


  onEditRemarkSpecialKey: function (field, e) {
    if (e.getKey() == e.ENTER) {
      var f = Ext.getCmp("editForm");
      if (f.getForm().isValid()) {
        var me = this;
        if(me.getPayDetail().get("payMoney") != Ext.getCmp("editPayMoney").getValue())
        {
          PSI.MsgBox.confirm("请确认是否修改应付金额?", function () {
            me.onOK();
          });
        }else{
          me.onOK();
        }

      }
    }
  }
});
