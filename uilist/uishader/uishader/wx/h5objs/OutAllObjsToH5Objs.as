package out
{
	import flash.display3D.Context3D;
	import flash.events.Event;
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.utils.ByteArray;
	import flash.utils.Dictionary;
	import flash.utils.setTimeout;
	
	import mx.controls.Alert;
	
	import _Pan3D.base.ObjData;
	import _Pan3D.load.LoadInfo;
	import _Pan3D.load.LoadManager;
	
	import _me.Scene_data;
	
	import modules.scene.sceneSave.FilePathManager;

	public class OutAllObjsToH5Objs
	{
		private static var instance:OutAllObjsToH5Objs;
		public static function getInstance():OutAllObjsToH5Objs{
			if(!instance){
				instance = new OutAllObjsToH5Objs();
			}
			return instance;
		}
		
		public function OutAllObjsToH5Objs()
		{
		}
		
		public  function run():void
		{
		
			//var txtFilter:FileFilter = new FileFilter("Text", ".xml;*.xml;");
			var file:File = new File(FilePathManager.getInstance().getPathByUid("expToH5"));
			file.addEventListener(Event.SELECT,onSelect);
			file.browseForDirectory("选择文件夹");
			function onSelect(e:Event):void
			{
				rootFlieName=decodeURI((e.target as File).url)
				showDic(e.target as File)
			}
		}
		private var rootFlieName:String
		
		private var outFileItem:Array;
		private function showDic($perentFile:File):void
		{
			this.outFileItem=this.getFileDicLyfName($perentFile);
			oneByOne()
			
		}
		private var selectByName:String
		private function oneByOne():void
		{
			if(this.outFileItem.length){
			   	var $fileurl:String=this.outFileItem.pop()
				selectByName=$fileurl
				//trace(this.outFileItem.length,$fileurl);
				var loaderinfo : LoadInfo = new LoadInfo($fileurl, LoadInfo.BYTE, onObjByteLoad,10);
				LoadManager.getInstance().addSingleLoad(loaderinfo);
		
			
			}else{
			
				Alert.show("结束")
			}
		}
		protected function onObjByteLoad($byte:ByteArray):void
		{
			var obj:Object = $byte.readObject();
		   var toFileUrl:String=	selectByName.replace(decodeURI(rootFlieName),decodeURI(File.desktopDirectory.url)+"/h5objs");
			
			this.writeToFile(obj,toFileUrl)
	
	
			setTimeout(oneByOne,100)//可能没有加载完成，特再1秒后重刷新一下
			
		}
		public  function writeToFile($obj:Object,toFileUrl:String):void
		{
			var $objData:ObjData=new ObjData;
			$objData.vertices=$obj.vertices;
			$objData.normals=$obj.normals;
			$objData.uvs=$obj.uvs;
			$objData.lightUvs=$obj.lightUvs;
			$objData.indexs=$obj.indexs;
			
			trace(this.outFileItem.length,"==>",toFileUrl);
			var fs:FileStream = new FileStream();
			var $file:File=new File(toFileUrl);
			fs.open($file, FileMode.WRITE);
			fs.writeUTF(toFileUrl);
			this.writeVecFloat($objData.vertices,fs);
			this.writeVecFloat($objData.normals,fs);
			this.writeVecFloat($objData.uvs,fs);
			this.writeVecFloat($objData.lightUvs,fs);
			this.writeVecInt($objData.indexs,fs);
			
			fs.close();
		}
		
		public function writeVecFloat(arr:Vector.<Number>,fs:FileStream):void
		{
			fs.writeInt(arr.length);
			for( var i:Number=0;i<arr.length;i++){
				fs.writeFloat(arr[i]);
			}
			
		}
		public function writeVecInt(arr:Vector.<uint>,fs:FileStream):void
		{
			fs.writeInt(arr.length)
			for( var i:Number=0;i<arr.length;i++){
				fs.writeInt(arr[i])
			}
			
		}
		
		private function  getFileDicLyfName($perentFile:File):Array
		{
			//E:\codets\game\arpg\arpg\res\role
			//var baseURL:String="file:///C:/Users/liuxingsheng/Desktop/stuff/webgl/WebGLEngine/assets/ui/data.h5ui"
			var baseURL:String=$perentFile.url
			//baseURL="file:///G:/卡通场景/"
			var $file:File=new File(baseURL)
			var $dis:Dictionary=new Dictionary;
			var $fileArrStr:Array=new Array()
			if($file.exists){
				var eeee:Array=$file.getDirectoryListing();
				var fs:FileStream = new FileStream();    
				for(var i:Number=0;i<eeee.length;i++)
				{
					var sonFile:File=eeee[i];
					if(sonFile.exists){
						if(sonFile.isDirectory){
							$fileArrStr=$fileArrStr.concat(getFileDicLyfName(sonFile));
						}else{
							var $name:String=sonFile.name;
							if(sonFile.extension=="objs"){
								
								$fileArrStr.push(decodeURI(sonFile.url))
							}
						}

					}
				}
			}
			
			return $fileArrStr
		}
		private function readAST($file:File):void
		{
		
			
			trace($file.name)
			
			
		}

	}
}