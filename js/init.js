let lists;
let time;
const taskList = {};
taskList.EventType = {
	ITEMCHANGE : 'itemchange'
}
const dayTimeLists=[
  {title:"コーヒー飲む", content:"withバターとか"},
  {title:"ストレッチ", content:"10分くらいやればいいのかな"},
  {title:"瞑想", content:"5分とか"},
  {title:"青汁", content:"ちゃんと飲む"},
  {title:"Apple Watch", content:"毎日つけましょう"}
];
const nightTimeLists=[
  {title:"コーヒー準備", content:"タイマーセットまで"},
  {title:"歯磨き", content:"そろそろ歯はやばい"},
  {title:"日記", content:"軽く書こう"},
  {title:"ハーブティー飲みたい", content:"To よりよい睡眠"}
];
(function(){

	const currentTime = new Date();
  const currentHours = currentTime.getHours();
  time = currentHours < 12 ? "day-time" : "night-time"

	var currentCookie = document.cookie;
	var result = {};
	if(currentCookie != ''){　// != null
		var cookies = currentCookie.split( '; ' );
		for( var i = 0; i < cookies.length; i++ ){
			var cookie = cookies[ i ].split( '=' );
			// クッキーの名前をキーとして 配列に追加する
			result[ cookie[ 0 ] ] = decodeURIComponent( cookie[ 1 ] );
		}
		console.log("split : ");
		console.log(result);
		lists = result;
	}else {
		document.cookie = 'datatest1=hoge';
		document.cookie = 'datatest2=huga';
		document.cookie = 'max-age=43200';
		console.log("set : " + document.cookie);
	}

	/******/

}())



/*
cookieで一回入ったらその期間中はずっと値を保持する
なければ作成
保持した値を持ってくる

*/