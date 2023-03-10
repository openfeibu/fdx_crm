<?php if (!defined('THINK_PATH')) exit();?>
<!DOCTYPE html>
<html>

<head>
  <title><?php echo ($title); ?> - <?php echo ($productionName); ?></title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="<?php echo ($uri); ?>Public/Images/favicon.ico" rel="shortcut icon" type="image/x-icon" />
</head>

<body style="background-image:url(<?php echo ($uri); ?>Public/Images/background.png)">
  


<style type="text/css">
  #loading-mask {
    background-color: white;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 20000;
  }

  #loading {
    height: auto;
    position: absolute;
    left: 45%;
    top: 40%;
    padding: 2px;
    z-index: 20001;
  }

  #loading .loading-indicator {
    background: white;
    color: #444;
    font: bold 13px Helvetica, Arial, sans-serif;
    height: auto;
    margin: 0;
    padding: 10px;
  }

  #loading-msg {
    font-size: 10px;
    font-weight: normal;
  }

  input {
    caret-color: #ad4e00;
    background: transparent !important;
    box-shadow: none !important;
    border-top: 0px solid transparent !important;
    border-left: 0px solid transparent !important;
    border-right: 0px solid transparent !important;
    border-bottom: 1px solid #dbdbdb !important;

    color: #030852 !important;
    font-weight: 500 !important;
    font-size: 130% !important;
  }

  input:focus {
    border-color: transparent transparent #9254de transparent !important;
    border-width: 2px !important;
  }

  input::placeholder {
    color: #ddd0d0 !important;
  }

  ::selection {
    background-color: #006d75;
    color: white;
  }
</style>

<div id="loading-mask"></div>
<div id="loading">
  <div class="loading-indicator">
    <img src="<?php echo ($uri); ?>Public/Images/loader.gif" width="32" height="32"
      style="margin-right: 8px; float: left; vertical-align: top;" />
    欢迎使用<?php echo ($productionName); ?>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <br /> <span id="loading-msg">正在加载中，请稍候...</span>
  </div>
</div>

<script src="<?php echo ($uri); ?>Public/PCL/pcl.js" type="text/javascript"></script>
<script src="<?php echo ($uri); ?>Public/PCL/ext-lang-zh_CN.js" type="text/javascript"></script>
<script src="<?php echo ($uri); ?>Public/Scripts/PSI/Const.js?dt=<?php echo ($dtFlag); ?>" type="text/javascript"></script>

<link href="<?php echo ($uri); ?>Public/Content/foundation/foundation.min.css" rel="stylesheet" type="text/css" />
<link href="<?php echo ($uri); ?>Public/Content/foundation/app.css" rel="stylesheet" type="text/css" />

<div class="top-bar">
  <div class="top-bar-left">
    <ul class="menu">
      <li class="menu-text"><span style="font-size: 1.5em;color:#c7c6c6"><?php echo ($productionNameFull); ?></span></li>
    </ul>
  </div>
  <div class="top-bar-right">
    <ul class="menu">
      <li><a href="<?php echo ($uri); ?>Home/Help/index?t=login" target="_blank"><span
            style="font-size: 1em;color:#c7c6c6">实施指南</span></a></li>
    </ul>
  </div>
</div>

<div class="psi_content">
  <div class="row">
    <div class="large-8 columns">
      <h3 style="margin-top: 60px;color:#196d6d;border-left:6px solid #e6e6e6;padding-left: 10px;">
        管理就是界定企业的使命，并激励和组织人力资源去实现这个使命。界定使命是企业家的任务，而激励与组织人力资源是领导力的范畴，二者的结合就是管理。
      </h3>
      <div style="text-align: right;margin-right: 30px;color:#196d6d;">彼得·德鲁克</div>
    </div>

    <div class="large-4 columns">
      <div style="margin: 50px 0 0 0">
        <form>
          <div class="row" style="margin-top:70px;">
            <div class="small-1 columns">
            </div>
            <div class="small-11 columns">
              <input type="text" id="editLoginName" placeholder="登录名">
            </div>
          </div>
          <div class="row">
            <div class="small-1 columns">
            </div>
            <div class="small-11 columns">
              <input type="password" id="editPassword" placeholder="密码">
            </div>
          </div>
          <div class="row">
            <div class="small-1 columns">&nbsp;</div>
            <div class="small-6 columns">
              <a href="#" class="button expanded psi_secondary" id="buttonOK">登&nbsp;&nbsp;录</a>
            </div>
            <div class="small-5 columns">&nbsp;</div>
          </div>
        </form>
      </div>

      <div id="divInfoCallout" style="display: none" data-closable>
        <div style="border-left: 6px solid #fa8c16;padding: 10px 10px 10px 20px;background-color: #fff1f0;color:#fa541c"
          id="divInfo">
        </div>
      </div>
      <div style="height: 10px;"></div>
      <div style="border-left: 6px solid #1890ff;padding: 10px 10px 10px 20px;background-color: #e6f7ff;color:#196d6d"
        id="divDemoWarning"><?php echo ($demoInfo); ?></div>
    </div>
  </div>
</div>
<footer>
  <div class="row">
    <div class="large-3 columns">&nbsp;</div>
    <div class="large-6 columns">
      <span style="font-size: 0.8em;color:#a7a7a7">Copyright &copy; 2015-<?php echo ($year); ?>
        艾格林门信息服务（大连）有限公司, All Rights Reserved</span>
    </div>
    <div class="large-3 columns">&nbsp;</div>
  </div>
</footer>

<style>
  .psi_content {
    margin: 20px;
    min-height: calc(100vh - 140px);
  }

  .footer {
    height: 50px;
  }
</style>

<script type="text/javascript">
  PCL.onReady(() => {
    PSI.Const.BASE_URL = "<?php echo ($uri); ?>";

    if ("<?php echo ($demoInfo); ?>" == "") {
      PCL.get("divDemoWarning").remove();
    }

    var editLoginName = document.getElementById("editLoginName");
    var editPassword = document.getElementById("editPassword");
    var loginName = PCL.util.Cookies.get("PSI_user_login_name");
    if (loginName) {
      editLoginName.value = decodeURIComponent(loginName);
      editPassword.focus();
    } else {
      editLoginName.focus();
    }

    editLoginName.onkeydown = function (e) {
      if (e.keyCode == 13) {
        editPassword.focus();
      }
    };
    editPassword.onkeydown = function (e) {
      if (e.keyCode == 13) {
        doLogin(editLoginName.value, editPassword.value);
      }
    }
    document.getElementById("buttonOK").onclick = function () {
      doLogin(editLoginName.value, editPassword.value);
    }

    PCL.get("loading").remove();
    PCL.get("loading-mask").remove();
  });

  function doLogin(loginName, password) {
    if (!loginName) {
      showInfo("没有输入登录名");
      setInputFocus();
      return;
    }
    if (!password) {
      showInfo("没有输入密码");
      setInputFocus();
      return;
    }

    var r = {
      url: PSI.Const.BASE_URL + "Home/User/loginPOST",
      method: "POST",
      params: {
        loginName: loginName,
        password: password
      },
      callback: function (options, success, response) {
        if (success) {
          var data = PCL.JSON.decode(response.responseText);
          if (data.success) {
            setLoginNameToCookie(loginName);

            var returnPage = "<?php echo ($returnPage); ?>";
            if (returnPage) {
              location.replace(returnPage);
            } else {
              location.replace(PSI.Const.BASE_URL);
            }
          } else {
            showInfo(data.msg);
            setInputFocus();
          }
        }
      }
    };

    PCL.Ajax.request(r);
  }

  function setInputFocus() {
    var editLoginName = document.getElementById("editLoginName");
    var editPassword = document.getElementById("editPassword");
    if (editLoginName.value) {
      editPassword.focus();
    } else {
      editLoginName.focus();
    }
  }

  function showInfo(info) {
    document.getElementById("divInfoCallout").style.display = "";
    document.getElementById("divInfo").innerHTML = info;
  }

  function setLoginNameToCookie(loginName) {
    loginName = encodeURIComponent(loginName);
    const dt = PCL.Date.add(new Date(), PCL.Date.YEAR, 1);
    PCL.util.Cookies.set("PSI_user_login_name", loginName, dt);
  }
</script>

</body>

</html>