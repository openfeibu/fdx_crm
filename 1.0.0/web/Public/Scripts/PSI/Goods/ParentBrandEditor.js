/**
 * 自定义字段 - 上级商品品牌字段
 * 
 * @author 广州飞步信息科技有限公司
 * @copyright 2015 - present
 * @license GPL v3
 */
PCL.define("PSI.Goods.ParentBrandEditor", {
  extend: "PCL.form.field.Trigger",
  alias: "widget.PSI_parent_brand_editor",

  config: {
    parentItem: null
  },

  initComponent: function () {
    this.enableKeyEvents = true;

    this.callParent(arguments);

    this.on("keydown", function (field, e) {
      if (e.getKey() === e.BACKSPACE) {
        e.preventDefault();
        return false;
      }

      if (e.getKey() !== e.ENTER) {
        this.onTriggerClick(e);
      }
    });
  },

  onTriggerClick: function (e) {
    var me = this; if(me.wnd){ me.wnd.close() }

    var modelName = "PSIModel_ParentBrandEditor";
    PCL.define(modelName, {
      extend: "PCL.data.Model",
      fields: ["id", "text", "fullName", "leaf",
        "children"]
    });

    var store = PCL.create("PCL.data.TreeStore", {
      model: modelName,
      proxy: {
        type: "ajax",
        actionMethods: {
          read: "POST"
        },
        url: PSI.Const.BASE_URL
          + "Home/Goods/allBrands"
      }
    });

    var tree = PCL.create("PCL.tree.Panel", {
      cls: "PSI",
      store: store,
      rootVisible: false,
      useArrows: true,
      viewConfig: {
        loadMask: true
      },
      columns: {
        defaults: {
          flex: 1,
          sortable: false,
          menuDisabled: true,
          draggable: false
        },
        items: [{
          xtype: "treecolumn",
          text: "品牌",
          dataIndex: "text"
        }]
      }
    });
    tree.on("itemdblclick", me.onOK, me);
    me.tree = tree;

    var wnd = PCL.create("PCL.window.Window", {
      title: "选择上级品牌",
      modal: true,
      width: 400,
      height: 300,
      layout: "fit",
      items: [tree],
      buttons: [{
        text: "没有上级品牌",
        handler: me.onNone,
        scope: me
      }, {
        text: "确定",
        handler: me.onOK,
        scope: me
      }, {
        text: "取消",
        handler: function () {
          wnd.close();
        }
      }]
    });
    me.wnd = wnd;
    wnd.show();
  },

  onOK: function () {
    var me = this;
    var tree = me.tree;
    var item = tree.getSelectionModel().getSelection();

    if (item === null || item.length !== 1) {
      PSI.MsgBox.showInfo("没有选择上级品牌");

      return;
    }

    var data = item[0].data;
    var parentItem = me.getParentItem();
    if (parentItem) {
      parentItem.setParentBrand(data);
    }
    me.wnd.close();
    me.focus();
  },

  onNone: function () {
    var me = this;
    var parentItem = me.getParentItem();
    if (parentItem) {
      parentItem.setParentBrand({
        id: "",
        fullName: ""
      });

    }
    me.wnd.close();
    me.focus();
  }
});
