'use strict';


angular
    .module('ActionDispatch', []);

angular
    .module('ActionDispatch.Routing', ['ngRoute'])
    .provider('ActionRoute', ['$routeProvider',
        function($routeProvider) {
            function inherit(parent, extra) {
                return angular.extend(new(angular.extend(function() {}, {
                    prototype: parent
                }))(), extra);
            }

            var routes = {};

            var config = {
                templateExtension: '.html',
                routeTypes: ['index', 'new', 'edit', 'show']
            };

            this.templateExtension = function templateExtension(extension) {
                if (extension[0] != '.') extension = '.' + extension;
                config.templateExtension = extension;
                return this;
            };

            this.resource = function(resource, options) {
                _.each(config.routeTypes, function(routeType) {
                    new Resource(routeType, resource, options).add();
                });
                return this;
            };

            this.genericMethod = function genericMethod(path, route) {
                if (!route) route = {};
                return this.when(path, route);
            };

            this.route = function(path, route) {
                return this.genericMethod(path, route);
            };

            this.when = function(path, route) {
                if (!route) route = {};
                new Route(path, route).add();

                // create redirection for trailing slashes
                if (path) {
                    var redirectPath = (path[path.length - 1] == '/') ? path.substr(0, path.length - 1) : path + '/';

                    routes[redirectPath] = angular.extend({
                            redirectTo: path
                        },
                        pathRegExp(redirectPath, route)
                    );
                }

                $routeProvider.when(path, route);

                return this;
            };

            var CommonRouteFunctionality = {
                add: function() {
                    routes[this.path] = angular.extend({
                            reloadOnSearch: true
                        },
                        this.options, {
                            helper: this.helper
                        },
                        this.path && pathRegExp(this.path, this.options)
                    );
                    if (!routes.helpers) routes.helpers = {};
                    routes.helpers[this.helper] = this;
                }
            };

            function Resource(type, resource, options) {

                (function init(route) {
                    if (!resource) return;

                    route.type = type;
                    route.resource = resource;
                    route.options = options || {};

                    route.path = (function() {
                        return {
                            index: '/' + route.resource.toLowerCase(),
                            new: '/' + route.resource.toLowerCase() + '/new',
                            edit: '/' + route.resource.toLowerCase() + '/:id/edit',
                            show: '/' + route.resource.toLowerCase() + '/:id'
                        }[route.type];
                    })();

                    route.params = getParams(route.path) || [];

                    route.helper = (function() {
                        var basePath = toSnakeCase(route.resource) + '_path';
                        return {
                            index: basePath,
                            new: 'new_' + basePath,
                            edit: 'edit_' + basePath,
                            show: 'show_' + basePath
                        }[route.type];
                    })();

                    route.options.controller = (function() {
                        var base = capitalize(toCamelCase(route.resource));
                        return {
                            index: base + 'Ctrl',
                            new: base + 'NewCtrl',
                            edit: base + 'EditCtrl',
                            show: base + 'ShowCtrl',
                            delete: base + 'DeleteCtrl',
                            create: base + 'CreateCtrl',
                            update: base + 'UpdateCtrl'
                        }[route.type];
                    })();

                    route.options.title = (function() {
                        return {
                            index: 'All' + route.resource,
                            new: 'New' + route.resource,
                            edit: 'Edit' + route.resource,
                            show: 'Show' + route.resource,
                            delete: 'Delete' + route.resource,
                            create: 'Create' + route.resource,
                            update: 'Update' + route.resource
                        }[route.type];
                    })();

                    route.options.templateUrl = templatize(route.path);

                })(this);
            }

            Resource.prototype = CommonRouteFunctionality;

            function Route(path, options) {

                (function init(route) {
                    route.options = options || {};
                    route.path = path || undefined;
                    route.helper = route.options.helper || undefined;
                    route.params = getParams(route.path) || [];

                    if (!route.helper) {
                        route.helper = (function() {
                            var helper = deparameterize(route.path);
                            if (helper && helper[0] == '/') helper = helper.slice(1);
                            if (!helper) helper = route.options.title;
                            if (helper) return toSnakeCase(helper) + '_path';
                            return 'index_path';
                        })();
                    }

                    if (!route.options.controller) route.options.controller = controllerize(route.path);
                    if (!route.options.templateUrl && !route.options.redirectTo) route.options.templateUrl = templatize(route.path);
                    if (!route.options.title && route.path == '/') route.options.title = capitalize(stripLeadingSlash(route.path));

                })(this);

            }

            Route.prototype = CommonRouteFunctionality;

            function getParams(string) {
                if (!string) return;
                var params = [];
                string.replace(/\:(\w+)/g, function(param) {
                    params.push(param);
                    return param;
                });
                return params;
            }

            function deparameterize(string) {
                if (!string) return;
                return string.replace(/\:(\w+)\/*/g, '');
            }

            var controllerize = function controllerize(string) {
                if (!string) return;
                return capitalize(toCamelCase(stripParams(makeResourceCtrl(string + 'Ctrl'))));
            };

            var makeResourceCtrl = function makeResourceCtrl(string) {
                var resourceTypes = {
                    show: {
                        regex: /\/\:id\/{0,1}Ctrl/,
                        formatter: function(string) {
                            return string.replace(resourceTypes.show.regex, 'ShowCtrl');
                        }
                    }
                };

                _.each(resourceTypes, function(type) {
                    if (string.match(type.regex)) string = type.formatter(string);
                });
                return string;
            };

            // var isParam = function isParam(string) {
            //     return !!string.match(/\:\w{0,}/);
            // };

            var stripParams = function stripParams(string) {
                return string
                    .replace(/\/\:[a-z]{0,}/g, '');
            };

            var templatize = function templatize(string) {
                var suffix = string + config.templateExtension;
                if (string && string.slice(1).match(/\//)) return 'views' + suffix;
                return 'views' + string + suffix;
            };

            var capitalize = function capitalize(string) {
                if (string) return string[0].toUpperCase() + string.slice(1);
            };

            var stripLeadingSlash = function stripLeadingSlash(string) {
                if (string && string[0] == '/') return string.slice(1);
                return string;
            };

            var SPECIAL_CHARS_REGEXP = /([\:\-\_\/]+(.))/g;

            var toCamelCase = function toCamelCase(string) {
                return string.
                replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
                    return offset ? letter.toUpperCase() : letter;
                });
            };

            var toSnakeCase = function toSnakeCase(string) {
                string = string.toLowerCase().replace(/[\/\-]/g, '_');
                if (string.slice(-1) == '_') return string.slice(0, -1);
                return string;
            };

            function pathRegExp(path, opts) {
                if (path.path) path = path.path;
                var insensitive = opts.caseInsensitiveMatch,
                    ret = {
                        originalPath: path,
                        regexp: path
                    },
                    keys = ret.keys = [];

                path = path
                    .replace(/([().])/g, '\\$1')
                    .replace(/(\/)?:(\w+)([\?|\*])?/g, function(_, slash, key, option) {
                        var optional = option === '?' ? option : null;
                        var star = option === '*' ? option : null;
                        keys.push({
                            name: key,
                            optional: !! optional
                        });
                        slash = slash || '';
                        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (star && '(.+?)' || '([^/]+)') + (optional || '') + ')' + (optional || '');
                    })
                    .replace(/([\/$\*])/g, '\\$1');

                ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
                return ret;
            }

            this.otherwise = function(params) {
                this.when(null, params);
                return this;
            };

            this.$get = ['$rootScope', '$location', '$routeParams', '$q', '$injector',
                '$http', '$templateCache', '$sce',
                function($rootScope, $location, $routeParams, $q, $injector,
                    $http, $templateCache, $sce) {

                    var forceReload = false,
                        $route = {
                            routes: routes,

                            reload: function() {
                                forceReload = true;
                                $rootScope.$evalAsync(updateRoute);
                            },
                            getRouteFromHelper: function(helper) {
                                if (!helper.match(/_path/)) throw helper + ' must contain _path';
                                var route = routes.helpers[helper];
                                if (arguments.length > 1) route.path = getNestedURL(arguments);
                                return route;
                            },
                            getURLFromHelper: function(helper) {
                                if (arguments.length > 1) return getNestedURL(arguments);
                                return $route.getRouteFromHelper(helper).path;
                            }
                        };

                    function getNestedURL(args) {
                        var route = routes.helpers[args[0]];
                        var path = route.path;
                        args = _.flatten(Array.prototype.slice.call(args, 1));

                        if (args.length > route.params.length) throw 'Too many arguments';
                        if (args.length < route.params.length) throw 'Not enough arguments';

                        path = buildNestedPath(route.params, args, path);
                        return path;
                    }

                    function buildNestedPath(params, args, path) {
                        _.each(params, function(param) {
                            path = path.replace(param, args[0][noco(param)]);
                            args.shift();
                        });
                        return path;
                    }

                    function noco(str) {
                        return str.replace(/\:/, '');
                    }

                    function switchRouteMatcher(on, route) {
                        var keys = route.keys,
                            params = {};

                        if (!route.regexp) return null;

                        var m = route.regexp.exec(on);
                        if (!m) return null;

                        for (var i = 1, len = m.length; i < len; ++i) {
                            var key = keys[i - 1];

                            var val = 'string' == typeof m[i] ? decodeURIComponent(m[i]) : m[i];

                            if (key && val) {
                                params[key.name] = val;
                            }
                        }
                        return params;
                    }

                    function updateRoute() {
                        var next = parseRoute(),
                            last = $route.current;

                        if (next && last && next.$$route === last.$$route && angular.equals(next.pathParams, last.pathParams) && !next.reloadOnSearch && !forceReload) {
                            last.params = next.params;
                            angular.copy(last.params, $routeParams);
                            $rootScope.$broadcast('$routeUpdate', last);
                        } else if (next || last) {
                            forceReload = false;
                            $rootScope.$broadcast('$routeChangeStart', next, last);
                            $route.current = next;
                            if (next) {
                                if (next.redirectTo) {
                                    if (angular.isString(next.redirectTo)) {
                                        $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                                            .replace();
                                    } else {
                                        $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                                            .replace();
                                    }
                                }
                            }

                            $q.when(next).
                            then(function() {
                                if (next) {
                                    var locals = angular.extend({}, next.resolve),
                                        template, templateUrl;

                                    angular.forEach(locals, function(value, key) {
                                        locals[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value);
                                    });

                                    if (angular.isDefined(template = next.template)) {
                                        if (angular.isFunction(template)) {
                                            template = template(next.params);
                                        }
                                    } else if (angular.isDefined(templateUrl = next.templateUrl)) {
                                        if (angular.isFunction(templateUrl)) {
                                            templateUrl = templateUrl(next.params);
                                        }
                                        templateUrl = $sce.getTrustedResourceUrl(templateUrl);
                                        if (angular.isDefined(templateUrl)) {
                                            next.loadedTemplateUrl = templateUrl;
                                            template = $http.get(templateUrl, {
                                                cache: $templateCache
                                            }).
                                            then(function(response) {
                                                return response.data;
                                            });
                                        }
                                    }
                                    if (angular.isDefined(template)) {
                                        locals['$template'] = template;
                                    }
                                    return $q.all(locals);
                                }
                            }).
                            // after route change
                            then(function(locals) {
                                if (next == $route.current) {
                                    if (next) {
                                        next.locals = locals;
                                        angular.copy(next.params, $routeParams);
                                    }
                                    $rootScope.$broadcast('$routeChangeSuccess', next, last);
                                }
                            }, function(error) {
                                if (next == $route.current) {
                                    $rootScope.$broadcast('$routeChangeError', next, last, error);
                                }
                            });
                        }
                    }

                    function parseRoute() {
                        // Match a route
                        var params, match;
                        angular.forEach(routes, function(route) {
                            if (!match && (params = switchRouteMatcher($location.path(), route))) {
                                match = inherit(route, {
                                    params: angular.extend({}, $location.search(), params),
                                    pathParams: params
                                });
                                match.$$route = route;
                            }
                        });
                        // No route matched; fallback to "otherwise" route
                        return match || routes[null] && inherit(routes[null], {
                            params: {},
                            pathParams: {}
                        });
                    }

                    function interpolate(string, params) {
                        var result = [];
                        angular.forEach((string || '').split(':'), function(segment, i) {
                            if (i === 0) {
                                result.push(segment);
                            } else {
                                var segmentMatch = segment.match(/(\w+)(.*)/);
                                var key = segmentMatch[1];
                                result.push(params[key]);
                                result.push(segmentMatch[2] || '');
                                delete params[key];
                            }
                        });
                        return result.join('');
                    }

                    $rootScope.$on('$locationChangeSuccess', updateRoute);

                    return $route;
                }
            ];
        }
    ]);
