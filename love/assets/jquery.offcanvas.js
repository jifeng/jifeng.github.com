!function(t,e,n){var a=n("#topMenu"),o="click.fndtn";a.length>0&&a.css("margin-top",-1*a.height());var i=n("#sidebarButton");i.length>0&&n("#sidebarButton").on(o,function(t){t.preventDefault(),n("body").toggleClass("active")});var s=n("#menuButton");s.length>0&&n("#menuButton").on(o,function(t){t.preventDefault(),n("body").toggleClass("active-menu")});var l=n("#switchPanels");l.length>0&&n("#switchPanels dd").on(o,function(t){t.preventDefault();var e=n(this).children("a").attr("href"),a=n(e).index();n(this).toggleClass("active").siblings().removeClass("active"),n(e).parent().css("left",-100*a+"%")}),n("#nav li a").on(o,function(t){t.preventDefault();var e=n(this).attr("href"),a=n(e);n("html, body").animate({scrollTop:a.offset().top},300)})}(this,document,jQuery);