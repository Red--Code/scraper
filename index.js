const cheerio = require('cheerio');
const fs = require('fs');
const prepend = require('prepend');
var express = require('express');
var app = express();
var request = require('request');
var counter = 0;
var articles =new Array;
var dl= new Array;
var pages = new Array;
var links = new Array;
var page = 1;
var id = 5;
var main_delay = 6000;
var u = 0;
var lbl = new Array;
var qua;
var strpos;
var endpos;
for(var j = 0; j < 600 ; j++){
	pages[j]='http://www.film2movie.co/page/'+j;
};
function purge(naaddr){
	var n=0;
	while(naaddr.split('')[n]==' '){
		n++;
		pur = naaddr.slice(n,100);
	}
	console.log(n,' ',pur);
	return pur;
}
function btnamer(fname){
	qua = "دانلود با کیفیت ";
	lbl = fname.toLowerCase();
	if(lbl.search("trailer")>0){
		return 'تریلر';
	}
	if(lbl.search("/serial/")>0){
		strpos = lbl.search("s[/0-9/][/0-9/]e[/0-9/][/0-9/]");
		endpos = strpos + 6;
		qua += ' ';
		qua += lbl.slice(strpos ,endpos);
		console.log(qua);
	}
	if(lbl.search("480p")>0){
		qua += ' 480p';
		if(lbl.search("webdl")>0||lbl.search("web-dl")>0||lbl.search("wbdl")>0||lbl.search("wb-dl")>0){
			qua += ' web-dl';
		}
		if(lbl.search("bluray")>0||lbl.search("blu-ray")>0||lbl.search("brrip")>0){
			qua += ' BluRay';
		}
		if(lbl.search("web-rip")>0||lbl.search("wrip")>0||lbl.search("webrip")>0){
			qua += 'web-rip';
		}
		if(lbl.search("hdtv")>0){
				qua += ' HDTV';
			}
		if(lbl.search("x265")>0||lbl.search("hvec")>0){
				qua += ' x265';
		}
	return qua;
	}
	if(lbl.search("720p")>0){
		qua += ' 720p';
		if(lbl.search("webdl")>0||lbl.search("web-dl")>0||lbl.search("wbdl")>0||lbl.search("wb-dl")>0){
			qua += ' web-dl';
		}
		if(lbl.search("bluray")>0||lbl.search("blu-ray")>0||lbl.search("brrip")>0){
			qua += ' BluRay';
		}
		if(lbl.search("web-rip")>0||lbl.search("wrip")>0||lbl.search("webrip")>0){
			qua += 'web-rip';
		}
		if(lbl.search("hdtv")>0){
				qua += ' HDTV';
		}
		if(lbl.search("x265")>0||lbl.search("hvec")>0){
				qua += ' x265';
		}
	return qua;
	}	
	if(lbl.search("1080p")>0){
		qua += ' 1080p';
		if(lbl.search("webdl")>0||lbl.search("web-dl")>0||lbl.search("wbdl")>0||lbl.search("wb-dl")>0){
			qua += ' web-dl';
		}
		if(lbl.search("bluray")>0||lbl.search("blu-ray")>0||lbl.search("brrip")>0){
			qua += ' BluRay';
		}
		if(lbl.search("web-rip")>0||lbl.search("wrip")>0||lbl.search("webrip")>0){
			qua += 'web-rip';
		}
		if(lbl.search("hdtv")>0){
				qua += ' HDTV';
		}
		if(lbl.search("x265")>0||lbl.search("hvec")>0){
				qua += ' x265';
		}
	return qua;
	}
	if(qua == "دانلود با کیفیت "){
		return qua;
	}
}
function suffix_fs(id,naaddr,imaddr){
	setTimeout(function(){
	prepend('tmp/db/' + id + ' db.js' ,"const movie = {\n id:'"+id+"',\nname:'"+ purge(naaddr) + "',\ncover:'"+ '"' + imaddr + '"' +"',\nthumb:'"+ imaddr+"'\n}\n"+'movie.inline={inline_keyboard: [\n',function(file,err) {
	});	//prefix
	},400)
	setTimeout(function(){
	fs.appendFile("tmp/db/" + id + " db.js" ,'[\n{\ntext: "زیرنویس",\nurl:"http://subf2m.co/subtitles/"\n}\n],[\n{\ntext: "share",\nswitch_inline_query: movie.name\n}\n]\n]\n}\nmodule.exports = movie;\nmodule.exports.prop = "middle";\nmodule.exports.path = "../examples/" + movie.id + " db.js";',function(file,err) {
	});	//suffix
	},500)
}
function scraper(page){
console.log('page:',pages[page]);
request(pages[page], function (error, response, body) {
	if(error){
  console.log('error:', error); // Print the error if one occurred
	}
  console.log('statusCode:', response && response.statusCode);
const $ = cheerio.load(body);
counter=0;
$('section.right-main section.main article.box div.content a.more-link').each(function(i, elem) {
  articles[i] = $(this).attr('href');
  console.log(articles[i]);
  counter++;
});
console.log('total-items: ',counter);
engine(counter,page);
});
}
function engine (counter,page) {
		setTimeout(function(){
   		counter--;
		console.log('item:',counter);
   request(articles[counter], function (error, response, body) {
	const $ = cheerio.load(body)
	var caddr = $('article.box.singlepost div.content p strong a');
	if(caddr.attr('href') == undefined ||caddr.attr('href').toLowerCase().search(".mkv")<0){
		caddr = $('article.box.singlepost div.content p a');
	}
	var naaddr = $('article.box.singlepost div.titlehaver div.title h1 strong a').text().replace(/[^\w\s!?]/g,'');
	var imaddr = $('article.box.singlepost div.content p img#myimg.alignleft').attr('src');
	caddr.each(function(i,elem) {
		dl[counter] = $(this).attr('href');
		if(dl[counter].toLowerCase().search(".mkv")>0 || dl[counter].toLowerCase().search(".mp4")>0){
	fs.appendFile('tmp/db/' + id + ' db.js','[\n	{\n		text:"'+btnamer(dl[counter])+'",\n		url:"'+'http://opizo.com/81105/?'+dl[counter]+'"\n	}	],\n',function(err) {
	}); //main
	}
});
suffix_fs(id,naaddr,imaddr);
id++;
});
	if(page == 599){
		return 0;
	}
	if(counter == 0){
	page++;
	scraper(page);
	}
	else{
		engine(counter,page);
	}
	},main_delay)
}
scraper(page);
app.listen(3000, function() {
  console.log('Telegram app listening on port 3000!');
});