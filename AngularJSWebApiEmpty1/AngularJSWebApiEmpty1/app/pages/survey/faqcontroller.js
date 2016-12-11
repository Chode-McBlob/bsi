(function () {
    'use strict';

    var congressApp = angular.module('faqCtrl', [])

    .controller('surveycontroller', ['$scope', '$routeParams', '$translate', '$rootScope', 'ObjectTranslator', '$http', function ($scope, $routeParams, $translate, $rootScope, ObjectTranslator, $http) {

        function initLang() {
            var fields = ['q', 'a'];
            $scope.article = ObjectTranslator.GetNested('survey', fields).then(function (res) {
                $scope.article = res[0].acts;
            })
            
            if (!$scope.article || $scope.article.title == 'title')
                $location.url('/notfound');
        }

        ObjectTranslator.Subscribe($scope, initLang);

        $scope.subscribed;
        $scope.formsent;
        $scope.frmuser = {q1:[],q2:[],q3:'2', email: ''};

        $scope.sendForm = function () {
            var userSubscribed = $scope.subscribed ? 'yes' : 'no';
            var vm = {
                id: 4,
                q1: $scope.frmuser.q1.join(","),
                q2: $scope.frmuser.q2.join(","),
                q3: $scope.frmuser.q3,
                email: $scope.frmuser.email,
                subs: userSubscribed
            };
            $http.post('/api/mc.php', angular.toJson(vm)).then(function (response) {
                console.log(response);
            }, function error(err) {
                console.log('form did not post successful! ' + JSON.stringify(err));
            });
            $scope.formsent = true;
        }

        $scope.togglePrefs = function (pref, fld) { // toggle selection for a given fruit by name
            var idx = fld.indexOf(pref);
            if (idx > -1)// is currently selected
                fld.splice(idx, 1);
            else// is newly selected 
                fld.push(pref);
        }
    }])

})();
