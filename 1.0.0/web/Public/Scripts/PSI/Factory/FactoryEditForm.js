/**
 * 工厂 - 新建或编辑界面
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Factory.FactoryEditForm", {
  extend: "PSI.AFX.Form.EditForm",

  initComponent: function () {
    var me = this;
    var entity = me.getEntity();
    this.adding = entity == null;

    var buttons = [];
    if (!entity) {
      buttons.push({
        text: "保存并继续新建",
        formBind: true,
        handler: function () {
          me.onOK(true);
        },
        scope: me
      });
    }

    buttons.push({
      text: "保存",
      formBind: true,
      //iconCls: "PSI-button-ok",
      handler: function () {
        me.onOK(false);
      },
      scope: me
    }, {
      text: entity == null ? "关闭" : "取消",
      handler: function () {
        me.close();
      },
      scope: me
    });

    var categoryStore = null;
    if (me.getParentForm()) {
      categoryStore = me.getParentForm().getCategoryGrid().getStore();
    }

    var t = entity == null ? "新建工厂" : "编辑工厂";
    var logoHtml = me.genLogoHtml(entity, t);

    const width1 = 800;
    const width2 = 395;
    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      width: 850,
      height: 570,
      layout: "border",
      items: [{
        region: "north",
        border: 0,
        height: 70,
        html: logoHtml
      }, {
        region: "center",
        border: 0,
        id: "PSI_Factory_FactoryEditForm_editForm",
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
          labelWidth: 100,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side'
        },
        items: [{
          xtype: "hidden",
          name: "id",
          value: entity == null ? null : entity
            .get("id")
        }, {
          id: "PSI_Factory_FactoryEditForm_editCategory",
          xtype: "combo",
          fieldLabel: "分类",
          allowBlank: false,
          blankText: "没有输入工厂分类",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          valueField: "id",
          displayField: "name",
          store: categoryStore,
          queryMode: "local",
          editable: false,
          value: categoryStore != null
            ? categoryStore.getAt(0).get("id")
            : null,
          name: "categoryId",
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editCode",
          fieldLabel: "编码",
          allowBlank: false,
          blankText: "没有输入工厂编码",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "code",
          value: entity == null ? null : entity
            .get("code"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editName",
          fieldLabel: "工厂名称",
          allowBlank: false,
          blankText: "没有输入工厂名称",
          beforeLabelTextTpl: PSI.Const.REQUIRED,
          name: "name",
          value: entity == null ? null : entity
            .get("name"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1
        }, {
          id: "PSI_Factory_FactoryEditForm_editAddress",
          fieldLabel: "地址",
          name: "address",
          value: entity == null ? null : entity
            .get("address"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          colspan: 2,
          width: width1
        }, {
          id: "PSI_Factory_FactoryEditForm_editContact01",
          fieldLabel: "联系人",
          name: "contact01",
          value: entity == null ? null : entity
            .get("contact01"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editMobile01",
          fieldLabel: "手机",
          name: "mobile01",
          value: entity == null ? null : entity
            .get("mobile01"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editTel01",
          fieldLabel: "固话",
          name: "tel01",
          value: entity == null ? null : entity
            .get("tel01"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editContact02",
          fieldLabel: "备用联系人",
          name: "contact02",
          value: entity == null ? null : entity
            .get("contact02"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editMobile02",
          fieldLabel: "备用联系人手机",
          name: "mobile02",
          value: entity == null ? null : entity
            .get("mobile02"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editTel02",
          fieldLabel: "备用联系人固话",
          name: "tel02",
          value: entity == null ? null : entity
            .get("tel02"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editBankName",
          fieldLabel: "开户行",
          name: "bankName",
          value: entity == null ? null : entity
            .get("bankName"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editBankAccount",
          fieldLabel: "开户行账号",
          name: "bankAccount",
          value: entity == null ? null : entity
            .get("bankAccount"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editTax",
          fieldLabel: "税号",
          name: "tax",
          value: entity == null ? null : entity
            .get("tax"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editFax",
          fieldLabel: "传真",
          name: "fax",
          value: entity == null ? null : entity
            .get("fax"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editInitPayables",
          fieldLabel: "应付期初余额",
          name: "initPayables",
          xtype: "numberfield",
          hideTrigger: true,
          value: entity == null ? null : entity
            .get("initPayables"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editInitPayablesDT",
          fieldLabel: "余额日期",
          name: "initPayablesDT",
          xtype: "datefield",
          format: "Y-m-d",
          value: entity == null ? null : entity
            .get("initPayablesDT"),
          listeners: {
            specialkey: {
              fn: me.onEditSpecialKey,
              scope: me
            }
          },
          width: width2,
        }, {
          id: "PSI_Factory_FactoryEditForm_editNote",
          fieldLabel: "备注",
          name: "note",
          value: entity == null ? null : entity
            .get("note"),
          listeners: {
            specialkey: {
              fn: me.onEditLastSpecialKey,
              scope: me
            }
          },
          width: width1,
          colspan: 2
        }, {
          id: "PSI_Factory_FactoryEditForm_editRecordStatus",
          xtype: "combo",
          queryMode: "local",
          editable: false,
          valueField: "id",
          fieldLabel: "状态",
          name: "recordStatus",
          store: PCL.create("PCL.data.ArrayStore", {
            fields: ["id", "text"],
            data: [[1000, "启用"], [0, "停用"]]
          }),
          value: 1000,
          width: width2,
        }],
        buttons: buttons
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

    me.editForm = PCL.getCmp("PSI_Factory_FactoryEditForm_editForm");

    me.editCategory = PCL.getCmp("PSI_Factory_FactoryEditForm_editCategory");
    me.editCode = PCL.getCmp("PSI_Factory_FactoryEditForm_editCode");
    me.editName = PCL.getCmp("PSI_Factory_FactoryEditForm_editName");
    me.editAddress = PCL.getCmp("PSI_Factory_FactoryEditForm_editAddress");
    me.editContact01 = PCL.getCmp("PSI_Factory_FactoryEditForm_editContact01");
    me.editMobile01 = PCL.getCmp("PSI_Factory_FactoryEditForm_editMobile01");
    me.editTel01 = PCL.getCmp("PSI_Factory_FactoryEditForm_editTel01");
    me.editContact02 = PCL.getCmp("PSI_Factory_FactoryEditForm_editContact02");
    me.editMobile02 = PCL.getCmp("PSI_Factory_FactoryEditForm_editMobile02");
    me.editTel02 = PCL.getCmp("PSI_Factory_FactoryEditForm_editTel02");
    me.editBankName = PCL.getCmp("PSI_Factory_FactoryEditForm_editBankName");
    me.editBankAccount = PCL.getCmp("PSI_Factory_FactoryEditForm_editBankAccount");
    me.editTax = PCL.getCmp("PSI_Factory_FactoryEditForm_editTax");
    me.editFax = PCL.getCmp("PSI_Factory_FactoryEditForm_editFax");
    me.editInitPayables = PCL.getCmp("PSI_Factory_FactoryEditForm_editInitPayables");
    me.editInitPayablesDT = PCL.getCmp("PSI_Factory_FactoryEditForm_editInitPayablesDT");
    me.editNote = PCL.getCmp("PSI_Factory_FactoryEditForm_editNote");

    me.editRecordStatus = PCL.getCmp("PSI_Factory_FactoryEditForm_editRecordStatus");

    me.__editorList = [me.editCategory, me.editCode, me.editName,
    me.editAddress, me.editContact01, me.editMobile01,
    me.editTel01, me.editContact02, me.editMobile02, me.editTel02,
    me.editBankName, me.editBankAccount, me.editTax, me.editFax,
    me.editInitPayables, me.editInitPayablesDT, me.editNote];
  },

  onWndShow: function () {
    var me = this;

    PCL.get(window).on('beforeunload', me.onWindowBeforeUnload);

    if (me.adding) {
      // 新建
      if (me.getParentForm()) {
        var grid = me.getParentForm().getCategoryGrid();
        var item = grid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
          return;
        }

        me.editCategory.setValue(item[0].get("id"));
      } else {
        // 从其他界面调用本窗口
        var modelName = "PSIFactoryCategory_FactoryEditForm";
        PCL.define(modelName, {
          extend: "PCL.data.Model",
          fields: ["id", "code", "name", {
            name: "cnt",
            type: "int"
          }]
        });
        var store = PCL.create("PCL.data.Store", {
          model: modelName,
          autoLoad: false,
          data: []
        });
        me.editCategory.bindStore(store);
        var el = PCL.getBody();
        el.mask(PSI.Const.LOADING);
        var r = {
          url: me.URL("Home/Factory/categoryList"),
          params: {
            recordStatus: -1
          },
          callback: function (options, success, response) {
            store.removeAll();

            if (success) {
              var data = me.decodeJSON(response.responseText);
              store.add(data);
              if (store.getCount() > 0) {
                var id = store.getAt(0).get("id");
                me.editCategory.setValue(id);
              }
            }

            el.unmask();
          }
        };
        me.ajax(r);
      }
    } else {
      // 编辑
      var el = me.getEl();
      el && el.mask(PSI.Const.LOADING);
      PCL.Ajax.request({
        url: me.URL("Home/Factory/factoryInfo"),
        params: {
          id: me.getEntity().get("id")
        },
        method: "POST",
        callback: function (options, success, response) {
          if (success) {
            var data = PCL.JSON.decode(response.responseText);
            me.editCategory.setValue(data.categoryId);
            me.editCode.setValue(data.code);
            me.editName.setValue(data.name);
            me.editAddress.setValue(data.address);
            me.editContact01.setValue(data.contact01);
            me.editMobile01.setValue(data.mobile01);
            me.editTel01.setValue(data.tel01);
            me.editContact02.setValue(data.contact02);
            me.editMobile02.setValue(data.mobile02);
            me.editTel02.setValue(data.tel02);
            me.editInitPayables.setValue(data.initPayables);
            me.editInitPayablesDT.setValue(data.initPayablesDT);
            me.editBankName.setValue(data.bankName);
            me.editBankAccount.setValue(data.bankAccount);
            me.editTax.setValue(data.tax);
            me.editFax.setValue(data.fax);
            me.editNote.setValue(data.note);
            me.editRecordStatus.setValue(parseInt(data.recordStatus));
          }

          el && el.unmask();
        }
      });
    }

    me.editCode.focus();
    me.editCode.setValue(me.editCode.getValue());
  },

  onOK: function (thenAdd) {
    var me = this;

    var f = me.editForm;
    var el = f.getEl();
    el && el.mask(PSI.Const.SAVING);
    f.submit({
      url: me.URL("Home/Factory/editFactory"),
      method: "POST",
      success: function (form, action) {
        el && el.unmask();
        PSI.MsgBox.tip("数据保存成功");
        me.focus();
        me.__lastId = action.result.id;
        if (thenAdd) {
          me.clearEdit();
        } else {
          me.close();
        }
      },
      failure: function (form, action) {
        el && el.unmask();
        PSI.MsgBox.showInfo(action.result.msg, function () {
          me.editCode.focus();
        });
      }
    });
  },

  onEditSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() === e.ENTER) {
      var id = field.getId();
      for (var i = 0; i < me.__editorList.length; i++) {
        var edit = me.__editorList[i];
        if (id == edit.getId()) {
          var edit = me.__editorList[i + 1];
          edit.focus();
          edit.setValue(edit.getValue());
        }
      }
    }
  },

  onEditLastSpecialKey: function (field, e) {
    var me = this;

    if (e.getKey() === e.ENTER) {
      var f = me.editForm;
      if (f.getForm().isValid()) {
        me.onOK(me.adding);
      }
    }
  },

  clearEdit: function () {
    var me = this;

    me.editCode.focus();

    var editors = [me.editCode, me.editName, me.editAddress,
    me.editContact01, me.editMobile01, me.editTel01,
    me.editContact02, me.editMobile02, me.editTel02,
    me.editInitPayables, me.editInitPayablesDT, me.editBankName,
    me.editBankAccount, me.editTax, me.editFax, me.editNote];
    for (var i = 0; i < editors.length; i++) {
      var edit = editors[i];
      edit.setValue(null);
      edit.clearInvalid();
    }
  },

  onWindowBeforeUnload: function (e) {
    return (window.event.returnValue = e.returnValue = '确认离开当前页面？');
  },

  onWndClose: function () {
    var me = this;

    PCL.get(window).un('beforeunload', me.onWindowBeforeUnload);

    if (me.__lastId) {
      if (me.getParentForm()) {
        me.getParentForm().freshMainGrid(me.__lastId);
      }
    }
  }
});
