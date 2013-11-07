if(typeof Object.create !== 'function'){
	Object.create = function(obj){
		function F(){};
		F.prototype = obj;
		return new F();
	};
}

(function($, window, document, undefined){
var Gallery = {
	init: function(options, elem){
		var self = this;
		
		var nav = $("div.slider-nav");
		var slider = $("div.slider ul");
		var carousel = $("div.carousel ul");



		self.elem = elem;
		self.$elem = $(elem);

		self.$nav = self.$elem.find(nav);
		self.$slider = self.$elem.find(slider);
		self.$carousel = self.$elem.find(carousel);
		self.$sliderImgs = self.$slider.find('img');
		self.$sliderImgWidth = self.$sliderImgs[0].width;
		self.$sliderImgsLen = self.$sliderImgs.length;
		self.$carouselImgs = self.$carousel.find('img');
		self.$carouselImgWidth = self.$carouselImgs[0].width;
		self.$carouselImgsLen = self.$carouselImgs.length;

		self.current = 0;
		
		self.options = $.extend({}, $.fn.Gallery.options, options);

		self.start = self.current;
		self.end = self.options.maxThumbs;
		self.visRange = $('.carousel ul li').slice(self.start, self.end);
		console.log(self.visRange);

		self.arrowClick();
		// self.thumbArrowClick();
		self.thumbClick();
	},

	sliderTransition: function(){
		var self = this;
		self.$slider.animate({
			'margin-left': -(self.current * self.$sliderImgWidth)
		});
	},

	carouselTransition: function(){
		var self = this;

		if (self.current == self.$carouselImgsLen -1 && self.end == self.current + self.options.maxThumbs){
			console.log("hooray");
			self.start = self.current - self.options.maxThumbs;
			self.end = self.current;
			self.$carousel.animate({
			'margin-left': -(self.options.maxThumbs * self.$carouselImgWidth)
			});
		} else {
			self.$carousel.animate({
			'margin-left': -(self.current * self.$carouselImgWidth)
			});
		}
		
	},

	thumbClick: function(){
		var self = this;
		self.$carousel.find('li').on('click', function(){
		
			self.current = $(this).data('num');
	
			self.sliderTransition();
		});
	},

	arrowClick: function(){
		var self = this;
		self.$nav.find('button').on('click', function(){
			var dataDir = $(this).data('dir');
			self.setCurrent(dataDir); // takes care of slider
			
		});
	},

	testF: function(){
		var self = this;
		var pos = self.current;
		var lastThumb = self.$carouselImgsLen -1;

		if (self.current <= self.start) {
			self.start = self.current;
			self.end = self.current + self.options.maxThumbs;

			console.log(self.start);
			console.log(self.end);
			self.carouselTransition();

		} else if (self.current >= self.end) {
			self.start = self.current;
			self.end = self.current + self.options.maxThumbs;
			self.carouselTransition();
			console.log("carousel transitioned");
			console.log(self.start);
			console.log(self.end);

		
		} else {
			console.log(pos);
		}
	},

	// thumbArrowClick: function(){
	// 	var self = this;
	// 	var pos = self.current;
	// 	var range = self.current + (self.options.maxThumbs - 1);

	// 	self.$nav.find('button.thumb-dir').on('click', function(){
	// 		var dataDir = $(this).data('dir');
	// 		// self.setCurrent(dataDir);
	// 		if(pos >= range || pos <= range){
	// 			self.setCurrent();
	// 		} else {
	// 			console.log(pos);
	// 		}
			
	// 	});
	// },

	setCurrent: function(dir){
		var self = this;
		var pos = self.current;

		pos += (~~(dir === 'next') || -1);

		self.current = (pos < 0) ? self.$sliderImgsLen - 1 : pos % self.$sliderImgsLen;


		self.sliderTransition();
		self.testF();
		// self.carouselTransition();
	}
};

$.fn.Gallery = function(options){
	return this.each(function(){
		var gallery = Object.create(Gallery);
		gallery.init(options, this);
		$.data(this, 'Gallery', gallery);

	});
};

$.fn.Gallery.options = {
	coords: null,
	maxThumbs: 4
};
})(jQuery, window, document);