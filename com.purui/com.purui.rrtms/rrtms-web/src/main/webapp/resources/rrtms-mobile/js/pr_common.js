
  	
      	// 保存iOS平台导入的类对象
var UIAlertView=null;
// 保存Android导入对象和全局环境对象
var AlertDialog=null,mainActivity=null;
// H5 plus事件处理
/**
 * 在iOS平台通过NJS显示系统提示框
 */

function plusReady(){
	switch ( plus.os.name ) {
		case "Android":
		// 程序全局环境对象
		mainActivity = plus.android.runtimeMainActivity();
		// 导入AlertDialog类
		AlertDialog = plus.android.importClass("android.app.AlertDialog");
		break;
		case "iOS":
		// 导入UIAlertView类
		UIAlertView = plus.ios.importClass("UIAlertView");
		break;
		default:
		break;
	}
}

function njsAlertForiOS(title,message,btname){
/*
 * Objective-C 代码
 * 
　　// 创建UIAlertView类的实例对象
　　UIAlertView *view = [UIAlertView alloc];
　　// 设置提示对话上的内容
　　[view initWithTitle:@"自定义标题"       // 提示框标题
　　    message:@"使用NJS的原生弹出框，可自定义弹出框的标题、按钮"  // 提示框上显示的内容
　　    delegate:nil                // 点击提示框后的通知代理对象，nil类似js的null，意为不设置
　　    cancelButtonTitle:@"确定(或者其他字符)"     // 提示框上取消按钮的文字
　　    otherButtonTitles:nil];        // 提示框上其它按钮的文字，设置为nil表示不显示
　　// 调用show方法显示提示对话框，在OC中使用[]语法调用对象的方法
　　[view show];
 */

	// 创建UIAlertView类的实例对象
	var view = new UIAlertView();
	// 设置提示对话上的内容
	view.initWithTitlemessagedelegatecancelButtonTitleotherButtonTitles(title // 提示框标题
		, message // 提示框上显示的内容
		, null // 操作提示框后的通知代理对象，暂不设置
		, btname // 提示框上取消按钮的文字
		, null ); // 提示框上其它按钮的文字，设置为null表示不显示
	// 调用show方法显示提示对话框
	view.show();
}

/**
 * 在Android平台通过NJS显示系统提示框
 */
function njsAlertForAndroid(title,message,btname){


	// 创建提示框构造对象，构造函数需要提供程序全局环境对象，通过plus.android.runtimeMainActivity()方法获取
	var dlg = new AlertDialog.Builder(mainActivity);
	// 设置提示框标题
	dlg.setTitle(title);
	// 设置提示框内容
	dlg.setMessage(message);
	// 设置提示框按钮
	dlg.setPositiveButton(btname,null);
	// 显示提示框
	dlg.show();
}
function showNjsView(title,message,btname){
	switch ( plus.os.name ) {
		case "Android":
		njsAlertForAndroid(title,message,btname);
		break;
		case "iOS":
		njsAlertForiOS(title,message,btname);
		break;
		default:
		alert( "此平台不支持！" );
		break;
	}
}

	function deviceVibrate() {
    
    switch ( plus.os.name ) {
    	case "iOS":
            if ( plus.device.model.indexOf("iPhone") >= 0 ) {
                plus.device.vibrate();
                
            } else {
               
            }
    	break;
    	default:
    		plus.device.vibrate();
            
    	break;
    }
	
}