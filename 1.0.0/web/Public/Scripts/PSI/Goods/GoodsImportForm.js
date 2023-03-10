/**
 * 物料导入
 * 
 * @author 张健
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.GoodsImportForm", {
  extend: "PSI.AFX.BaseDialogForm",

  config: {
    parentForm: null
  },

  /**
   * 初始化组件
   */
  initComponent: function () {
    var me = this;

    var buttons = [];

    buttons.push({
      text: "导入物料",
      formBind: true,
      //iconCls: "PSI-button-ok",
      handler: function () {
        me.onOK();
      },
      scope: me
    }, {
      text: "取消",
      handler: function () {
        me.confirm("请确认是否取消操作：导入物料？", () => {
          me.close();
        })
      },
      scope: me
    });

    PCL.apply(me, {
      header: {
        title: me.formatTitle(PSI.Const.PROD_NAME),
        height: 40
      },
      modal: true,
      resizable: false,
      onEsc: PCL.emptyFn,
      width: 512,
      height: 180,
      layout: "fit",
      items: [{
        id: "importForm",
        xtype: "form",
        border: 0,
        layout: {
          type: "table",
          columns: 1
        },
        height: "100%",
        bodyPadding: 5,
        fieldDefaults: {
          labelWidth: 60,
          labelAlign: "right",
          labelSeparator: "",
          msgTarget: 'side'
        },
        items: [{
          xtype: 'filefield',
          name: 'data_file',
          afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="必需填写">*</span>',
          fieldLabel: '文件',
          labelWidth: 50,
          width: 480,
          msgTarget: 'side',
          allowBlank: false,
          anchor: '100%',
          buttonText: '选择物料文件'
        }, {
          html: `<a href="../Uploads/Goods/goods_template.xlsx"><h4>下载物料导入模板</h4></a>`,
          border: 0
        }],
        buttons: buttons
      }]
    });

    me.callParent(arguments);
  },

  onOK: function () {
    var me = this;
    var f = PCL.getCmp("importForm");
    var el = f.getEl();
    el && el.mask('正在导入...');
    f.submit({
      url: PSI.Const.BASE_URL + "Home/Goods/import",
      method: "POST",
      success: function (form, action) {
        el && el.unmask();

        PSI.MsgBox.showInfo("数据导入成功");

        me.close();
        me.getParentForm().freshGoodsGrid();
      },
      failure: function (form, action) {
        el && el.unmask();
        PSI.MsgBox.showInfo(action.result.msg);
      }
    });
  }
});
