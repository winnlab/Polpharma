define([
	'canjs',
	'core/appState',
	'social/vk/vk_sdk',
	'social/fb/fb_sdk',
	'velocity',
	'velocity_ui',
	
	'css!app/global/css/global.css'
],
	function (can, appState) {

		return can.Control.extend({
			defaults: {
				viewpath: 'app/global/',

				animationInterval: 1000, //800

				circleAmount: 7, //7
				blockLimit: 20, //20
				blockScale: 10, //10

				scaleTimeStart: 14000 //14000
			}
		}, {

			init: function () {
				var self = this,
					html = can.view(self.options.viewpath + 'index.stache', {
						appState: appState
					});
				self.scaleTime = self.options.scaleTimeStart;

				self.element.append(html);
				self.initAnimations();
				self.colorSchemeLocalStorage();
				self.initVkSDK();
				self.initFbSDK();
			},

			initAnimations: function () {
				var self = this;

				self.initCircles();
				self.pulsingCircle();
			},

			initCircles: function () {
				var self = this;

				var $wrapper = $('#circles');
				var partWeight = self.options.blockScale / ((self.options.circleAmount - 1) * 2);
				var limit = self.options.circleAmount*2;

				for (var i=0; i < limit; i++) {
					var $circleBlock = $('<div class="circle circle'+i+'"></div>');
					$wrapper.append($circleBlock);

					var scale = partWeight * i;
					$circleBlock.css('z-index', -i);
					$circleBlock.velocity({scale:scale}, 0, function (){
						$(this).velocity({scale: self.options.blockScale}, 'linear', self.scaleTime);
					});
				}

				self.circles();
			},

			circles: function () {
				var self = this;

				var num = 0;
				var blockCounter = 0;
				var $wrapper = $('#circles');

				window.setInterval(function () {
					// increase by num 1, reset to 0 at 6
					num = (num + 1) % (self.options.circleAmount - 1);

					var circleBlock = $('<div class="circle circle'+num+'"></div>');

					if ( blockCounter > self.options.blockLimit ) {
						$wrapper.find('.circle:first-child').remove();
					}

					$wrapper.append(circleBlock);

					blockCounter = blockCounter + 1;

					self.scaleBlock(circleBlock);

				}, self.options.animationInterval);
			},

			scaleBlock: function ( block ) {
				var self = this;

				block.velocity({scale: self.options.blockScale}, 'linear', self.scaleTime);
			},

			pulsingCircle: function () {
				var self = this;

				window.setInterval(function () {
					$('.pulsingCircle').velocity("callout.pulse");
				}, self.options.animationInterval);
			},

			'.colorSwitcherItem click': function (el, ev) {
				ev.preventDefault();
				var color =  el.data('color');

				console.log(color);

				$('.colorSwitcherItem.active').removeClass('active');
				el.addClass('active');
				appState.attr('colorScheme', color);
				localStorage.setItem('colorScheme', color);
			},

			colorSchemeLocalStorage: function () {
				var colorScheme = false;

				if (colorScheme = localStorage.getItem('colorScheme')) {
					appState.attr('colorScheme', colorScheme);
					$('.colorSwitcherItem.active').removeClass('active');
					$('.colorSwitcherItem.' + colorScheme).addClass('active');
				}
			},

			initVkSDK: function () {
				VK.init({
					apiId: appState.attr('socialConfig.vk.apiId')
				})
			},

			initFbSDK: function () {

				FB.init({
					appId: appState.attr('socialConfig.facebook.clientID'),
					cookie: true,
					xfbml: true,
					version: 'v2.1'
				});
			}

		});
	}
);