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

			// Not sure about this	
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

			self.$carouselWidth = $(".carousel").width();

			// Current image & thumb
			self.current = 0;
			
			// Pull in options
			self.options = $.extend({}, $.fn.Gallery.options, options);

			// If the last set of thumbnail images is visible, this should be set to true
			self.endThumbSlider = false;

			// Starting and ending thumb images
			self.start = 0;
			self.end = self.$carouselImgsLen; // 13, not 12 because slice() includes the first li index but not the last

			// Set the first thumbnail image and the last thumb image in the visible thumbnail set
			self.thumbStart = self.current;
			self.thumbEnd = self.thumbStart + (self.options.maxThumbs - 1);

			// The range of images in the carousel - not sure if this is necessary
			self.visRange = $('.carousel ul li').slice(self.start, self.end);

			console.log("The range is:", self.visRange);
			console.log("The current index is", self.current);
			console.log("The starting slice thumb index is", self.start);
			console.log("The last slice thumb index is", self.end);
			console.log("The starting visible thumb is:", self.thumbStart);
			console.log("The ending visible thumb is:", self.thumbEnd);

			self.arrowClick();
			self.thumbClick();
		},

		sliderTransition: function(){
			var self = this;
			self.$slider.animate({
				'margin-left': -(self.current * self.$sliderImgWidth)
			});
		},

		carouselFWDTransition: function(){
			var self = this;

			if (self.current == self.$carouselImgsLen -1 && self.end >= self.$carouselImgsLen){
				console.log("hooray");
				self.thumbStart = self.current - (self.options.maxThumbs - 1);
				self.thumbEnd = self.current;

				console.log(self.thumbStart);
				console.log(self.thumbEnd);
				console.log(self.current);
				
				self.$carousel.animate({
				'margin-left': -(self.thumbStart * self.$carouselImgWidth)
				});
			} else if (self.current == 0 && self.end >= self.$carouselImgsLen){

				self.thumbStart = self.current;
				self.thumbEnd = self.current + (self.options.maxThumbs - 1);

				console.log(self.thumbStart);
				console.log(self.thumbEnd);
				self.$carousel.animate({
				'margin-left': -(self.thumbStart * self.$carouselImgWidth)
				});

			} else if(self.current + self.options.maxThumbs >= self.end && !self.endThumbSlider) {
				console.log("end of the line");
				var amountOver = (self.current + self.options.maxThumbs) - self.end;
				var newSlideMultiplier = self.options.maxThumbs - amountOver;

				console.log(amountOver);
				console.log(newSlideMultiplier);

				self.endThumbSlider = false;
				self.thumbStart = self.current - newSlideMultiplier + 1;
				self.thumbEnd = self.end;
				console.log(self.thumbStart);
				self.$carousel.animate({
				'margin-left': -(self.thumbStart * self.$carouselImgWidth)
				});

			} else if(self.current < self.thumbStart && ((self.current - self.options.maxThumbs) <= self.start)) {
				console.log("end of the line go back");
				self.thumbStart = 0;
				self.thumbEnd = self.current;

				self.$carousel.animate({
				'margin-left': -(self.thumbStart * self.$carouselImgWidth)
				});

			} else if(self.current == (self.thumbStart - 1)) {
				console.log("moving back");
				self.thumbStart = self.current - (self.options.maxThumbs - 1);
				self.thumbEnd = self.current;
				console.log(self.thumbStart);
				console.log(self.thumbEnd);
				self.$carousel.animate({
				'margin-left': -(self.thumbStart * self.$carouselImgWidth)
				});

			} else {
				console.log("The current index is", self.current);
				console.log("The starting visible thumb is:", self.thumbStart);
				console.log("The ending visible thumb is:", self.thumbEnd);
				
				self.$carousel.animate({
				'margin-left': -(self.current * self.$carouselImgWidth)
				});
			}
			
		},

		thumbClick: function(){
			var self = this;

			self.$carousel.find('li').on('click', function(e){
				e.preventDefault();
				self.current = $(this).data('num');
		
				self.sliderTransition();
				self.cTh();
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

			if (self.current < self.thumbStart) {
				console.log("carousel transitioned");
				console.log(self.current);
				self.carouselFWDTransition();
				
			} else if ( self.current <= self.thumbEnd) {

				console.log("moving");
				console.log("The starting visible thumb is:", self.thumbStart);
				console.log("The ending visible thumb is:", self.thumbEnd);
				
			}  else if ( self.current >= self.thumbEnd) {
				self.thumbStart = self.current;
				self.thumbEnd = self.thumbStart + (self.options.maxThumbs - 1);
				
				console.log("The current index is greater than the last ending thumb");
		
				self.carouselFWDTransition();
				
			} else if ( self.current > self.thumbEnd && self.endThumbSlider) {
				self.thumbStart = self.current;
				// self.start = self.current;
				// self.end = self.current + self.options.maxThumbs;
				console.log("carousel fwd 2 transitioned");
			
				console.log(self.thumbStart);
				
				self.carouselFWDTransition();
				
			} else {
				console.log(self.current);
			}
		},

		cTh: function(){

			var self = this;
			var pos = self.current;

			$(".carousel li[data-num="+pos+"]")
				.addClass("cTH")
				.siblings("li")
					.removeClass("cTH");
			// console.log("cTh shot");
		},

		setCurrent: function(dir){
			var self = this;
			var pos = self.current;

			pos += (~~(dir === 'next') || -1);

			self.current = (pos < 0) ? self.$sliderImgsLen - 1 : pos % self.$sliderImgsLen;

			console.log("slider images length is:", self.$sliderImgsLen);
			console.log("the current image index is:", self.current);
			self.sliderTransition();
			self.testF();
			self.cTh();
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
		maxThumbs: 5
	};
})(jQuery, window, document);