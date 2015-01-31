"use strict";function _pointsCtrl(a,b,c,d,e){a.navigators=[];var f=this;f.navigator=d,b.get("/api/navigators").success(function(b){a.navigators=b,b.length&&(a.selectedNavigator=a.navigators[0]),c.syncUpdates("navigator",a.navigators)}),a.showPoints=function(a){d.id=a.currentTarget.id;var b="/api/points?navigatorID="+a.currentTarget.id,c=e(b);c.query().$promise.then(function(a){d.points=a,d.reloadPoints(),console.log(a.length)})}}function tableCtrl(a,b,c){var d=this;d.navigator=c,a.points=c.points,a.$on("points:updated",function(){d.points=c.points}),d.points=[{x:1,y:2,date:"ewqe"}],a.reloadPoints=c.reloadPoints,a.deletePoint=function(a){var c="/api/points/"+a.currentTarget.id,d=b(c);d["delete"](function(){console.log("Point was removed")})}}angular.module("ngAgroApp",["ngCookies","ngResource","ngSanitize","btford.socket-io","ui.router","ui.bootstrap","yaMap","datatables"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){b.otherwise("/"),c.html5Mode(!0),d.interceptors.push("authInterceptor")}]).factory("authInterceptor",["$rootScope","$q","$cookieStore","$location",function(a,b,c,d){return{request:function(a){return a.headers=a.headers||{},c.get("token")&&(a.headers.Authorization="Bearer "+c.get("token")),a},responseError:function(a){return 401===a.status?(d.path("/login"),c.remove("token"),b.reject(a)):b.reject(a)}}}]).factory("Points",["$resource",function(a){var b=a("/api/points/:id",{id:"@id"},{"delete":{method:"DELETE"}});return b}]).service("loader",function(){this.state=!1}).run(["$rootScope","$location","Auth",function(a,b,c){a.$on("$stateChangeStart",function(a,d){c.isLoggedInAsync(function(a){d.authenticate&&!a&&b.path("/login")})})}]);var app=angular.module("ngAgroApp");app.controller("_pointsCtrl",_pointsCtrl),app.controller("tableCtrl",tableCtrl),app.service("navigator",["$rootScope",function(a){var b=this;b.id=null,b.points=[],b.reloadPoints=function(){a.$broadcast("points:updated",{data:b.points})}}]),_pointsCtrl.$inject=["$scope","$http","socket","navigator","$resource"],tableCtrl.$inject=["$scope","$resource","navigator"],angular.module("ngAgroApp").config(["$stateProvider",function(a){a.state("_points",{url:"/_points",templateUrl:"app/_points/_points.html",controller:"_pointsCtrl as points"})}]),angular.module("ngAgroApp").config(["$stateProvider",function(a){a.state("login",{url:"/login",templateUrl:"app/account/login/login.html",controller:"LoginCtrl"}).state("signup",{url:"/signup",templateUrl:"app/account/signup/signup.html",controller:"SignupCtrl"}).state("settings",{url:"/settings",templateUrl:"app/account/settings/settings.html",controller:"SettingsCtrl",authenticate:!0})}]),angular.module("ngAgroApp").controller("LoginCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){a.user={},a.errors={},a.login=function(d){a.submitted=!0,d.$valid&&b.login({email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){a.errors.other=b.message})},a.loginOauth=function(a){d.location.href="/auth/"+a}}]),angular.module("ngAgroApp").controller("SettingsCtrl",["$scope","User","Auth",function(a,b,c){a.errors={},a.changePassword=function(b){a.submitted=!0,b.$valid&&c.changePassword(a.user.oldPassword,a.user.newPassword).then(function(){a.message="Password successfully changed."})["catch"](function(){b.password.$setValidity("mongoose",!1),a.errors.other="Incorrect password",a.message=""})}}]),angular.module("ngAgroApp").controller("SignupCtrl",["$scope","Auth","$location","$window",function(a,b,c,d){a.user={},a.errors={},a.register=function(d){a.submitted=!0,d.$valid&&b.createUser({name:a.user.name,email:a.user.email,password:a.user.password}).then(function(){c.path("/")})["catch"](function(b){b=b.data,a.errors={},angular.forEach(b.errors,function(b,c){d[c].$setValidity("mongoose",!1),a.errors[c]=b.message})})},a.loginOauth=function(a){d.location.href="/auth/"+a}}]),angular.module("ngAgroApp").controller("AdminCtrl",["$scope","$http","Auth","User",function(a,b,c,d){a.users=d.query(),a["delete"]=function(b){d.remove({id:b._id}),angular.forEach(a.users,function(c,d){c===b&&a.users.splice(d,1)})}}]),angular.module("ngAgroApp").config(["$stateProvider",function(a){a.state("admin",{url:"/admin",templateUrl:"app/admin/admin.html",controller:"AdminCtrl"})}]),angular.module("ngAgroApp").controller("MainCtrl",["$scope","$http","socket","$injector",function(a,b,c,d){a.loader=d.get("loader"),a.loader.state=!0;var e,f=[],g=[],h=function(b){if(!b.length)return void alert("No points!");console.log("Count points returned: "+b.length),a.geoObjects=[],f=[b[0].x,b[0].y],g=[b[b.length-1].x,b[b.length-1].y];var c=0,d=[];d[0]=[];var e=.01,h=[];for(var i in b)i>1&&Math.sqrt(Math.pow(b[i].x-b[i-1].x,2)+Math.pow(b[i].y-b[i-1].y,2))>e&&(c++,d[c]=h,h=[]),d[c].push([b[i].x,b[i].y]);console.log("pointsArrays = "+d.length);for(var i in d)a.geoObjects.push({geometry:{type:"LineString",coordinates:d[i]}});if(d.length){var j=new Date(b[0].date);j=j.getHours()+":"+j.getMinutes();var k=new Date(b[b.length-2].date);k=k.getHours()+":"+k.getMinutes(),a.geoObjects.push({geometry:{type:"Point",coordinates:d[0][0]},properties:{balloonContentHeader:"Start of track",balloonContentBody:b[0].navigatorID,balloonContentFooter:j,hintContent:"Start of track"}}),a.geoObjects.push({geometry:{type:"Point",coordinates:[b[b.length-2].x,b[b.length-2].y]},properties:{balloonContentHeader:"End of track",balloonContentBody:b[0].navigatorID,balloonContentFooter:k,hintContent:"End of track"}})}};a.clearFilters=function(){a.dateTo=null,a.dateFrom=null,a.selectedNavigator=null,i.setHours(0),i.setMinutes(0),a.timeFrom=i,a.timeTo=new Date,a.geoObjects=[]},a.navigators=[],b.get("/api/navigators").success(function(b){a.navigators=b,b.length&&(a.selectedNavigator=a.navigators[0]),c.syncUpdates("navigator",a.navigators)}),a.addNavigtor=function(){""!==a.navigatorName&&(b.post("/api/navigators",{name:a.navigatorName,description:a.navigatorDescription,isActive:!!a.navigatorIsActive}),a.navigatorName="",a.navigatorDescription="",a.navigatorIsActive=!1)},a.deleteNavigator=function(a){b["delete"]("/api/navigators/"+a._id)},a.$on("$destroy",function(){c.unsyncUpdates("navigator")}),a.getTrack=function(){var c,d;c=new Date(a.dateFrom),c.setHours(a.timeFrom.getHours()),c.setMinutes(a.timeFrom.getMinutes()),d=new Date(a.dateTo),d.setHours(a.timeTo.getHours()),d.setMinutes(a.timeTo.getMinutes()),b({url:"/api/points",method:"GET",params:{navigatorID:a.selectedNavigator._id,dateFrom:c,dateTo:d}}).success(h)},a.zoom=10,a.beforeInit=function(){var b=ymaps.geolocation;b.get({provider:"yandex",mapStateAutoApply:!0}).then(function(b){b&&(f=b),a.center=b.geoObjects.position,a.$digest()})},a.geoObjects=[],a.afterMapInit=function(a){e=a},a.del=function(){e.destroy()},a.created=!0,a.moveToBeginTrack=function(){a.loader.state=!1,a.type="yandex#publicMapHybrid",e.panTo(f)},a.moveToFinishTrack=function(){a.type="yandex#publicMapHybrid",e.panTo(g)},a.format="dd.MM.yyyy",a.maxDate=new Date,a.today=function(){a.dateTo=new Date},a.dateOptions={formatYear:"yy",startingDay:1,showWeeks:!1},a.today(),a.clear=function(){a.dateFrom=null,a.dateTo=null},a.openDateFrom=function(b){b.preventDefault(),b.stopPropagation(),a.dateFromOpened=!0},a.openDateTo=function(b){b.preventDefault(),b.stopPropagation(),a.dateToOpened=!0};var i=new Date;i.setHours(0),i.setMinutes(0),a.timeFrom=i,a.timeTo=new Date}]),angular.module("ngAgroApp").config(["$stateProvider",function(a){a.state("main",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("ngAgroApp").controller("NewdataCtrl",["$scope","$http","socket",function(){}]),angular.module("ngAgroApp").config(["$stateProvider",function(a){a.state("newdata",{url:"/newdata",templateUrl:"app/newdata/newdata.html",controller:"NewdataCtrl"})}]),angular.module("ngAgroApp").factory("Auth",["$location","$rootScope","$http","User","$cookieStore","$q",function(a,b,c,d,e,f){var g={};return e.get("token")&&(g=d.get()),{login:function(a,b){var h=b||angular.noop,i=f.defer();return c.post("/auth/local",{email:a.email,password:a.password}).success(function(a){return e.put("token",a.token),g=d.get(),i.resolve(a),h()}).error(function(a){return this.logout(),i.reject(a),h(a)}.bind(this)),i.promise},logout:function(){e.remove("token"),g={}},createUser:function(a,b){var c=b||angular.noop;return d.save(a,function(b){return e.put("token",b.token),g=d.get(),c(a)},function(a){return this.logout(),c(a)}.bind(this)).$promise},changePassword:function(a,b,c){var e=c||angular.noop;return d.changePassword({id:g._id},{oldPassword:a,newPassword:b},function(a){return e(a)},function(a){return e(a)}).$promise},getCurrentUser:function(){return g},isLoggedIn:function(){return g.hasOwnProperty("role")},isLoggedInAsync:function(a){g.hasOwnProperty("$promise")?g.$promise.then(function(){a(!0)})["catch"](function(){a(!1)}):a(g.hasOwnProperty("role")?!0:!1)},isAdmin:function(){return"admin"===g.role},getToken:function(){return e.get("token")}}}]),angular.module("ngAgroApp").factory("User",["$resource",function(a){return a("/api/users/:id/:controller",{id:"@_id"},{changePassword:{method:"PUT",params:{controller:"password"}},get:{method:"GET",params:{id:"me"}}})}]),angular.module("ngAgroApp").factory("Modal",["$rootScope","$modal",function(a,b){function c(c,d){var e=a.$new();return c=c||{},d=d||"modal-default",angular.extend(e,c),b.open({templateUrl:"components/modal/modal.html",windowClass:d,scope:e})}return{confirm:{"delete":function(a){return a=a||angular.noop,function(){var b,d=Array.prototype.slice.call(arguments),e=d.shift();b=c({modal:{dismissable:!0,title:"Confirm Delete",html:"<p>Are you sure you want to delete <strong>"+e+"</strong> ?</p>",buttons:[{classes:"btn-danger",text:"Delete",click:function(a){b.close(a)}},{classes:"btn-default",text:"Cancel",click:function(a){b.dismiss(a)}}]}},"modal-danger"),b.result.then(function(b){a.apply(b,d)})}}}}}]),angular.module("ngAgroApp").directive("mongooseError",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("keydown",function(){return d.$setValidity("mongoose",!0)})}}}),angular.module("ngAgroApp").controller("NavbarCtrl",["$scope","$location","Auth","$injector",function(a,b,c,d){a.menu=[{title:"Desktop",link:"/"},{title:"Points",link:"/_points"}];var e=d.get("loader");a._isBusy=e.state,a.isCollapsed=!0,a.isLoggedIn=c.isLoggedIn,a.isAdmin=c.isAdmin,a.getCurrentUser=c.getCurrentUser,a.logout=function(){c.logout(),b.path("/login")},a.isActive=function(a){return a===b.path()}}]),angular.module("ngAgroApp").factory("socket",["socketFactory",function(a){var b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b});return{socket:c,syncUpdates:function(a,b,d){d=d||angular.noop,c.on(a+":save",function(a){var c=_.find(b,{_id:a._id}),e=b.indexOf(c),f="created";c?(b.splice(e,1,a),f="updated"):b.push(a),d(f,a,b)}),c.on(a+":remove",function(a){var c="deleted";_.remove(b,{_id:a._id}),d(c,a,b)})},unsyncUpdates:function(a){c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}]),angular.module("ngAgroApp").run(["$templateCache",function(a){a.put("app/_points/_points.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><h3>id = {{ points.navigator.id }}</h3><div class=table-responsive><table class=table><thead><tr><th>Name</th><th>Active</th><th>Id</th><th>Link</th></tr></thead><tbody><tr ng-repeat="navigator in navigators"><td>{{ navigator.name }}</td><td>{{ navigator.isActive }}</td><td>{{ navigator._id }}</td><td><button class="btn btn-xs" id={{navigator._id}} ng-click=showPoints($event)>-></button></td></tr></tbody></table><hr><div ng-controller="tableCtrl as table"><h3>id = {{ table.navigator.id }}</h3><table datatable=ng class="row-border hover"><thead><tr><th>x</th><th>y</th><th>date</th><th>delete</th></tr></thead><tbody><tr ng-repeat="points in table.points"><td>{{ points.x }}</td><td>{{ points.y }}</td><td>{{ points.date }}</td><td><button class="btn btn-xs btn-danger" id={{points._id}} ng-click=deletePoint($event)>x</button></td></tr></tbody></table><button class="btn btn-success" ng-click=reloadData()><i class="fa fa-refresh"></i> Update table</button></div></div></div></div>'),a.put("app/account/login/login.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Login</h1><p>Accounts are reset on server restart from <code>server/config/seed.js</code>. Default account is <code>test@test.com</code> / <code>test</code></p><p>Admin account is <code>admin@admin.com</code> / <code>admin</code></p></div><div class=col-sm-12><form class=form name=form ng-submit=login(form) novalidate><div class=form-group><label>Email</label><input type=email name=email class=form-control ng-model=user.email required></div><div class=form-group><label>Password</label><input type=password name=password class=form-control ng-model=user.password required></div><div class="form-group has-error"><p class=help-block ng-show="form.email.$error.required && form.password.$error.required && submitted">Please enter your email and password.</p><p class=help-block ng-show="form.email.$error.email && submitted">Please enter a valid email.</p><p class=help-block>{{ errors.other }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Login</button> <a class="btn btn-default btn-lg btn-register" href=/signup>Register</a></div><hr><div><a class="btn btn-facebook" href="" ng-click="loginOauth(\'facebook\')"><i class="fa fa-facebook"></i> Connect with Facebook</a> <a class="btn btn-google-plus" href="" ng-click="loginOauth(\'google\')"><i class="fa fa-google-plus"></i> Connect with Google+</a> <a class="btn btn-twitter" href="" ng-click="loginOauth(\'twitter\')"><i class="fa fa-twitter"></i> Connect with Twitter</a></div></form></div></div><hr></div>'),a.put("app/account/settings/settings.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Change Password</h1></div><div class=col-sm-12><form class=form name=form ng-submit=changePassword(form) novalidate><div class=form-group><label>Current Password</label><input type=password name=password class=form-control ng-model=user.oldPassword mongoose-error><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.other }}</p></div><div class=form-group><label>New Password</label><input type=password name=newPassword class=form-control ng-model=user.newPassword ng-minlength=3 required><p class=help-block ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || submitted)">Password must be at least 3 characters.</p></div><p class=help-block>{{ message }}</p><button class="btn btn-lg btn-primary" type=submit>Save changes</button></form></div></div></div>'),a.put("app/account/signup/signup.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-sm-12><h1>Sign up</h1></div><div class=col-sm-12><form class=form name=form ng-submit=register(form) novalidate><div class=form-group ng-class="{ \'has-success\': form.name.$valid && submitted,\n                                            \'has-error\': form.name.$invalid && submitted }"><label>Name</label><input name=name class=form-control ng-model=user.name required><p class=help-block ng-show="form.name.$error.required && submitted">A name is required</p></div><div class=form-group ng-class="{ \'has-success\': form.email.$valid && submitted,\n                                            \'has-error\': form.email.$invalid && submitted }"><label>Email</label><input type=email name=email class=form-control ng-model=user.email required mongoose-error><p class=help-block ng-show="form.email.$error.email && submitted">Doesn\'t look like a valid email.</p><p class=help-block ng-show="form.email.$error.required && submitted">What\'s your email address?</p><p class=help-block ng-show=form.email.$error.mongoose>{{ errors.email }}</p></div><div class=form-group ng-class="{ \'has-success\': form.password.$valid && submitted,\n                                            \'has-error\': form.password.$invalid && submitted }"><label>Password</label><input type=password name=password class=form-control ng-model=user.password ng-minlength=3 required mongoose-error><p class=help-block ng-show="(form.password.$error.minlength || form.password.$error.required) && submitted">Password must be at least 3 characters.</p><p class=help-block ng-show=form.password.$error.mongoose>{{ errors.password }}</p></div><div><button class="btn btn-inverse btn-lg btn-login" type=submit>Sign up</button> <a class="btn btn-default btn-lg btn-register" href=/login>Login</a></div><hr><div><a class="btn btn-facebook" href="" ng-click="loginOauth(\'facebook\')"><i class="fa fa-facebook"></i> Connect with Facebook</a> <a class="btn btn-google-plus" href="" ng-click="loginOauth(\'google\')"><i class="fa fa-google-plus"></i> Connect with Google+</a> <a class="btn btn-twitter" href="" ng-click="loginOauth(\'twitter\')"><i class="fa fa-twitter"></i> Connect with Twitter</a></div></form></div></div><hr></div>'),a.put("app/admin/admin.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p><ul class=list-group><li class=list-group-item ng-repeat="user in users"><strong>{{user.name}}</strong><br><span class=text-muted>{{user.email}}</span> <a ng-click=delete(user) class=trash><span class="glyphicon glyphicon-trash pull-right"></span></a></li></ul></div>'),a.put("app/main/main.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=spinner><div class=cube1></div><div class=cube2></div></div><div class=container><div class=row><div class=col-md-6><accordion close-others=oneAtATime><accordion-group is-open=status.openTabNewNavigator><accordion-heading>Add new Navigator <i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': status.openTabNewNavigator, \'glyphicon-chevron-right\': !status.openTabNewNavigator}"></i></accordion-heading><form class=form-horizontal><div class=form-group><label for=navigatorName class="col-sm-2 control-label">Name</label><div class=col-sm-10><input class=form-control id=navigatorName ng-model=navigatorName></div></div><div class=form-group><label for=navigatorDescription class="col-sm-2 control-label">Description</label><div class=col-sm-10><textarea class=form-control id=navigatorDescription ng-model=navigatorDescription> </textarea></div></div><div class=form-group><div class="col-sm-offset-2 col-sm-10"><div class=checkbox><label><input type=checkbox ng-model=navigatorIsActive> Is active?</label></div></div></div><div class=form-group><div class="col-sm-offset-2 col-sm-10"><button type=submit class="btn btn-default" ng-click=addNavigtor()>Save</button></div></div></form></accordion-group><accordion-group is-open=status.openTabListNavigators><accordion-heading>Navigator lists <i class="pull-right glyphicon" ng-class="{\'glyphicon-chevron-down\': status.openTabListNavigators, \'glyphicon-chevron-right\': !status.openTabListNavigators}"></i></accordion-heading><div class=table-responsive><table class=table><thead><tr><th>Name</th><th>Active</th><th>Id</th></tr></thead><tbody><tr ng-repeat="navigator in navigators"><td>{{ navigator.name }}</td><td>{{ navigator.isActive }}</td><td>{{ navigator._id }}</td></tr></tbody></table></div></accordion-group></accordion></div></div><hr><div class=row><div class=col-md-2><label>Select navigators</label><select class=form-control ng-model=selectedNavigator ng-options="navigator.name for navigator in navigators"></select><p>Description: <em>{{selectedNavigator.description}}</em></p></div><div class=col-md-2><label>Dates</label><p class=input-group><input class=form-control datepicker-popup={{format}} ng-model=dateFrom is-open=dateFromOpened max-date={{maxDate}} datepicker-options=dateOptions ng-required=true close-text="Close"> <span class=input-group-btn><button type=button class="btn btn-default" ng-click=openDateFrom($event)><i class="glyphicon glyphicon-calendar"></i></button></span></p><p class=input-group><input class=form-control datepicker-popup={{format}} ng-model=dateTo is-open=dateToOpened max-date={{maxDate}} datepicker-options=dateOptions ng-required=true close-text="Close"> <span class=input-group-btn><button type=button class="btn btn-default" ng-click=openDateTo($event)><i class="glyphicon glyphicon-calendar"></i></button></span></p></div><div class=col-md-1><label>From</label><timepicker ng-model=timeFrom show-meridian=false></timepicker></div><div class=col-md-1><label>To</label><timepicker ng-model=timeTo show-meridian=false></timepicker></div><div class=col-md-2><label>Filters</label><br><button class="btn btn-sm btn-danger" ng-click=clearFilters()><i class=glyphicon-remove-circle></i> Clear</button> <button class="btn btn-sm btn-success" ng-click=getTrack()><i class=glyphicon-ok-circle></i> Apply</button></div></div><hr><div class=row><div class=col-md-12><div class=map-container ng-switch on=created><ya-map ng-switch-when=true ya-zoom="{{ zoom }}" ya-after-init=afterMapInit($target) ya-controls="zoomControl typeSelector fullscreenControl"><ya-geo-object ng-repeat="geoObject in geoObjects" ya-source=geoObject></ya-geo-object></ya-map></div></div><div class=col-md-12><hr><button class="btn btn-sm btn-primary" ng-click=moveToBeginTrack()>Move to Begin track</button> <button class="btn btn-sm btn-primary" ng-click=moveToFinishTrack()>Move to Finish track</button> <button class="btn btn-sm btn-primary" ng-click="created=!created">Hide/Show</button></div></div></div>'),a.put("app/newdata/newdata.html",'<div ng-include="\'components/navbar/navbar.html\'"></div><div class=container><div class=row><div class=col-lg-6><form class=form-horizontal><div class=form-group><label for=navigatorName class="col-sm-2 control-label">Name</label><div class=col-sm-10><input class=form-control id=navigatorName ng-model=navigatorName></div></div><div class=form-group><label for=navigatorDescription class="col-sm-2 control-label">Description</label><div class=col-sm-10><textarea class=form-control id=navigatorDescription ng-model=navigatorDescription> </textarea></div></div><div class=form-group><div class="col-sm-offset-2 col-sm-10"><div class=checkbox><label><input type=checkbox ng-model=navigatorIsActive> Is active?</label></div></div></div><div class=form-group><div class="col-sm-offset-2 col-sm-10"><button type=submit class="btn btn-default" ng-click=addNavigtor()>Save</button></div></div></form><select ng-model=selected><option ng-selected=selected ng-repeat="navigator in navigators" value={{navigator.description}}>{{navigator.name}}</option></select><p>{{selected}}</p></div></div></div><div class=map-container ng-switch on=created><ya-map ng-switch-when=true ya-zoom=16 ya-center=[36.18,51.73] ya-after-init=afterMapInit($target)><ya-geo-object ya-source=geoObjects[0] ya-options="{balloonHasCloseButton:false,strokeColor:\'#000000\',strokeWidth:2,strokeOpacity:0.5}"></ya-geo-object></ya-map></div><button class="btn btn-xs btn-primary" ng-click="created=!created">Удалить</button>'),a.put("components/modal/modal.html",'<div class=modal-header><button ng-if=modal.dismissable type=button ng-click=$dismiss() class=close>&times;</button><h4 ng-if=modal.title ng-bind=modal.title class=modal-title></h4></div><div class=modal-body><p ng-if=modal.text ng-bind=modal.text></p><div ng-if=modal.html ng-bind-html=modal.html></div></div><div class=modal-footer><button ng-repeat="button in modal.buttons" ng-class=button.classes ng-click=button.click($event) ng-bind=button.text class=btn></button></div>'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>Agro-Vision 0.4.2</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li><li ng-show=isAdmin() ng-class="{active: isActive(\'/admin\')}"><a href=/admin>Admin</a></li></ul><ul class="nav navbar-nav navbar-right"><li ng-class="{\'sk-spinner-chasing-dots\': _isBusy}" class="sk-spinner pull-right"><div class=sk-dot1></div><div class=sk-dot2></div></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/signup\')}"><a href=/signup>Sign up</a></li><li ng-hide=isLoggedIn() ng-class="{active: isActive(\'/login\')}"><a href=/login>Login</a></li><li ng-show=isLoggedIn()><p class=navbar-text>Hello {{ getCurrentUser().name }}</p></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/settings\')}"><a href=/settings><span class="glyphicon glyphicon-cog"></span></a></li><li ng-show=isLoggedIn() ng-class="{active: isActive(\'/logout\')}"><a href="" ng-click=logout()>Logout</a></li></ul></div></div></div>')}]);