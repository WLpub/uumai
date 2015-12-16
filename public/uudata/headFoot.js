
  $(document).ready(function(){
    
    var foot = ' <div id="wrap-footer" class="wrap">'+
'<div class="container">'+
'<div class="footer clearfix">'+
        '<br>'+   '<br>'+
		
        '<div class="clear"></div>'+
        '<br>'+
        '<br>'+  '<br>'+
        '<br>'+
        '<div class="footer-menu">'+
            '<ul>'+
                '<li><strong>公司</strong></li>'+
				'<li><a href="./index.html">首页</a></li>'+
                '<li><a href="./FAQ.html#aboutuu">关于</a></li>'+

                '<li><a href="./contact.html">联系我们</a></li>'+
            '</ul>'+
            '<ul style="text-align: center">'+
                '<li><strong>产品服务</strong></li>'+
                '<li><a href="./FAQ.html#collectdata">蜂巢大数据采集</a></li>'+
                '<li><a href="./FAQ.html#antserach">蚂群大数据搜索</a></li>'+
                '<li><a href="./FAQ.html#customerservice">客户及服务</a></li>'+
            '</ul>'+
            '<ul style="text-align: right">'+
                '<li><strong>其它</strong></li>'+

                '<li><a href="./FAQ.html">常见问题</a></li>'+
                 '<li>招聘信息</li>' +
 
            '</ul>'+
        '</div>'+

        '<div class="clear"></div>'+
        '<br>'+
        '<p class="footer-copyright">&copy; 2014-2015 UU大数据</p>'+
        '<br>'+
        '<br>'+
'</div>'+
'</div>'+
'</div>';
var head='        <div class="header clearfix">'+
            '<div class="header-content">'+
 
                 '<div class="logo"><a href="./index.html">&nbsp;</a></div>'+

                '<div class="navbar">'+
                   ' <a class="btn btn-navbar pull-right" data-target=".nav-collapse" data-toggle="collapse">'+
                       ' <span class="icon-bar"></span>'+
                        '<span class="icon-bar"></span>'+
                        '<span class="icon-bar"></span> '+
                    '</a>'+
                '</div>'+

                '<div class="mainnav">'+
                 ' <ul class="nav nav-collapse">'+
                      '<li><a href="./index.html">首页</a></li>'+
                      //'<li><a href="./feature.html">特性c</a></li>'+
                      //'<li><a href="./price.html">价格<c/a></li>'+
                      '<li><a href="./service.html">专家服务</a></li>'+
                     // '<li><a href="./clients.html">典型客户</a></li>'+
                      '<li><a href="./contact.html">联系我们</a></li>'+
                      '<li><a href="./FAQ.html">常见问题</a></li>'+
                  '</ul>'+
                '</div>'+
            '</div>'+
       ' </div>';
       $('#headInclude').html(head);
        $('#footInclude').html(foot);
    var width = 670;

    // TODO fix vertical scrollbar in IE
    if (navigator.userAgent.toUpperCase().indexOf('MSIE') >= 0) width += 20;
  });