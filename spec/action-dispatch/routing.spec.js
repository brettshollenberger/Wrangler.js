// 'use strict';

// describe('ActionDispatch.Routing.facultyRoute', function () {

//   var facultyRoute;

//   beforeEach(module('ActionDispatch.Routing', ['ActionRouteProvider', function(facultyRouteProvider) {
//     facultyRouteProvider
//       .templateExtension('haml')
//       .when('/', {
//         templateUrl: 'views/main.html',
//         controller: 'MainCtrl',
//         title: 'Home'
//       })
//       .when('/dashboard')
//       .route('/security', {title: 'Securitas'})
//       .route('/security/devices')
//       .route('/security/devices/new')
//       .route('/crime-watch')
//       .resource('cameras')
//       .route('/cameras/live-video')
//       .route('/posts/:id/comments/:id')
//       .route('/map/:country/:state/:city')
//       .route('/users/cameras/:id');
//   }]));

//   beforeEach(inject(function(_facultyRoute_) {
//     facultyRoute = _facultyRoute_;
//   }));

//   it('features the default information provided by $routeProvider', function() {
//     expect(facultyRoute.routes['/'].controller).toEqual('MainCtrl');
//     expect(facultyRoute.routes['/'].templateUrl).toEqual('views/main.html');
//   });

//   it('adds a title property', function() {
//     expect(facultyRoute.routes['/'].title).toEqual('Home');
//   });

//   it('adds a path helper property', function() {
//     expect(facultyRoute.routes['/'].helper).toEqual('home_path');
//   });

//   it('parses hyphenated route names', function() {
//     expect(facultyRoute.routes['/cameras/live-video'].helper).toEqual('cameras_live_video_path');
//     expect(facultyRoute.routes['/cameras/live-video'].controller).toEqual('CamerasLiveVideoCtrl');
//     expect(facultyRoute.routes['/crime-watch'].controller).toEqual('CrimeWatchCtrl');
//   });

//   it('adds a resource method', function() {
//     expect(facultyRoute.routes['/cameras'].helper).toEqual('cameras_path');
//     expect(facultyRoute.routes['/cameras'].controller).toEqual('CamerasCtrl');
//     expect(facultyRoute.routes['/cameras/new'].helper).toEqual('new_cameras_path');
//     expect(facultyRoute.routes['/cameras/new'].controller).toEqual('CamerasNewCtrl');
//     expect(facultyRoute.routes['/cameras/:id/edit'].helper).toEqual('edit_cameras_path');
//     expect(facultyRoute.routes['/cameras/:id/edit'].controller).toEqual('CamerasEditCtrl');
//     // Todo: Update this to understand singular/plural inflections e.g.: camera_path
//     expect(facultyRoute.routes['/cameras/:id'].helper).toEqual('show_cameras_path');
//     expect(facultyRoute.routes['/cameras/:id'].controller).toEqual('CamerasShowCtrl');
//   });

//   it('sets opinionated defaults if none are provided', function() {
//     expect(facultyRoute.routes['/dashboard'].controller).toEqual('DashboardCtrl');
//     expect(facultyRoute.routes['/dashboard'].templateUrl).toEqual('views/dashboard/dashboard.haml');
//   });

//   it('adds a route method', function() {
//     expect(facultyRoute.routes['/security'].controller).toEqual('SecurityCtrl');
//   });

//   it('nests routes', function() {
//     expect(facultyRoute.routes['/security'].controller).toEqual('SecurityCtrl');
//     expect(facultyRoute.routes['/security/devices'].controller).toEqual('SecurityDevicesCtrl');
//     expect(facultyRoute.routes['/security/devices'].helper).toEqual('security_devices_path');
//     expect(facultyRoute.routes['/security/devices'].templateUrl).toEqual('views/security/devices.haml');
//   });

//   it('deeply nests routes', function() {
//     expect(facultyRoute.routes['/security/devices/new'].templateUrl).toEqual('views/security/devices/new.haml');
//     expect(facultyRoute.routes['/security/devices/new'].controller).toEqual('SecurityDevicesNewCtrl');
//   });

//   it('parses show controller correctly for nested resources', function() {
//     expect(facultyRoute.routes['/users/cameras/:id'].controller).toEqual('UsersCamerasShowCtrl');
//   });

//   it('sets a default template extension', function() {
//     expect(facultyRoute.routes['/dashboard'].templateUrl).toEqual('views/dashboard/dashboard.haml');
//   });

//   it('parses route helpers to URLs', function() {
//     expect(facultyRoute.getURLFromHelper('cameras_path')).toEqual('/cameras');
//     expect(facultyRoute.getURLFromHelper('new_cameras_path')).toEqual('/cameras/new');
//     expect(facultyRoute.getURLFromHelper('edit_cameras_path')).toEqual('/cameras/:id/edit');
//     expect(facultyRoute.getURLFromHelper('show_cameras_path')).toEqual('/cameras/:id');
//     expect(facultyRoute.getURLFromHelper('dashboard_path')).toEqual('/dashboard');
//     expect(facultyRoute.getURLFromHelper('security_path')).toEqual('/security');
//     expect(facultyRoute.getURLFromHelper('security_devices_path')).toEqual('/security/devices');
//     expect(facultyRoute.getURLFromHelper('home_path')).toEqual('/');
//   });

//   it('deal with nested routes', function() {
//     expect(facultyRoute.routes['/posts/:id/comments/:id'].helper).toEqual('posts_comments_path');
    
//     var post = {title: 'Great Post', id: 15};
//     var comment = {content: 'Great content', id: 20};
//     expect(facultyRoute.getURLFromHelper('posts_comments_path', post, comment)).toEqual('/posts/15/comments/20');

//     var country = {country: 'USA'};
//     var state   = {state: 'Pennsylvania'};
//     var city    = {city: 'Philadelphia'};
//     expect(facultyRoute.getURLFromHelper('map_path', country, state, city)).toEqual('/map/USA/Pennsylvania/Philadelphia');
//   });

// });
