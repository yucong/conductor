define(function(require,exports,module){
    var Events = require("event");
    var Rule = require("rule");

    var Rules = function($scope,$element,$filter){
        Events.mixin($scope);
        $scope.open = true;
        $scope.editpv = false;
        $scope.rules = [];
        $scope.pv = "";

        function apply(){
            if(!$scope.$$phase){
                $scope.$apply();
            }
        }

        $scope.safeapply = apply;

        $scope.dyeall = function(filter){
            filter = filter || function(){return true;}
            $scope.rules.filter(filter).forEach(function(rule,index){
                rule.createDyer($scope.doc);
                rule.dyeSelf();
            });
        }

        $scope.editPvDone = function(){
            $scope.editpv = false;
            $scope.save();
        }

        $scope.editPv = function(){
            $scope.editpv = true;
            setTimeout(function(){
                $($element).find("#pv").get(0).focus();
            },10);
        }

        $scope.setPv = function(pv){
            $scope.pv = pv;
            apply();
        }

        $scope.add = function(data){
            var rule = new Rule(data);
            rule.list = $scope.rules;
            rule.createDyer($scope.doc);
            if($scope.rules.indexOf(rule) == -1){
                $scope.rules.push(rule);
                // ref: http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                apply();
            }
            rule.dyeSelf();
        }

        $scope.save = function(){
            var rules = $scope.rules.map(function(rule){
                return rule.getData();
            });
            $scope.fire("save",{
                rules:rules,
                pv:$scope.pv
            });
        }

        $scope.edit = function($event){
            $scope.fire("edit",this);
        }

        $scope.updateRule = function(row,rule){
            row.rule.update(rule);
            $scope.save();
        }

        $scope.remove = function(){
            var me = this;
            var rule = $scope.rules.filter(function(rule){
                return me.rule == rule;
            })[0];
            if(!rule){return};
            rule.clear();
            $scope.rules.splice($scope.rules.indexOf(rule),1);
            $scope.rules.forEach(function(rule){
                rule.updateIndex();
            })
            $scope.save();
        }

        $scope.toggle = function(){
            this.open = !this.open;
        }
    }


    module.exports = Rules
});