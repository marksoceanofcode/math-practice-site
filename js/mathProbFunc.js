/*
  Description: All the logic to generate the math problems and handle the specified settings, click events, etc.
  File Name: mathProdFunc.js
  File Path: /js/mathProdFunc.js
*/

/* Math Problem Generator */
var mathProblemGen = (function(){
    /* HTML id vars */
    var flxChkNxtId = "#flxChkNxt";
    var hideSettingsId = "#hideSettings";
    var mathProbId = "#mathProblem";
    var numRangeId = "#numRange";
    var ansIndicatorId = "#ansIndicator";
    var probTypeId = "#probType";
    var settingsId = "#settings";
    var settingsArrowId = "#settingsArrow"
    var userAnswer = "#userAns";
    var workspaceId = "#workspace";

    /* Function variables */
    var _defaultAns = "Not Checked";
    var _op = "random";
    var _mathSolution = null;
    var _mathProblem = "", _mathProblemMsg = "", _workspace = "";
    var _ans = null, _solution = "";
    var _settingsHidden = true;
    var _statsObj = {answered: 0, correct: 0, incorrect: 0/*, partial: 0*/};
    var _wSpaceHdl = [];

    function setup(){
        /* Handlers */
        $(hideSettingsId).click(function(){
            _settingsHidden = (_settingsHidden === true) ? false : true;
            (_settingsHidden === true) ? $(settingsId).css({'display': 'none'}) : $(settingsId).css({'display': 'block'});
            (_settingsHidden === true) ? $(settingsArrowId).removeClass("arrow-up").addClass("arrow-down") : $(settingsArrowId).removeClass("arrow-down").addClass("arrow-up");
        });
        $(flxChkNxtId).click(function() {
            if($(flxChkNxtId).val() === "Check"){
                var userInput = $(userAnswer).val();

                $(ansIndicatorId).empty();
                if(checkAnswer(userInput) === true){
                    $(ansIndicatorId).append("Correct &#10004;");
                    $(ansIndicatorId).css({"color": "green"});
                    $(flxChkNxtId).val("Next");
                }
                else{
                    $(ansIndicatorId).append("Incorrect &#10008;");
                    $(ansIndicatorId).css({"color": "red"});
                }
            }
            else if($(flxChkNxtId).val() === "Next"){
                resetUiValues();
                _wSpaceHdl = [];
                create();
            }
        });
        $(numRangeId).change(function(){
            resetUiValues();
            _wSpaceHdl = [];
            create();
        });
        $(probTypeId).change(function(){
            _op = $(probTypeId).val();
            resetUiValues();
            _wSpaceHdl = [];
            create();
        });

        if($(userAnswer).val() != ""){
            $(userAnswer).val("");
        }

        create();
    };

    function addHandlers(){
        /* Add the handlers for the workspace boxes */
        for(var a = 0; a < _wSpaceHdl.length; a++){
            $('#' + _wSpaceHdl[a]).keyup(function(){
                /* Step 1 get the current ID & current value*/ //'#' + wSpcId
                var curId = '#' + this.id;
                var curVal = this.value;
                var strArr = null, popVal = null;

                /* Step 2 move the entered value to the front */
                strArr = curVal.split("");
                popVal = strArr.pop();
                strArr.unshift(popVal);
                strArr = strArr.join("");

                /* Step 3 empty and reappend the value */
                $(curId).val("");
                $(curId).val(strArr);
            });
        }
    };
    
    /* Append needed UI items */
    function appendAnsMsg(ansMsg){
        $('#mathProblem').append(_mathProblemMsg);
    };
    function appendProblem(){
        $(mathProbId).append(_mathProblem);
    };
    function appendWorkspace(){
        $(workspaceId).append(_workspace);
    };

    function checkAnswer(_ans){
        var answer = _ans;
        var isCorrect = false;

        if(answer == _mathSolution){isCorrect = true;}
        
        _ans = null; //Reset immediately
        return isCorrect;
    };

    function create(){
        problemCreator();
        appendProblem();
        appendAnsMsg();
        appendWorkspace();
        addHandlers();
    };

    /* Creates the problem to be solved */
    function problemCreator(){
        var answer = null, x = null, y = null;
        var maxNum = $(numRangeId).val();
        var op = "", solution = "";
        op  = problemType();

        /* Call functions to create math problems from problem type */
        switch(op){
            case "add":
                genRandomNums();
                createAdditionProblem();
                break;
            case "divide":
                genRandomNums();
                createDivideProblem();
                break;
            case "multiply":
                genRandomNums();
                createMultiplyProblem();
                break;
            case "subtract":
                genRandomNums();
                createSubtractProblem();
                break;
        }

        /* Functions for creating the problems */
        function createAdditionProblem(){
            answer = x + y;
            solution = x + " + " + y;
            _workspace = createWorkspace("+");
            updateProblem(answer, solution);
        };
        function createDivideProblem(){
            answer = x / y;
            solution = x + " / " + y;
            _workspace = createWorkspace("/");
            updateProblem(answer, solution);
        };
        function createMultiplyProblem(){
            answer = x * y;
            solution = x + " x " + y;
            _workspace = createWorkspace("x");
            updateProblem(answer, solution);
        };
        function createSubtractProblem(){
            answer = x - y;
            solution = x + " - " + y;
            _workspace = createWorkspace("-");
            updateProblem(answer, solution);
        };
        function createWorkspace(s){
            var xLen = x.toString().length, yLen = y.toString().length, difXY = null, lgNum = x, smNum = y, numOfWorkSpaces = null;

            /* Find the additional spacing needed to make the workspace look nice */
            /* Different workspaces needed for multiple/divide/add/subtract as well as different lay out for divide/add/subtract */
            if(xLen > yLen){
                difXY = xLen - yLen;
                numOfWorkSpaces = yLen;
            }
            else if(xLen < yLen){
                difXY = yLen - xLen;
                lgNum  = y;
                smNum = x;
                numOfWorkSpaces = xLen;
            }
            else{
                difXY = .4; //Default to 1
                numOfWorkSpaces = yLen;
            }

            var htmlData = '<div style="text-align: right;">' + lgNum + '</div>' +
            '<div style="text-align: right;"><span style="margin-right: ' + difXY + '%;">' + s + '</span>' + ' ' + smNum + '</div>';

            for(var a = 0; a < numOfWorkSpaces; a++){
                var wSpcId = "wSpc" + a;
                htmlData += '<div> <input id="'+ wSpcId +'" type="text"> </div>';

                _wSpaceHdl.push(wSpcId);
            }
            
            return htmlData;
        };
        function genRandomNums(){
            x = Math.floor((Math.random() * maxNum) + 1);
            y = Math.floor((Math.random() * maxNum) + 1);
        };
    };

    /* Returns the math type for the problem */
    function problemType(){
        var avalibleTypes = ["add", "subtract", "multiply", "divide"];
        var aTIndex = 0;
        var type = _op;

        if(type === "random"){
            type = avalibleTypes[Math.floor (Math.random () * avalibleTypes.length)];
        }
        else{
            aTIndex = avalibleTypes.indexOf(_op);
            
            /* Check for invalid index recived from avalibleTypes */
            if(aTIndex == -1){
                console.log("Error. An invalid problem type was passed.");
                return;
            }
        }

        return type;
    };

    function resetUiValues(){
        /* Reset UI values */
        $(flxChkNxtId).val("Check");
        $(mathProbId).empty();
        $(userAnswer).val("");
        $(workspaceId).empty();
        $(ansIndicatorId).empty().append(_defaultAns).css({"color": "#c2c2c2"});
        
        signaturePad.clear(); //Call function from appv.js

        _mathProblemMsg = "";
    };

    function updateProblem(_ans, _solution){
        /* Update the math problem and solution */
        _mathProblem = _solution;
        _mathSolution = _ans;

        //_mathSolution = (mathSolution != Math.floor(_mathSolution)) ? _mathSolution.toFixed(2) : _mathSolution;
        /* Check if the solution is a decimal or a whole number. If its a decimal then round it to two places */
        if(_mathSolution != Math.floor(_mathSolution)){
            _mathSolution = _mathSolution.toFixed(2);
            _mathProblemMsg = " *round to 2 decimal places | Ex: 0.00";
        }
        
        /* Reset pass values */
        _ans = null;
        _solution = "";
    };

    return{
        setup:setup
    };
})();