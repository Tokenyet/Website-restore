$(document).ready(function() {
	function getHtml(content, linkId) {
		var html = '';
		for (var i in content['works']) {
			var item = content['works'][i],
				tag = '',
				screenshot = '',
				inner = '',
				links = '';
			screenshot = '<div class="wg-screenshot wg-img-effect">';
			screenshot = screenshot + '<img src="' + item.cover + '" class="wg-screenshot-img">';
			screenshot = screenshot + '<span class="wg-preview-link">';
			if (item.download) {
				for (var j in item.download)
					screenshot = screenshot + '<a href="' + item.download[j] + '" target="_blank"><i class="icon-download"></i></a>';
			}
			if (item.demo) {
				for (var j in item.demo)
					screenshot += '<a href="' + item.demo[j] + '" target="_blank"><i class="icon-eye"></i></a>';
			}			
			if (item.video) {
				for (var j in item.video)
					screenshot += '<a href="' + item.video[j] + '" target="_blank"><i class="icon-play"></i></a>';
			}
			screenshot = screenshot + '<span></div>';
			inner = '<a  href="' + item.download[0] + '" class="wg-name" target="_blank">' + item.title + '</a>';
			inner += '<div class="wg-desc">' + item.description + '</div>';

			tag = screenshot + inner;
			tag = '<li class="wg-item">' + tag + '</li>';
			html += tag;
		}
		html = '<ul class="wg-container invisible" data-pos="' + linkId +  '">' + html + '</ul>';
		return html;
	}
	$("script[type='text/works-gallery']").each(function(index, value) {
		var $container = $(this),
			$widget,
			content = $container.text(),
			eachrow = 7,
			row = 0;

		content.trim();
		content = JSON.parse(content);
		var html = '', selector = '', wglinkId = 0;
		for (var i in content['content']) {
			selector = selector + '<li data-target="wglinkId' + wglinkId + '">' + content['content'][i]['title'] + '</li>';
			html = html + getHtml(content['content'][i], 'wglinkId' + wglinkId);
			wglinkId++;
		}
		selector = '<div class="wg-nav"><ul>' + selector + '</ul></div>';
		html = '<div class="wg-wrapper">' + selector + html + '</div>';
		$widget = $(html);

		$container.after($widget);
		var change_selector = (function() {
			var prev;
			return function(selector) {
				if (prev) {
					prev.removeClass('wg-nav-active');
					var off = prev.attr('data-target');
					$widget.find('[data-pos="' + off + '"]').addClass('invisible');
				}
				if (selector) {
					selector.addClass('wg-nav-active');
					var on = selector.attr('data-target');
					$widget.find('[data-pos="' + on + '"]').removeClass('invisible');
					prev = selector;
				}
			};
		})();
		var default_select = $widget.find('.wg-nav li:first');
		change_selector(default_select);

		$widget.find('.wg-nav li').click(function() {
			change_selector($(this));
		});
	});
});