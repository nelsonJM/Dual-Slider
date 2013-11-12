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

			self.elem = elem;
			self.$elem = $(elem);

			// self.$nav = self.$elem.find(nav);
			self.$nav = self.$elem.find($("div.slider-nav"));
			// self.$slider = self.$elem.find(slider);
			self.$slider = self.$elem.find($("div.slider ul"));
			// self.$carousel = self.$elem.find(carousel);
			self.$carousel = self.$elem.find($("div.carousel ul"));
			self.$sliderImgs = self.$slider.find('img');
			
			self.$sliderImgWidth = self.$sliderImgs[0].width;
			self.$sliderImgsLen = self.$sliderImgs.length;
			self.$carouselImgs = self.$carousel.find('img');
			self.$carouselImgWidth = self.$carouselImgs[0].width;
			self.$carouselImgsLen = self.$carouselImgs.length;

			self.$carouselWidth = self.$elem.find($(".carousel")).width();

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

			// The range of images in the slider - not sure if this is necessary
			self.sliderRange = self.$elem.find($('.slider ul li'));

			// The range of images in the carousel - not sure if this is necessary
			self.carouselRange = self.$elem.find($('.carousel ul li'));

			self.cTh();
			self.arrowClick();
			self.thumbClick();
		},

		sliderTransition: function(){
			var self = this;
			self.$slider.animate({
				'margin-left': -(self.current * self.$sliderImgWidth)
			});
		},

		quickTransition: function(){
			var self = this;

			var $currentSliderLi = $(self.sliderRange[self.current]);
			
			$currentSliderLi
				.show()
					.siblings('li')
						.hide();
		},

		fadeTransition: function(currentImg){
			var self = this;

			var $currentSliderLi = $(self.sliderRange[self.current]);
			
			$currentSliderLi
				.fadeIn("500")
					.siblings('li')
						.fadeOut("500");
		},

		carouselFWDTransition: function(hey){
			var self = this;
			
			self.$carousel.animate({
				'margin-left': -(hey * (self.$carouselImgWidth + self.options.marRtTh))
			});
		},

		thumbClick: function(){
			var self = this;
			self.carouselRange.on('click', function(e){
				e.preventDefault();
				self.current = $(this).data('num');
		
				// self.sliderTransition();
				self.quickTransition();
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
			var $currentThumbLi = $(self.carouselRange[pos]);
			$currentThumbLi
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
			self.quickTransition();
			// self.fadeTransition();
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
		maxThumbs: 5,
		marRtTh: 5
	};
})(jQuery, window, document);