$(document).ready(()=>{

    // let userDate = moment().add(10, 'seconds').add(0, 'minutes').add(50, 'hours');
    let userDate = moment().add(10, 'seconds');

    // TODO: User give input


    // $('.top .front').html(counter);
    // $('.top .back').html(counter+1);
    // $('.bottom .front').html(counter+1);
    // $('.bottom .back').html(counter);

   $('#countdown').countdown({
      "targetDate" : userDate
   });



});

(function ( $ ) {

    $.fn.countdown = function(options) {

        displayHHMMSS($(this).attr("id"), options.targetDate);
    };


    function createGroup(parentDivName, className, id, child, description){
        let $group = $("<div/>", {
            "id": id,
            "class": className,
            append: `<div class="description">${description}</div>`,
            appendTo: '#' + parentDivName

        });

        child.forEach((item)=>{
            createSingleDigit($group, item);
        });
    }


    function createSingleDigit($group, childObj){

        //create container
        let $digitContainer = $("<div/>", {


            "id": childObj.id,
            "class": "digit-container",      // ('class' is still better in quotes)
            // css: {
            //     color: "red",
            //     fontSize: "3em",
            //     cursor: "pointer"
            // },
            // on: {
            //     mouseenter: function() {
            //         console.log("PLEASE... "+ $(this).text());
            //     },
            //     click: function() {
            //         console.log("Hy! My ID is: "+ this.id);
            //     }
            // },
            // append: childObj.value,
            appendTo: $group

        });
        //create top
        var $top = $('<div/>',{
            'class': 'top',
            append: `<div class="front">${childObj.value}</div><div class="back">${childObj.value}</div>`,
            appendTo: $digitContainer
        });


        //create bottom
        var $bottom= $('<div/>',{
            'class': 'bottom',
            append: `<div class="front">${childObj.value}</div><div class="back">${childObj.value}</div>`,
            appendTo: $digitContainer
        });

    }

    function createSeparator(parentDivName,id){
        let $digitContainer = $("<div/>", {

            // PROPERTIES HERE
            "id": id,
            "class": "separator",      // ('class' is still better in quotes)
            append: "<span>:</span>",
            appendTo: '#' + parentDivName

        });
    }

    function toggleChange($element, newValue, oldValue){

        $element.find('.front').toggleClass('active');

        $element.find('.top .front').html(oldValue);
        $element.find('.top .back').html(newValue);
        $element.find('.bottom .front').html(newValue);
        $element.find('.bottom .back').html(oldValue);


        setTimeout(()=>{
            $element.find('.front').toggleClass('active');
        }, 100);
    }

    function displayHHMMSS(parentId,userDate){



        let results =   findTimeDifference(userDate).split(':');

        let hourObjs = convertToDisplayObject(results[0], "hours-digit-"),
            minuteObjs = convertToDisplayObject(results[1], "minutes-digit-"),
            secondsObjs = convertToDisplayObject(results[2], "seconds-digit-");


        createGroup(parentId, 'group-wrapper','hours-wrapper',hourObjs, 'HOURS');

        createSeparator(parentId, 'hours-minutes-separator');
        createGroup(parentId, 'group-wrapper','minutes-wrapper',minuteObjs, 'MINUTES');

        createSeparator(parentId, 'minute-second-separator');
        createGroup(parentId, 'group-wrapper','seconds-wrapper',secondsObjs, 'SECONDS');

        $('.front').addClass('active');


        let updateClockInterval = setInterval(() => {
            //get difference again
            console.log(userDate.diff(moment()));
            if(userDate.diff(moment()) < 1000 ){
                clearInterval(updateClockInterval);
            }

            results =   findTimeDifference(userDate).split(':');

            //compare difference
            hourObjs = convertToDisplayObject(results[0], "hours-digit-"),
            minuteObjs = convertToDisplayObject(results[1], "minutes-digit-"),
            secondsObjs = convertToDisplayObject(results[2], "seconds-digit-");

            checkDifferenceAndToggle(hourObjs);
            checkDifferenceAndToggle(minuteObjs);
            checkDifferenceAndToggle(secondsObjs);

        }, 1000);
    }

    function convertToDisplayObject(text, idPrefix){

        let results = [];
        let index = 0;

        let array = text.split("");

        if(array.length < 2){
            array.splice(0,0, "0")
        }

        array.forEach((item)=>{
            results.push({"value": item, "id": idPrefix + index++});
        });

        return results;
    }

    function findTimeDifference(userDate){
        var diiferenceInMillisecond = userDate.diff(moment());
        var difference = moment.duration(diiferenceInMillisecond);
        var results = Math.floor(difference.asHours()) + moment.utc(diiferenceInMillisecond).format(":mm:ss");

        return results;
    }

    function checkDifferenceAndToggle(array){

        array.forEach((item)=>{
            let oldValue = $('#'.concat(item.id).concat(' .top .back')).html();
            if(oldValue != item.value){
                toggleChange($('#'.concat(item.id) ), item.value, oldValue);
            }
        });

    }


}( jQuery ));


