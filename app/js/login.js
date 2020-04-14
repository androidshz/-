axios.defaults.baseURL = 'http://admin.jianmian.com:8080';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
;
! function () {
	var layer = layui.layer,
		form = layui.form,
		upload = layui.upload,
		table = layui.table;;
	//监听提交
	form.on('submit(login)', function (data) {
		//  发起ajax请求把数据提交给服务器
		axios.post('/login', data.field)
			.then(function (response) {
				console.log(response);
				//登录成功
				if (response.data.code == 1) {
					window.location.href = './index.html';
				} else {
					layer.msg(response.data.Msg);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		return false;
	});

	//执行实例
	var uploadInst = upload.render({
		elem: '#uploadimg' //绑定元素
		, url: axios.defaults.baseURL + '/upload' //上传接口
		, field: 'imgs'
		, done: function (res) {
			//上传完毕回调
			console.log(res);
			if (res.code == 1) {
				document.querySelector('#showimg').src = res.src;
				document.querySelector('#showimg').style.display = 'inline-block';
				// 设置输入框的值为图片地址
				document.querySelector('input[name="cover"]').value = res.src;
			}

		}
		, error: function () {
			//请求异常回调
		}
	});

	//监听课程添加
	form.on('submit(addcourse)', function (data) {
		//  发起ajax请求把数据提交给服务器
		delete data.field.imgs;
		axios.post('/course/add', data.field)
			.then(function (response) {
				console.log(response);
				//添加成功
				if (response.data.code == 1) {
					// window.location.href = './course.html';
				} else {
					layer.msg(response.data.Msg);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		return false;
	});

	// 课程列表信息
	table.render({
		elem: '#courselist'
		, height: 'auto'
		, url: axios.defaults.baseURL + '/course/index' //数据接口
		, page: true //开启分页
		, cols: [[ //表头
			{ field: 'cid', title: 'ID', width: 50, sort: true, fixed: 'left' }
			, { field: 'cname', title: '课程', width: 180 }
			, { field: 'cover', title: '封面', width: 180, templet: '#coursecover' }
			, { field: 'info', title: '简介' }
			, { fixed: 'right', width: 150, align: 'center', toolbar: '#barDemo' }
		]]
	});

	//监听工具条 
	table.on('tool(courselist)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
		var data = obj.data; //获得当前行数据
		console.log(data);
		var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
		if (layEvent === 'del') { //删除
			layer.confirm('真的删除行么', function (index) {
				obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
				axios.get('/course/del',{
					params: {
					  cid: data.cid
					}
				  })
				.then(res => {
					console.log(res);
					// 应该在删除成功之后关闭弹出窗  页应该判断 返回的状态码 code
					layer.close(index);
				})
				.catch(err => {
					console.error(err); 
					window.location.reload();
				})
			});
		}
	});

	// 修改课程   获取cid
	if(document.querySelector('.editcourse')){
		let cid = window.location.search.split('=').pop();
		// 根据cid到服务器获取原始信息
		axios.get('/course/get', {params:{cid}})
		.then(res => {
			console.log(res)
			form.val("editcourse", res.data.course);
			if(res.data.course.cover){
				document.querySelector('#showimg').src = res.data.course.cover;
				document.querySelector('#showimg').style.display = 'block';
			}
		})
		.catch(err => {
			console.error(err); 
		})
	}

	// 确认修改
	form.on('submit(editcourse)', function (data) {
		//  发起ajax请求把数据提交给服务器
		delete data.field.imgs;
		axios.post('/course/edit', data.field)
			.then(function (response) {
				//添加成功
				if (response.data.code == 1) {
					window.location.href = './course.html';
				} else {
					layer.msg(response.data.Msg);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		return false;
	});

	// 添加试题
	if(document.querySelector('.addque')){
		axios.get('/course/index')
		.then(res => {
			console.log(res.data.data);
			let list = res.data.data.map(function(course){
				return `<option value="${course.cid}">${course.cname}</option>`;
			});
			document.querySelector('select[name="cid"]').innerHTML = list.join('');
			form.render('select');
		})
		.catch(err => {
			console.error(err); 
		})
	}

	// 试题添加
	form.on('submit(addque)', function (data) {
		axios.post('/questions/add', data.field)
			.then(function (response) {
				console.log(response);
				//添加成功
				if (response.data.code == 1) {
					window.location.href = './questions.html';
				} else {
					layer.msg(response.data.Msg);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
		return false;
	});

}();