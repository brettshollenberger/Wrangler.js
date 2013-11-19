/**
 * GOPHER
 *
 * @module FacultyView.Helpers
 */

/**
 * @directive link-to
 *
 * @param {helper} - The name of the helper to redirect to:
 *
 *     Router
 *       .route('/', {title: 'Home'})
 *       .route('/dashboard')
 *       .route('/posts');
 *
 *     <a link-to="home_path"></a>
 *     <a link-to="dashboard_path">Dashboard</a>
 *     <a link-to="posts_path">Posts</a>
 *
 *     // Optionally, this can be written with the _path portion excluded:
 *     <a link-to="home"></a>
 *     <a link-to="dashboard">Dashboard</a>
 *     <a link-to="posts">Posts</a>
 *
 * @param(s) {object(s), optional} - Optional objects to resolve routes that contain params;
 * e.g. to route to /map/:country/:state/:city, you write this as:
 *
 *     <a link-to="map(country, state, city)">View Map</a>
 *
 * Assuming, of course, that country, state, and city exist on the scope containing the link.
 *
 * ******************************************************************************************
 * BIG BOLD IMPORTANT NOTE: *****************************************************************
 * ******************************************************************************************
 *
 * link-to only works with FacultyRouteProvider, which sets up the helper names and
 * parses params. It will NOT work with Angular's default $routeProvider, which does not
 * provide the necessary functionality.
 *
 * FacultyRouteProvider is a thin wrapper around $routeProvider that resolves route helpers
 * and parameters. It passes all routes provided to it along to $routeProvider, so you can
 * safely use FacultyRouteProvider without changing any other part of your application.
 * This makes it very easy to include the link-to directive in your application without
 * fear of negative consequences.
 *
 */

'use strict';

angular
    .module('FacultyView.Helpers')
    .directive('linkTo', ['$location', 'facultyRoute',
        function($location, Router) {
            function append(str) {
                for (var i = 1, l = arguments.length; i < l; i++) str += arguments[i];
                return str;
            }

            function normalize(helper) {
                if (!helper.match(/\_path/)) return append(helper, '_path');
                return helper;
            }
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                // Transclude any text or images the user might put between the <a> tags
                template: '<a ng-transclude></a>',
                link: function(scope, element, attrs) {
                    var objects = [];
                    // The link-to attribute is parsed as a string. Here, we hunt down any arguments that
                    // might be passed as a function to the link (e.g. map(country, state, city)).
                    attrs.linkTo = attrs.linkTo.replace(/\((\w+)/, function(a, o1) {
                        objects.push(o1);
                        return '';
                    })
                        .replace(/\,\s*(\w+)/g, function(a, o) {
                            objects.push(o);
                            return '';
                        })
                        .replace(/\)/, '');

                    // Here we map each of the parameters we found to objects on the scope.
                    // Router.getRouteFromHelper will parse the helper, and find the params that
                    // are expected to be passed to the path. It will then call those attributes
                    // on each of the objects passed. For instance on /posts/:id, we'd use the path
                    // posts_path(post), and the router will call post.id to obtain its ID attribute.
                    // It will then build the path, filling in the ID attribute for us. 
                    objects = _.map(objects, function(object) {
                        return scope.$eval(object);
                    });

                    // set id to be linkTo before we normalize it, adding path
                    element.attr('id', 'link_to_' + attrs.linkTo.replace('_path', ''));

                    // Router.getRouteFromHelper expects us to hand it xxx_path. Here we normalize
                    // the path name to comply with this expectation.
                    attrs.linkTo = normalize(attrs.linkTo);

                    // We add the link-to element to the beginning of the objects array, so that
                    // we can pass the whole set of arguments in via apply.
                    objects.unshift(attrs.linkTo);

                    var route = angular.copy(Router.getRouteFromHelper.apply({}, objects));
                    if (!route) return;

                    // Here we normalize the returned path, because in Angular apps we should use the
                    // hashbang syntax.
                    if (route.path[0] != '/') route.path = '/' + route.path;
                    if (route.path[1] != '#') route.path = '/#' + route.path;

                    // Via jQuery, we set the href attribute to the returned path
                    element.attr('href', route.path);

                    // Finally, if the user has not transcluded text, we attempt to fill in the title
                    // for them with a default title set in the Router.
                    if (element.text() === '' && route.options.title) element.text(route.options.title);
                }
            };
        }
    ]);
