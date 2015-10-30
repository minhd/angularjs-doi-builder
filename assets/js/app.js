(function(){
    'use strict';
    angular
        .module('app', [])
        .controller('mainCtrl', mainCtrl);

    function mainCtrl($scope, $log, $http) {
        $scope.xmlString = "<stuff></stuff>";
        $scope.xmlObject = {
            father: {
                attributes: [
                    {name:'dad'}
                ],
                elements: [
                    {child : {attributes: [{name:'son'}]}
                    }
                ],
            }
        };

        $http.get("valid.xml").then(function(response){
            var xml = $.parseXML(response.data);
            $scope.xmlObject = $scope.xmlToJson(xml);
        });

        $scope.xmlToJson = function(xml) {
            // Create the return object
            var obj = {};

            if (xml.nodeType == 1) { // element
                // do attributes
                if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                }
            } else if (xml.nodeType == 3) { // text
                //clean empty text
                if (xml.nodeValue.trim()!=""){
                    obj = xml.nodeValue;
                }
            }

            // do children
            if (xml.hasChildNodes()) {
                for(var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof(obj[nodeName]) == "undefined") {
                        obj[nodeName] = $scope.xmlToJson(item);
                    } else {
                        if (typeof(obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push($scope.xmlToJson(item));
                    }
                }
            }

            //clean empty texts
            if (angular.isArray(obj['#text'])) {
                var blank = true;
                var str = "";
                angular.forEach(obj["#text"], function(t){
                    if (!angular.equals({}, t) && t.trim()!="") {
                        blank = false;
                        str+=t+"\n";
                    }
                })
                if (blank) {
                    delete obj["#text"];
                } else obj["#text"] = str;
            }
            return obj;
        };
    }
})();