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
			self.end = self.$carouselImgsLen; // 14, not 13 because slice() includes the first li index but not the last

			// Set the first thumbnail image and the last thumb image in the visible thumbnail set
			self.thumbStart = self.current;
			self.thumbEnd = self.thumbStart + (self.options.maxThumbs - 1);

			// The range of images in the carousel - not sure if this is necessary
			self.visRange = $('.carousel ul li').slice(self.start, self.end);

			self.arrowClick();
			self.thumbClick();
		},

		sliderTransition: function(){
			var self = this;
			self.$slider.animate({
				'margin-left': -(self.current * self.$sliderImgWidth)
			});
		},

		quickTransition: function(currentImg){
			var self = this;

			var currentSliderImg = $(".slider ul li[data-num="+currentImg+"]");
			
			currentSliderImg
				.show()
					.siblings('li')
						.hide();
		},

		fadeTransition: function(currentImg){
			var self = this;

			var currentSliderImg = $(".slider ul li[data-num="+currentImg+"]");
			
			currentSliderImg
				.fadeIn("500")
					.siblings('li')
						.fadeOut("500");
		},

		carouselFWDTransition: function(hey){
			var self = this;
			self.$carousel.animate({
				'margin-left': -(hey * self.$carouselImgWidth)
			});
		},

		thumbClick: function(){
			var self = this;
			self.$carousel.find('li').on('click', function(e){
				e.preventDefault();
				self.current = $(this).data('num');
		
				// self.sliderTransition();
				self.quickTransition(self.current);
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

			if (self.current == self.$carouselImgsLen -1 && self.end >= self.$carouselImgsLen){
			
				self.thumbStart = self.current - (self.options.maxThumbs - 1);
				self.thumbEnd = self.current;

				// console.log("Begin");
				// console.log("The current index is", self.current);
				// console.log("End thumbslider is set to:", self.endThumbSlider);
				// console.log("The starting visible thumb is:", self.thumbStart);
				// console.log("The ending visible thumb is:", self.thumbEnd);
				// console.log("End");
				
				// Kickoff the carousel
				self.carouselFWDTransition(self.thumbStart);

			} else if (self.current == 0 && self.end >= self.$carouselImgsLen){

				self.thumbStart = self.current;
				self.thumbEnd = self.current + (self.options.maxThumbs - 1);
				self.endThumbSlider = false;

				// Kickoff the carousel
				self.carouselFWDTransition(self.thumbStart);
			
			} else if(self.current + self.options.maxThumbs > self.end && !self.endThumbSlider) {

				var amountOver = (self.current + self.options.maxThumbs) - self.end;

				self.endThumbSlider = true;
				self.thumbStart = self.current - amountOver;
				self.thumbEnd = self.end;

				// Kickoff the carousel
				self.carouselFWDTransition(self.thumbStart);

			} else if(self.current < self.thumbStart && ((self.current - self.options.maxThumbs) <= self.start)) {
	
				self.thumbStart = 0;
				self.thumbEnd = self.thumbStart + (self.options.maxThumbs - 1);

				// Kickoff the carousel
				self.carouselFWDTransition(self.thumbStart);

			} else if(self.current == (self.thumbStart - 1)) {
		
				self.thumbStart = self.current - (self.options.maxThumbs - 1);
				self.thumbEnd = self.current;
				self.endThumbSlider = false;

				// Kickoff the carousel
				self.carouselFWDTransition(self.thumbStart);
				
			}  else if ( self.current > self.thumbEnd && !self.endThumbSlider) {
				self.thumbStart = self.current;
				self.thumbEnd = self.thumbStart + (self.options.maxThumbs - 1);
				
				self.carouselFWDTransition(self.current);
				
			} else if ( self.current <= self.thumbEnd) {

				return self.current;

			} else {
				return self.current;
				
			}
		},

		cTh: function(){

			var self = this;
			var pos = self.current;
			var cThumb = $(".carousel li[data-num="+pos+"]");

			cThumb
				.addClass("cTH")
				.siblings("li")
					.removeClass("cTH");
		},

		setCurrent: function(dir){
			var self = this;
			var pos = self.current;

			pos += (~~(dir === 'next') || -1);

			self.current = (pos < 0) ? self.$sliderImgsLen - 1 : pos % self.$sliderImgsLen;

			// self.sliderTransition();
			self.quickTransition(self.current);
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