var youtubeKey = 'AIzaSyDrE7lYH0dpfFFRbX7fKI8Ru2x9YQqOkYQ';
var user = 'UCvXscyQ0cLzPZeNOeXI45Sw';

// Objects DOM

var selectButton = $('#regionsSelected');










//getting video categories





// This function get json and taking religions data.
// There is 107 regions for using for youtube data

var countryGlList = [];
var countryNamesList = [];
let regionfilterforyoutube = () => {


    fetch(`https://www.googleapis.com/youtube/v3/i18nRegions?part=snippet&chart=mostPopular&regionCode=TR&maxResults=50&key=${youtubeKey}`)
        .then(response => {
            return response.json()
        }).then(data => {
            data.items.forEach(element => {

                countryGlList.push(element.snippet.gl);
                countryNamesList.push(element.snippet.name);
                // Addings Options
                selectButton.append($('<option>', {

                    value: element.snippet.gl,
                    text: element.snippet.name
                }));
            });
        })



}
var categorylist = new Array();
regionfilterforyoutube();


// Define what will user choose
var SelectedRegion = 'AE';

var selectedCountResults = 0;

$('#regionsSelected').change(function () {
    SelectedRegion = $(this).val();

})



$('#resultcount').bind('input', function () {
    selectedCountResults = $(this).val();
});



$('#getData').click(function () {
    if ($('#resultcount').val() == '' || $('#resultcount').val() > 50) {
        var warninghtml = `
        <div  class="alert alert-warning  m-3" role="alert" style="width:300px;">
            This is a warning alert—check it out!
        </div>`

        ;

        $('#optionfirst').append(warninghtml);

        setTimeout(function () {
            $('.alert-warning').hide('slow');

        }, 500)


        $('#resultcount').val('');

    } else {
        // reset all after send
        setTimeout(function () {
            $('.alert-warning').hide('slow');

        }, 500)

        $('#resultcount').val('');
        getYoutubeVideos();

    }


})


let showDataOnHtml = (image) => {
    let trendcontainer = $('#trend-container');

    $('.loadingGif').hide('slow');

    $('#trend-container').show(1000);
    $('#trend-container').css('display', 'flex');


    settimeout();
    $('body').css('height', 'auto');
}










let getYoutubeVideos = () => {

    fetch(`https://www.googleapis.com/youtube/v3/videos?part=topicDetails,snippet,id,contentDetails,statistics&chart=mostPopular&regionCode=${SelectedRegion}&maxResults=${selectedCountResults}&key=${youtubeKey}`)
        .then(response => {
            return response.json()
        }).then(data => {
            //remove to options selector
            $('#trend-option-selector').hide(1000, for5sec);
            //$('.all-off-bordered-inner').removeClass('d-flex');

            function for5sec() {
                //add loading logo for 5 seconds
                $('.loadingGif').show('slow');

            }

            setTimeout(showDataOnHtml, 4000);

            console.log(data);


            var index = 1;
            data.items.forEach(element => {

                function truncate(str, n) {
                    newContent = (str.length > n) ? str.substr(0, n - 1) + '&hellip;' : str;

                };


                var elementContentTruncated = element.snippet.localized.description;
                var newContent = '';
                truncate(elementContentTruncated, 150);




                // iso to seconds
                var videodurationtranslated = element.contentDetails.duration;
                var matches = videodurationtranslated.match(/[0-9]+[HMS]/g);

                var seconds = 0;

                matches.forEach(function (part) {
                    var unit = part.charAt(part.length - 1);
                    var amount = parseInt(part.slice(0, -1));

                    switch (unit) {
                        case 'H':
                            seconds += amount * 60 * 60;
                            break;
                        case 'M':
                            seconds += amount * 60;
                            break;
                        case 'S':
                            seconds += amount;
                            break;
                        default:
                            // noop
                    }
                });

                videodurationtranslated = seconds;

                //SECOND TO NORMAL FORMAT

                videodurationtranslated = Number(videodurationtranslated);
                var h = Math.floor(videodurationtranslated / 3600);
                var m = Math.floor(videodurationtranslated % 3600 / 60);
                var s = Math.floor(videodurationtranslated % 3600 % 60);

                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";


                videodurationtranslated = hDisplay + mDisplay + sDisplay;

                fetch(`https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode=${SelectedRegion}&key=AIzaSyDrE7lYH0dpfFFRbX7fKI8Ru2x9YQqOkYQ`)
                    .then(response => {
                        return response.json();
                    }).then(data => {
                        let elementCategoryid = element.snippet.categoryId;
                        data.items.forEach(category => {
                            if (category.id == elementCategoryid) {
                                categorylist.push(category.snippet.title)
                            }
                        });

                    }).then(() => {


                    })



                // var videodurationtranslatedMinute = videodurationtranslated.replace('M',':').replace('H',':').replace('S','');








                var dataHtml = `

                    <div class="trend-item mt-5 mb-5 ml-0 mr-0 w-100 d-flex row  p-0 flex-row justify-content-between align-items-center" data-id="1">
                        <div class="trend-item-Index col-1 m-0 p-0 pl-3 d-flex justify-content-center align-items-center">
                            ${index}
                        </div>    
                    
                        <div class="trend-item-image col-4 m-0 p-0 d-flex align-items-center justify-content-center">
                            <img src="${element.snippet.thumbnails.high.url}" alt="">
                        </div>

                        <div class="trend-item-content col-7 m-0 p-0">
                            <div class="trend-item-title">
                                ${element.snippet.title}
                            </div>
                            <div class="d-flex flex-row">
                                <div class="trend-item-username">
                                    ${element.snippet.channelTitle}
                                </div>
                                <div class="trend-item-view-count">
                                    ${element.statistics.viewCount}
                                </div>
                            </div>

                            <div class="trend-item-description text-muted">
                                ${newContent}
                            </div>

                            
                            <div class="video-duration">
                                ${videodurationtranslated}
                            </div>
                        </div>
                    </div>
                `

                $('#trend-container').append(dataHtml);

                index += 1;

            });


        })







}



function settimeout() {
    setTimeout(() => {
        const yourArray = categorylist;

        let duplicates = []

        const tempArray = [...yourArray].sort()

        for (let i = 0; i < tempArray.length; i++) {
            if (tempArray[i + 1] === tempArray[i]) {
                duplicates.push(tempArray[i])
            }
        }

        const counts = {};
        
        duplicates.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });
        console.log(counts)


    }, 300);
}