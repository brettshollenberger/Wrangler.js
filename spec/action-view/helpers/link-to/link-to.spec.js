// 'use strict';

// describe('FacultyView.Helpers.linkTo', function () {

//   var Router, $httpBackend, $rootScope, directive,
//   template, mainView, parentScope, scope, $scope, 
//   $compile, nav, $location;

//   beforeEach(module('FacultyDispatch.Routing'));
//   beforeEach(module('FacultyView.Helpers', ['facultyRouteProvider', function(Router) {
//     Router
//       .route('/', {title: 'Home', templateUrl: 'views/main.html'})
//       .route('/dashboard', {title: 'Dashboard'})
//       .route('/posts/:id/comments/:id')
//       .route('/map/:country/:state/:city')
//       .resource('cameras');
//   }]));

//   beforeEach(inject(function (_$httpBackend_, _$rootScope_, _$compile_, _$location_) {
    
//     $httpBackend = _$httpBackend_;
//     $rootScope   = _$rootScope_;
//     $compile     = _$compile_;
//     $location    = _$location_;

//     parentScope  = $rootScope.$new();

//     parentScope.post = {
//       title: 'Great post!',
//       id: 15
//     };

//     parentScope.comment = {
//       body: 'Great comment',
//       id: 20
//     };

//     directive    = angular.element('<a link-to="home"></a>');
//     mainView     = '<div></div>';
//     $httpBackend.when('GET', 'views/main.html').respond(mainView);
//     scope       = parentScope.$new();

//     $compile(directive)(scope);
//     $httpBackend.flush();
//     scope.$digest();
//     $scope = scope.$$childTail;
//   }));

//   it('creates a link', function() {
//     expect(directive.attr('href')).toEqual('/#/');
//     expect(directive.text()).toEqual('Home');

//     directive = angular.element('<a link-to="dashboard"></a>');
//     $compile(directive)(scope);
//     scope.$digest();
//     $scope = scope.$$childTail;
//     expect(directive.attr('href')).toEqual('/#/dashboard');
//     expect(directive.text()).toEqual('Dashboard');
//   });

//   it('carries attributes over to the directive', function() {
//     directive = angular.element('<a link-to="dashboard" target="_blank"></a>');
//     $compile(directive)(scope);
//     scope.$digest();
//     $scope = scope.$$childTail;
//     expect(directive.attr('target')).toEqual('_blank');
//   });

//   it('creates a link for routes with params', function() {
//     directive = angular.element('<a link-to="posts_comments_path(post, comment)">View Comment</a>');
//     $compile(directive)(scope);
//     scope.$digest();
//     $scope = scope.$$childTail;
//     expect(directive.attr('href')).toEqual('/#/posts/15/comments/20');
//     expect(directive.text()).toEqual('View Comment');
//   });

//   it('creates a link for different params', function() {
//     parentScope = $rootScope.$new();
//     parentScope.country = {
//       country: 'USA'
//     };
//     parentScope.state = {
//       state: 'Pennsylvania'
//     };
//     parentScope.city = {
//       city: 'Philadelphia'
//     };
//     scope     = parentScope.$new();
//     directive = angular.element('<a link-to="map(country, state, city)">View Map</a>');
//     $compile(directive)(scope);
//     scope.$digest();
//     $scope = scope.$$childTail;
//     expect(directive.attr('href')).toEqual('/#/map/USA/Pennsylvania/Philadelphia');
//     expect(directive.text()).toEqual('View Map');
//   });

//   it('works with a resource', function() {
//     parentScope = $rootScope.$new();
//     parentScope.camera = {
//       lens: 'Carl Zeiss',
//       id: 20
//     };
//     scope     = parentScope.$new();
//     directive = angular.element('<a link-to="show_cameras_path(camera)">View Camera</a>');
//     $compile(directive)(scope);
//     scope.$digest();
//     $scope = scope.$$childTail;

//     expect(directive.attr('href')).toEqual('/#/cameras/20');
//     expect(directive.text()).toEqual('View Camera');
//   });

// });
