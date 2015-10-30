(function(){
    'use strict';
    angular
        .module('app')
        .directive('ngXmlConstructor', xmlConstructor)
        .directive('ngXmlElement', xmlElement)
        ;

    function xmlConstructor($log) {
        return {
            restrict: 'ACME',
            scope: {
                ngModel: '='
            },
            templateUrl: '/assets/js/template.html',
            link: function(scope) {
                scope.$watch('ngModel', function(newv){
                    scope.objectModel = newv;
                    $log.debug(newv);
                });

                scope.add = function(list, elem) {
                    list[elem].push({})
                }

                scope.remove = function(list, index) {
                    list.splice(index, 1);
                }
            }
        }
    }

    function xmlElement($log, $compile) {
        return {
            restrict: 'ACME',
            scope: {
                ngModel: '='
            },
            templateUrl: '/assets/js/xmlElement.html',
            link: function(scope, element) {
                scope.$watch('ngModel', function(newv){
                    if (newv) {
                        angular.forEach(newv, function(elem){
                            $log.debug(elem);
                            if (elem) {
                                element.append("<ng-xml-constructor ng-model='elem'></ng-xml-constructor>");
                                $compile(element.contents())(scope);
                            }
                        });
                    }
                    // if (newv && angular.isArray(newv)) {
                    //     element.append("<ng-xml-constructor ng-model='ngModel'></ng-xml-constructor>");
                    //     $compile(element.contents())(scope);
                    // }
                    // element.append("<ng-xml-constructor ng-model='ngModel.title'></ng-xml-constructor>");
                    // $compile(element.contents())(scope);

                });
            }
        }
    }
})();